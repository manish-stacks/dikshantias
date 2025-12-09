import mongoose, { Schema, Document, model, Model } from "mongoose";

export interface IWebSettings extends Document {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  image: {
    url: string;
    key: string;
  };
  googleMap: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  telegram: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebSettingsSchema: Schema<IWebSettings> = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String, required: true },
    address: { type: String },
    image: {
        url: { type: String, required: true },
        key: { type: String, required: true },
      },
    googleMap: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    telegram: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite error in Next.js hot reload
const WebSettings: Model<IWebSettings> =
  mongoose.models.WebSettings || model<IWebSettings>("WebSettings", WebSettingsSchema);

export default WebSettings;
