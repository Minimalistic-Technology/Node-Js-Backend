import mongoose from 'mongoose';

const dashboardStatSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('DashboardStat', dashboardStatSchema);
