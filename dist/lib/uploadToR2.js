"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToR2 = void 0;
// uploadToR2.js
const client_s3_1 = require("@aws-sdk/client-s3");
const r2Client_1 = __importDefault(require("./r2Client"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const uploadToR2 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileKey = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
    try {
        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        yield r2Client_1.default.send(new client_s3_1.PutObjectCommand(uploadParams));
        const imageUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileKey}`;
        return imageUrl;
    }
    catch (error) {
        console.error("Error uploading to R2", error);
        throw new Error("File upload failed");
    }
});
exports.uploadToR2 = uploadToR2;