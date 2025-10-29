import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb';

export async function connectDB(uri: string, dbName?: string) {
    if (mongoose.connection.readyState === 1) return mongoose.connection
    await mongoose.connect(uri, dbName ? { dbName } : undefined)
    return mongoose.connection
}

export async function disconnectDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}