import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseEnquiry extends Document {
  name: string;
  phone: string;
  message?: string;
  createdAt: Date;
}

const CourseEnquirySchema: Schema<ICourseEnquiry> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CourseEnquiry: Model<ICourseEnquiry> =
  mongoose.models.CourseEnquiry ||
  mongoose.model<ICourseEnquiry>("CourseEnquiry", CourseEnquirySchema);

export default CourseEnquiry;
