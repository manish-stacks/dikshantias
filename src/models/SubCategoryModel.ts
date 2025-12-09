import mongoose, { Document, Schema, Model } from "mongoose";
import { IBlogCategory } from "./BlogCategoryModel";


export interface ISubCategory extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId | IBlogCategory;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory", 
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubCategoryModel: Model<ISubCategory> =
  mongoose.models.SubCategory ||
  mongoose.model<ISubCategory>("SubCategory", SubCategorySchema, "subcategories");  

export default SubCategoryModel;
