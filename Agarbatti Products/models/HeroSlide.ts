import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true } 
);

export const HeroSlideModel = mongoose.model('HeroSlide', heroSlideSchema);
