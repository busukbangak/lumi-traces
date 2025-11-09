import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const verifyRecaptcha = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // Try to authenticate user first (optional)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
            req.user = decoded;
            // Authenticated user, skip reCAPTCHA
            next();
            return;
        } catch (err) {
            // Invalid token, continue to reCAPTCHA check
        }
    }

    const recaptchaToken = req.body?.recaptchaToken;

    if (!recaptchaToken) {
        res.status(400).json({ error: 'reCAPTCHA token is required' });
        return;
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        
        const response = await fetch(verificationURL, {
            method: 'POST',
        });

        const data = await response.json();

        if (!data.success) {
            res.status(400).json({ error: 'reCAPTCHA verification failed' });
            return;
        }

        // Verification successful, proceed to next middleware
        next();
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        res.status(500).json({ error: 'Failed to verify reCAPTCHA' });
    }
};
