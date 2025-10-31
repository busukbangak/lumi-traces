import mongoose, { Schema } from 'mongoose';

export enum TraceType {
    Adventure = 'ADVENTURE',
    Knowledge = 'KNOWLEDGE',
}

export enum TraceStatus {
    ACTIVE = 'ACTIVE',
    MISSING = 'MISSING',
    PENDING = 'PENDING',
    REMOVED = 'REMOVED',
    INVALID = 'INVALID'
}

const traceSchema = new mongoose.Schema({
    status: { type: String, enum: Object.values(TraceStatus), required: true }, // Status field
    position: { type: [Number], required: true }, // Position as an array of numbers
    title: { type: String, required: true }, // Title field
    description: { type: String, required: true }, // Description field
    imageID: { type: Schema.Types.ObjectId, ref: 'images.files', required: true }, // Image field
    traceType: { type: String, enum: Object.values(TraceType), required: true }, // Trace type field
    dateSpotted: { type: Date, required: true }, // Date found
    tracker: { type: String, required: true }, // User who tracked the trace
});

export const Trace = mongoose.model('Trace', traceSchema);