import mongoose from 'mongoose';

interface IEvent {
  id?: string;
  type: string;
  originatorUserId: string;
  originatorIp: string;
  metadata: mongoose.Schema.Types.Mixed;
  created_at?: Date;
  updated_at?: Date;
}

const eventSchema = new mongoose.Schema({
  id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString()
  },
  type: String,
  originatorUserId: String,
  originatorIp: String,
  metadata: mongoose.Schema.Types.Mixed,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

export { Event, IEvent };
