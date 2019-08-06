import * as mongoose from 'mongoose';

export interface StockDocument extends mongoose.Document {
  symbol: string;
  likes: Number;
}

const StockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<StockDocument>('Stock', StockSchema);
