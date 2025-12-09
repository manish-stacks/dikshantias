import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

/**
 * Upload a file to S3 with a dynamic folder
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  mimetype: string,
  folder: string
) {
  // sanitize filename and add a UUID to avoid collisions
  const safeFileName = fileName.replace(/\s+/g, "_");
  const key = `${folder}/${Date.now()}-${randomUUID()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  });

  await s3.send(command);

  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    key,
    url,
  };
}

/**
 * Delete a file from S3 by key
 */
export async function deleteFromS3(key?: string) {
  if (!key) return;
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    console.log(`Deleted from S3: ${key}`);
  } catch (err) {
    console.error("Failed to delete file from S3:", err);
  }
}
