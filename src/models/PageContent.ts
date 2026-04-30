import mongoose, { Document, Schema, Model } from "mongoose";

/* =========================
   INTERFACE
========================= */
export interface IPageContent extends Document {
  exam: "UPSC" | "UPPSC" | "BPSC";
  page: "About" | "Syllabus" | "PYQ";
  subject?: string;
  slug?: string;
  status: boolean;

  en: {
    title: string;
    shortContent?: string;
    content: string;

    pdf?: {
      key: string;
      url: string;
    };

    videoUrl?: string;
  };

  hi: {
    title: string;
    shortContent?: string;
    content: string;

    pdf?: {
      key: string;
      url: string;
    };

    videoUrl?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   FILE SCHEMA
========================= */
const FileSchema = new Schema(
  {
    key: { type: String },
    url: { type: String },
  },
  { _id: false },
);

/* =========================
   MAIN SCHEMA
========================= */
const PageContentSchema: Schema = new Schema(
  {
    exam: {
      type: String,
      enum: ["UPSC", "UPPSC", "BPSC"],
      required: true,
      index: true,
    },

    page: {
      type: String,
      enum: ["About", "Syllabus", "PYQ"],
      required: true,
    },

    subject: {
      type: String,
      default: "",
    },

    slug: String,

    status: {
      type: Boolean,
      default: true,
    },

    en: {
      title: {
        type: String,
        required: true,
      },

      shortContent: {
        type: String,
        default: "",
      },

      content: {
        type: String,
        default: "",
      },

      pdf: FileSchema,

      videoUrl: {
        type: String,
        default: "",
      },
    },

    hi: {
      title: {
        type: String,
        required: true,
      },

      shortContent: {
        type: String,
        default: "",
      },

      content: {
        type: String,
        default: "",
      },

      pdf: FileSchema,

      videoUrl: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true },
);

/* =========================
   UNIQUE INDEX
========================= */
PageContentSchema.index({ exam: 1, page: 1, subject: 1 }, { unique: true });

/* =========================
   MODEL EXPORT
========================= */
const PageContent: Model<IPageContent> =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>("PageContent", PageContentSchema);

export default PageContent;
