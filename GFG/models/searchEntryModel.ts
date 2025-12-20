import mongoose from 'mongoose';

const searchEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['language', 'problem'],
    required: true
  },
  keyword: {
    type: String,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  }
}, { timestamps: true });

export default mongoose.model('SearchEntry', searchEntrySchema);
