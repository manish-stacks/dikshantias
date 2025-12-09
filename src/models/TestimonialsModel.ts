import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalizedText {
  en: string;
  hi: string;
}

export interface ITestimonial extends Document {
  name: ILocalizedText;
  image: {
    url: string;
    key: string;
  };
  rank: ILocalizedText;
  year: string;        // ✅ only one value
  quote: ILocalizedText;
  attempts: string;    // ✅ only one value
  optional?: ILocalizedText;
  background?: ILocalizedText;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedField = {
  en: { type: String, required: true },
  hi: { type: String, required: true },
};

const TestimonialSchema: Schema<ITestimonial> = new Schema(
  {
    name: LocalizedField,
    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
    rank: LocalizedField,
    year: { type: String, required: true },       // ✅ single string
    quote: LocalizedField,
    attempts: { type: String, required: true },   // ✅ single string
    optional: LocalizedField,
    background: LocalizedField,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default TestimonialModel;
