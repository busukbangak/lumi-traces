import rateLimit from 'express-rate-limit';

// General API rate limiter - applies to all requests
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes (applies to everyone)
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for trace creation - prevents spam
export const traceCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 trace creations per hour (generous for legitimate use)
    message: 'Too many traces created from this IP, please try again in an hour.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Very strict limiter for authentication attempts
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per 15 minutes
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});
