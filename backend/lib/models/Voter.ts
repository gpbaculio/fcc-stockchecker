import * as mongoose from 'mongoose';

export interface VoterDocument extends mongoose.Document {
  voterIp: string;
  stocksLiked: string[];
}

const VoterSchema = new mongoose.Schema(
  {
    voterIp: {
      type: String,
      required: true
    },
    stocksLiked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<VoterDocument>('Voter', VoterSchema);
