import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

// Multer setup for in-memory storage
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Get GridFS bucket by name
export function getBucket(bucketName: string) {
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB not connected');
    return new GridFSBucket(db, { bucketName });

}

// MIME allowlist
export function isImage(file?: Express.Multer.File) {
    const allowed = new Set(['image/png', 'image/jpeg', 'image/webp']);
    if (!file) throw new Error('No file uploaded');
    if (!allowed.has(file.mimetype)) throw new Error('Unsupported file type');
}

// Save a buffer to GridFS and resolve the created file id
export async function saveImageBuffer(buffer: Buffer, mimetype: string, metadata?: Record<string, any>): Promise<ObjectId> {
    const bucket = getBucket('images');
    const filename = `img-${Date.now()}`;
    const uploadStream = bucket.openUploadStream(filename, {
        contentType: mimetype,
        metadata,
    });
    return await new Promise<ObjectId>((resolve, reject) => {
        Readable.from(buffer)
            .pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => resolve(uploadStream.id as ObjectId));
    });
}