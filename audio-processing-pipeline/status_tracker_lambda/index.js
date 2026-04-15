const crypto = require("crypto");
const https = require("https");
const url = require("url");

/**
 * Signer Lambda
 * Intercepts AWS Batch status events from EventBridge,
 * signs them with HMAC SHA-256, and forwards to the backend webhook.
 */
exports.handler = async (event) => {
  console.log("Received EventBridge event:", JSON.stringify(event, null, 2));

  const secret = process.env.WEBHOOK_SECRET;
  const backendUrl = process.env.BACKEND_URL;

  if (!secret || !backendUrl) {
    console.error("Missing configuration: WEBHOOK_SECRET or BACKEND_URL");
    throw new Error("Configuration error");
  }

  const payload = JSON.stringify({
    jobId: event.detail.jobId,
    status: event.detail.status,
    timestamp: Date.now(),
  });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    const response = await postRequest(
      `${backendUrl}/api/webhooks/aws/audio-status`,
      payload,
      signature,
    );
    console.log("Successfully notified backend. Status:", response.statusCode);
  } catch (err) {
    console.error("Webhook request failed:", err.message);
    throw err; // Trigger Lambda retry
  }
};

/**
 * Helper to perform HTTPS POST request without external dependencies
 */
function postRequest(rawUrl, payload, signature) {
  const parsedUrl = url.parse(rawUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
      "X-Sonic-Signature": signature,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
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
