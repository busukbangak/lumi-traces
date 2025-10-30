import mongoose, { Schema } from 'mongoose';

const traceSchema = new mongoose.Schema({
    status: { type: String, enum: ['ACTIVE', 'MISSING', 'PENDING', 'REMOVED', 'INVALID'], required: true }, // Status field
    position: { type: [Number], required: true }, // Position as an array of numbers
    title: { type: String, required: true }, // Title field
    description: { type: String, required: true }, // Description field
    imageID: { type: Schema.Types.ObjectId, ref: 'images.files', required: true }, // Image field
});

export const Trace = mongoose.model('Trace', traceSchema);