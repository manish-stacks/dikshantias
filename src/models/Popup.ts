import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPopup extends Document {
  title: string;
  subtitle: string;
  description?: string;

  image: {
    url: string;
    key: string;
  };

  primaryButton?: {
    text: string;
    link: string;
  };

  secondaryButton?: {
    text: string;
    link: string;
  };

  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PopupSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },

    description: { type: String },

    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },

    primaryButton: {
      text: { type: String },
      link: { type: String },
    },

    secondaryButton: {
      text: { type: String },
      link: { type: String },
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const PopupModel: Model<IPopup> =
  mongoose.models.Popup || mongoose.model<IPopup>("Popup", PopupSchema);

export default PopupModel;
