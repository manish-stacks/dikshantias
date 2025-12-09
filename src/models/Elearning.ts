import mongoose, { Document, Schema, Model } from "mongoose";

export interface IELearningCourse extends Document {
  titleEN: string;
  titleHI: string;
  monthYear: string;
  fileLinkEN: {
    url: string;
    key: string;
  };
  fileLinkHI: {
    url: string;
    key: string;
  };
  active: boolean;
  displayOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ELearningSchema: Schema = new Schema(
  {
    titleEN: { type: String, required: true },
    titleHI: { type: String, required: true },
    monthYear: { type: String, required: true },

    fileLinkEN: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
  fileLinkHI: {
      url: { type: String }, // optional
      key: { type: String }, // optional
    },

    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "elearning" }
);

const ELearningCourse: Model<IELearningCourse> =
  mongoose.models.ELearningCourse ||
  mongoose.model<IELearningCourse>("ELearningCourse", ELearningSchema);

export default ELearningCourse;
