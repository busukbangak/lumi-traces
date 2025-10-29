import { Request, Response } from 'express';
import { Trace } from '../models/traces';

export const createTrace = async (req: Request, res: Response) => {
    const marker = new Trace(req.body);
    await marker.save();
    res.status(201).json(marker);
};

export const getTraces = async (req: Request, res: Response) => {
    const markers = await Trace.find();
    res.status(200).json(markers);
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