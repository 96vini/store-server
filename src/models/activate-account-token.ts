import mongoose from 'mongoose';

interface IActivateAccountTokens {
  id?: string;
  user_id?: mongoose.Types.ObjectId[];
  used?: boolean;
  expires_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const ActivateAccountTokenSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: new mongoose.Types.ObjectId().toString()
    },
    user_id: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
    },
    used: {
      type: Boolean,
      default: false
    },
    expires_at: {
      type: Date,
      required: true
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
    collection: 'activate_account_tokens'
  }
);

const ActivateAccountTokens = mongoose.model(
  'ActivateAccountTokens',
  ActivateAccountTokenSchema
);

export { ActivateAccountTokens, IActivateAccountTokens };
