import { z } from 'zod';

export const timestampSchema = z.preprocess(
    (val) => {
        if (typeof val === 'string' || typeof val === 'number') {
            return new Date(val);
        }
        return val;
    },
    z.date().optional()
);