import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResult extends Document {
  name: {
    en: string;
    hi: string;
  };
  rank: {
    en?: string;
    hi?: string;
  };
  service: {
    en?: string;
    hi?: string;
  };
  year: string;
  desc?: {
    en?: string;
    hi?: string;
  };
  image: {
    url: string;
    key: string;
  };
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResultSchema: Schema = new Schema(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    rank: {
      en: { type: String },
      hi: { type: String },
    },
    service: {
      en: { type: String },
      hi: { type: String },
    },
    year: { type: String },
    desc: {
      en: { type: String },
      hi: { type: String },
    },
    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ResultModel: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema, "results");

export default ResultModel;
