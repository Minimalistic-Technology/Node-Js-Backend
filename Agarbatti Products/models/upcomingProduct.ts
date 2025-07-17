import mongoose from 'mongoose';

const upcomingProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
});

export const UpcomingProductModel = mongoose.model('UpcomingProduct', upcomingProductSchema);
