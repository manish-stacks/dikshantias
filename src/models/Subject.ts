import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  exam: "UPSC" | "UPPSC" | "BPSC";
  page: "PYQ";
  type: "PRE" | "MAINS"; 
  name: string;
  slug: string;
  status: boolean;
}

const SubjectSchema = new Schema(
  {
    exam: {
      type: String,
      required: true,
      enum: ["UPSC", "UPPSC", "BPSC"],
    },

    page: {
      type: String,
      default: "PYQ",
    },

    type: {
      type: String,
      enum: ["PRE", "MAINS"],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// unique subject per exam + type
SubjectSchema.index({ exam: 1, type: 1, name: 1 }, { unique: true });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;
