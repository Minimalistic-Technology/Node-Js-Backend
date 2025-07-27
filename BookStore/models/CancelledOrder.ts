import mongoose, { Document, Schema } from 'mongoose';

export interface ICancelledOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    bookId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  status: 'pending' | 'shipped' | 'cancelled';
  cancelReason?: string;
}

const cancelledOrderSchema = new Schema<ICancelledOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'shipped', 'cancelled'],
    default: 'pending'
  },
  cancelReason: {
    type: String,
    default: null
  }
}, { timestamps: true });

const CancelledOrder = mongoose.model<ICancelledOrder>('CancelledOrder', cancelledOrderSchema);

export default CancelledOrder;
