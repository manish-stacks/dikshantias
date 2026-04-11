import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICurrentAffairs extends Document {
  title: { en: string; hi: string };
  slug: string;
  shortContent: { en: string; hi: string };
  content: { en: string; hi: string };
  category: mongoose.Schema.Types.ObjectId;
  subCategory: mongoose.Schema.Types.ObjectId;
  image?: {
    key: string; // S3 key for deletion
    url: string; // Public URL
  };
  imageAlt?: string;
  active: boolean;
  affairDate?: Date;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  faq?: {
    question: {
      en: string;
      hi: string;
    };
    answer: {
      en: string;
      hi: string;
    };
  }[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  index?: boolean;
  follow?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const CurrentAffairsSchema: Schema = new Schema(
  {
    title: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true },
    shortContent: {
      en: { type: String },
      hi: { type: String },
    },
    content: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    image: {
      key: { type: String },
      url: { type: String },
    },
    imageAlt: String,
    active: { type: Boolean, default: true },
    affairDate: { type: Date, required: true },
    // SEO fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],

    faq: [
      {
        question: {
          en: { type: String },
          hi: { type: String },
        },

        answer: {
          en: { type: String },
          hi: { type: String },
        },
      },
    ],
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    index: { type: Boolean, default: true },  
    follow: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const CurrentAffairs: Model<ICurrentAffairs> =
  mongoose.models.CurrentAffairs ||
  mongoose.model("CurrentAffairs", CurrentAffairsSchema);

export default CurrentAffairs;
