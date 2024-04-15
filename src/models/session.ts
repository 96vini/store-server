import mongoose from 'mongoose';

interface ISession {
  id?: string;
  token: string;
  user_id: mongoose.Types.ObjectId[];
  expires_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true
    },
    user_id: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
    },
    expires_at: {
      type: Date
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    autoIndex: true,
    collection: 'sessions'
  }
);

const Session = mongoose.model('Sessions', SessionSchema);

export { Session, ISession };
