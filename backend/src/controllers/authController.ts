import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Find user in database
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            token, 
            user: { username: user.username, role: user.role } 
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        res.status(201).json({ 
            message: 'User created successfully',
            user: { username: user.username, role: user.role }
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
};

export const verifyToken = (req: Request, res: Response) => {
    // If we reach here, token is valid (checked by middleware)
    res.status(200).json({ valid: true });
};
