// r2Client.js
import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3({
  region: 'auto',  // Cloudflare uses auto-region detection
  endpoint: process.env.R2_ENDPOINT?? "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",  // Access key from your .env.local
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",  // Secret key from your .env.local
  },
});


export default s3Client ;
