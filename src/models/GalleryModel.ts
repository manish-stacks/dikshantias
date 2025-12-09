import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  title: string;
  image: {
    url: string;
    key: string;
    alt?: string;
  };
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
      alt: { type: String, default: "" },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GalleryModel: Model<IGallery> =
  mongoose.models.Gallery ||
  mongoose.model<IGallery>("Gallery", GallerySchema, "galleries");

export default GalleryModel;
