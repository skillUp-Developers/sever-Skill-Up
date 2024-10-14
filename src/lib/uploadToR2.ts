import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./r2Client";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Specify that the file parameter is of type Express.Multer.File
export const uploadToR2 = async (file: Express.Multer.File): Promise<string> => {
  if (!process.env.R2_BUCKET_NAME || !process.env.R2_ENDPOINT) {
    throw new Error("R2_BUCKET_NAME or R2_ENDPOINT is not defined in the environment variables.");
  }
  const fileKey = `${uuidv4()}${path.extname(file.originalname)}`;

  try {
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://pub-3ea46b7dcfbf4dd9828bfd06c1989ace.r2.dev/${fileKey}`; 
    console.log("Image URL:", imageUrl); // Log the URL for debugging
    return imageUrl; // Return the URL as a string
  } catch (error) {
    console.error("Error uploading to R2", error);
    throw new Error("File upload failed");
  }
};
