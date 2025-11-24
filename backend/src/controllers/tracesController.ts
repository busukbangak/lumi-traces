import { Request, Response } from 'express';
import { Trace } from '../models/traces';
import { isImage, saveImageBuffer } from '../middlewares/upload';
import { Types } from 'mongoose';

export const createTrace = async (req: Request, res: Response) => {
    try {
        // If a file is provided, upload to GridFS and set imageID
        if (req.file) {
            isImage(req.file);
            const imageID = await saveImageBuffer(req.file.buffer, req.file.mimetype, { source: 'createTrace' });
            req.body.imageID = imageID.toString();
        }

        // Require imageID
        if (!req.body.imageID) {
            return res.status(400).json({ error: 'imageID is required (upload a file or provide an existing imageID)' });
        }

        // Validate imageID format (Important, if only sent as text and not image before)
        if (typeof req.body.imageID === 'string') {
            if (!Types.ObjectId.isValid(req.body.imageID)) {
                return res.status(400).json({ error: 'imageID must be a valid 24-char hex ObjectId' });
            }
        }

        // Parse position from string "[121, 123]" to [121, 123]
        if (req.body.position && typeof req.body.position === 'string') {
            const cleaned = req.body.position.trim().replace(/^\[|\]$/g, '');
            req.body.position = cleaned.split(',').map((n: string) => Number(n.trim()));
        }

        const marker = new Trace(req.body);
        await marker.save();
        res.status(201).json(marker);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
};

export const getTraces = async (req: Request, res: Response) => {
    try {
        const markers = await Trace.find();
        res.status(200).json(markers);
    } catch (error: any) {
        console.error('Error fetching traces:', error);
        res.status(500).json({ error: 'Failed to fetch traces' });
    }
};

export const getTraceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const trace = await Trace.findById(id);
        if (!trace) {
            return res.status(404).json({ error: 'Trace not found' });
        }
        res.status(200).json(trace);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trace' });
    }
};

export const updateTrace = async (req: Request, res: Response) => {
    const { id } = req.params;
    const marker = await Trace.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(marker);
};

export const deleteTrace = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Trace.findByIdAndDelete(id);
    res.status(204).send();
};