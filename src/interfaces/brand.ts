import mongoose, { Document, Schema } from 'mongoose';

interface IBrand extends Document {
  name: string;
  description: string;
}

const BrandSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Brand = mongoose.model<IBrand>('Brand', BrandSchema);

export { Brand, IBrand };
