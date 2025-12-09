
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

        const BlogCategoryModel: Model<IBlogCategory> =
        mongoose.models.BlogCategory ||
        mongoose.model<IBlogCategory>(
            "BlogCategory",
            BlogCategorySchema,
            "blogcategories" 
        );


export default BlogCategoryModel;
