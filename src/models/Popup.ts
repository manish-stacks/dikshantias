import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPopup extends Document {
  title: string;
  description?: string;
  image: {
    url: string;
    key: string;
  };
  buttonText?: string;
  buttonLink?: string;
  displayOrder: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const PopupSchema: Schema = new Schema(
  {
    title: { type: String, required: true },

    description: { type: String },

    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },

    buttonText: { type: String },

    buttonLink: { type: String },

    displayOrder: { type: Number, default: 0 },

    active: { type: Boolean, default: true },

    startDate: { type: Date },

    endDate: { type: Date },
  },
  { timestamps: true },
);

const PopupModel: Model<IPopup> =
  mongoose.models.Popup || mongoose.model<IPopup>("Popup", PopupSchema);

export default PopupModel;
