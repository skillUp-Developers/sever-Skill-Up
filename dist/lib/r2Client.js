"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
// r2Client.js
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client = new client_s3_1.S3({
    region: 'auto', // Cloudflare uses auto-region detection
    endpoint: (_a = process.env.R2_ENDPOINT) !== null && _a !== void 0 ? _a : "",
    credentials: {
        accessKeyId: (_b = process.env.R2_ACCESS_KEY_ID) !== null && _b !== void 0 ? _b : "", // Access key from your .env.local
        secretAccessKey: (_c = process.env.R2_SECRET_ACCESS_KEY) !== null && _c !== void 0 ? _c : "", // Secret key from your .env.local
    },
});
exports.default = s3Client;
