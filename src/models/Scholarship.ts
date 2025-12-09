import mongoose, { Schema, Document } from "mongoose";

export interface IScholarship extends Document {
  name: string;
  phone: string;
  gender?: string;
  category?: string;
  course?: string;
  medium?: string;
  scholarship?: string;
  certificate: {
    url: string;
    key: string;
    alt: string;
  };
  photo: {
    url: string;
    key: string;
    alt: string;
  };
  createdAt: Date;
}

const ScholarshipSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String },
  category: { type: String },
  course: { type: String },
  medium: { type: String },
  scholarship: { type: String },
  certificate: {
    url: { type: String, required: false },
    key: { type: String, required: false },
    alt: { type: String, default: "" },
  },
  photo: {
    url: { type: String, required: false },
    key: { type: String, required: false },
    alt: { type: String, default: "" },
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Scholarship ||
  mongoose.model<IScholarship>("Scholarship", ScholarshipSchema);
