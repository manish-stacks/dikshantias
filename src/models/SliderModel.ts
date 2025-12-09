import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISlider extends Document {
  title: string;
  image: {
    url: string;
    key: string;
  };
  type: "Desktop" | "Mobile";
  displayOrder: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SliderSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ["Desktop", "Mobile"],
      default: "Desktop",
      required: true,
    },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SliderModel: Model<ISlider> =
  mongoose.models.Slider || mongoose.model<ISlider>("Slider", SliderSchema);

export default SliderModel;
