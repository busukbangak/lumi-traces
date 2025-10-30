import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getBucket, isImage, saveImageBuffer } from '../middlewares/upload';
import { Trace } from '../models/traces';

// Handle uploading a single image from field name 'image'
export async function uploadImage(req: Request, res: Response) {
    try {
        isImage(req.file);
        const id = await saveImageBuffer(req.file!.buffer, req.file!.mimetype, { source: 'uploadImage' });
        res.status(201).json({ imageID: id.toString() });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
}

// Stream image by ObjectId
export async function streamImage(req: Request, res: Response) {
    try {
        const id = new ObjectId(req.params.id);
        const bucket = getBucket('images');
        const files = await bucket.find({ _id: id }).toArray();
        if (!files.length) return res.status(404).send('Not found');

        const file = files[0] as any;
        if (file.contentType) res.setHeader('Content-Type', file.contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        bucket
            .openDownloadStream(id)
            .on('error', () => res.status(404).send('Not found'))
            .pipe(res);
    } catch {
        res.status(400).send('Invalid id');
    }
}

// Delete image and unlink from any Trace documents
export async function deleteImage(req: Request, res: Response) {
    try {
        const id = new ObjectId(req.params.id);
        const bucket = getBucket('images');
        await bucket.delete(id);
        await Trace.updateMany({ imageID: id }, { $set: { imageID: null } });
        res.sendStatus(204);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
}