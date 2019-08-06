import * as mongoose from 'mongoose';

export interface VoterDocument extends mongoose.Document {
  voterIp: string;
}

const VoterSchema = new mongoose.Schema(
  {
    voterIp: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<VoterDocument>('Voter', VoterSchema);
