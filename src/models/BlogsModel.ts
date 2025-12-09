import mongoose, { Schema, Document } from "mongoose";

interface BlogDocument extends Document {
  title: { en: string; hi: string };
  slug: string;
  shortContent: { en: string; hi: string };
  content: { en: string; hi: string };
  category: mongoose.Types.ObjectId;
  postedBy: { en: string; hi: string };
  image: {
    url: string;
    key: string;
    alt: string;
  };
  tags: string[];
  active: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  index: boolean;
  follow: boolean;
}

const BlogSchema = new Schema<BlogDocument>(
  {
    title: {
      en: { type: String, required: true },
      hi: { type: String, default: "" },
    },
    slug: { type: String, required: true, unique: true },

    shortContent: {
      en: { type: String, default: "" },
      hi: { type: String, default: "" },
    },

    content: {
      en: { type: String, default: "" },
      hi: { type: String, default: "" },
    },

    category: { type: Schema.Types.ObjectId, ref: "BlogCategory" },

    postedBy: {
      en: { type: String, default: "" },
      hi: { type: String, default: "" },
    },

    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
      alt: { type: String, default: "" },
    },

    tags: [{ type: String }],
    active: { type: Boolean, default: true },

    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    index: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model<BlogDocument>("Blog", BlogSchema);
