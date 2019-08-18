import * as mongoose from 'mongoose';

export interface StockDocument extends mongoose.Document {
  symbol: string;
  likersIp: string[];
  totalLikes: number;
}

const StockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true
    },
    likersIp: {
      type: [String],
      required: false,
      default: []
    },
    totalLikes: {
      type: Number,
      default: 0,
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<StockDocument>('Stock', StockSchema);
