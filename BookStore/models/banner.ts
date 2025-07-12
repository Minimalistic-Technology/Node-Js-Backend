import { Schema, model, Document } from 'mongoose';

interface IBanner extends Document {
    message: string;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
}

const bannerSchema = new Schema<IBanner>({
    message: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
});

export const Banner = model<IBanner>('Banner', bannerSchema);