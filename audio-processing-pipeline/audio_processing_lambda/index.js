const { BatchClient, SubmitJobCommand } = require("@aws-sdk/client-batch");

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

            console.log(
              `Submitting Batch job for s3://${bucketName}/${objectKey}`,
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
    body: "Batch jobs submitted successfully.",
  };
};
