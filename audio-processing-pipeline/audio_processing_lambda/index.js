const { BatchClient, SubmitJobCommand } = require("@aws-sdk/client-batch");
const crypto = require("crypto");
const https = require("https");
const url = require("url");

const batchClient = new BatchClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.AWS_ENDPOINT_URL && {
    endpoint: process.env.AWS_ENDPOINT_URL,
  }),
});

exports.handler = async (event) => {
  console.log("Received event from SQS:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    try {
      const s3Event = JSON.parse(record.body);

      if (s3Event.Records) {
        for (const s3Record of s3Event.Records) {
          if (s3Record.eventName.startsWith("ObjectCreated:")) {
            const bucketName = s3Record.s3.bucket.name;
            const objectKey = decodeURIComponent(
              s3Record.s3.object.key.replace(/\+/g, " "),
            );

            // Parse recordingId from S3 key (Format: recordings/{recordingId}.ext)
            const keyParts = objectKey.split("/");
            const filename = keyParts[keyParts.length - 1];
            const recordingId = filename.split(".")[0];

            console.log(
              `Submitting Batch job for s3://${bucketName}/${objectKey} (Recording ID: ${recordingId})`,
            );

            const safeKeyName = objectKey
              .replace(/[^a-zA-Z0-9_-]/g, "-")
              .substring(0, 100);

            const submitJobCommand = new SubmitJobCommand({
              jobName: `process-${safeKeyName}-${Date.now()}`,
              jobQueue: process.env.BATCH_JOB_QUEUE,
              jobDefinition: process.env.BATCH_JOB_DEFINITION,
              containerOverrides: {
                environment: [
                  { name: "INPUT_BUCKET", value: bucketName },
                  { name: "INPUT_KEY", value: objectKey },
                  {
                    name: "OUTPUT_BUCKET",
                    value: process.env.PROCESSED_BUCKET_NAME,
                  },
                ],
              },
            });

            const response = await batchClient.send(submitJobCommand);
            console.log(
              `Successfully submitted Batch Job: ${response.jobId} for object: ${objectKey}`,
            );

            await notifyBackend(recordingId, response.jobId);
          }
        }
      } else {
        console.log(
          "No S3 Records found in SQS message body (might be a test message).",
        );
      }
    } catch (error) {
      console.error("Error processing SQS record:", error);
      throw error;
    }
  }

  return {
    statusCode: 200,
    body: "Batch jobs submitted successfully and registered with backend.",
  };
};

/**
 * Notify backend of the new Batch Job ID
 */
async function notifyBackend(recordingId, jobId) {
  const secret = process.env.WEBHOOK_SECRET;
  const backendUrl = process.env.BACKEND_URL;

  if (!secret || !backendUrl) {
    console.warn(
      "WEBHOOK_SECRET or BACKEND_URL not set. Skipping registration.",
    );
    return;
  }

  const registrationUrl = `${backendUrl}/api/webhooks/aws/register-job`;

  const payload = JSON.stringify({
    recordingId: recordingId,
    jobId: jobId,
    timestamp: Date.now(),
  });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  console.log(`Notifying backend: ${registrationUrl}`);

  try {
    await postRequest(registrationUrl, payload, signature);
    console.log(`Backend registered jobId: ${jobId}`);
  } catch (err) {
    console.error(`Failed to register job with backend: ${err.message}`);
    // We don't throw here to avoid SQS retries if the job is already submitted
    // but the backend notification failed.
  }
}

/**
 * Helper to perform HTTPS POST request
 */
function postRequest(rawUrl, payload, signature) {
  const parsedUrl = url.parse(rawUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
    path: parsedUrl.path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
      "X-Sonic-Signature": signature,
    },
  };

  const protocol = parsedUrl.protocol === "https:" ? https : require("http");

  return new Promise((resolve, reject) => {
    const req = protocol.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: data });
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.write(payload);
    req.end();
  });
}
