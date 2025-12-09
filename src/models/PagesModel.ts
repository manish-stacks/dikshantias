import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPage extends Document {
  title: string;
  slug: string;
  image?: {
    url: string;
    public_url: string;
    public_id: string;
    alt?: string;
  };
  content: string;
  active: boolean;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  index?: boolean;
  follow?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema<IPage> = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: {
      url: { type: String },
      public_url: { type: String },
      public_id: { type: String },
      alt: { type: String },
    },
    content: { type: String, required: true },
    active: { type: Boolean, default: true },

    // SEO fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    index: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
const PageModel: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

export default PageModel;
