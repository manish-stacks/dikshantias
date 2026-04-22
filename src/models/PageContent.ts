import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPageContent extends Document {
  exam: "UPSC" | "UPPSC" | "BPSC";

  page: "About" | "Syllabus" | "PYQ";

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
  };

  hi: {
    title: string;

    shortContent?: string;

    content: string;

    pdf?: {
      key: string;

      url: string;
    };
  };

  createdAt?: Date;

  updatedAt?: Date;
}

// reusable file schema

const FileSchema = new Schema(
  {
    key: { type: String },

    url: { type: String },
  },

  { _id: false },
);

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
        // ✔ added

        type: String,

        default: "",
      },

      content: {
        type: String,

        default: "",
      },

      pdf: FileSchema,
    },

    hi: {
      title: {
        type: String,

        required: true,
      },

      shortContent: {
        // ✔ added

        type: String,

        default: "",
      },

      content: {
        type: String,

        default: "",
      },

      pdf: FileSchema,
    },
  },

  { timestamps: true },
);


PageContentSchema.index(
  { exam: 1, page: 1 },

  { unique: true },
);

const PageContent: Model<IPageContent> =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>(
    "PageContent",

    PageContentSchema,
  );

export default PageContent;
