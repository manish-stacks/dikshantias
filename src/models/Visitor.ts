import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VisitorSchema: Schema = new Schema(
  {
    ip: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate IPs
    },
  },
  { timestamps: true },
);

const VisitorModel: Model<IVisitor> =
  mongoose.models.Visitor ||
  mongoose.model<IVisitor>("Visitor", VisitorSchema, "visitors");

export default VisitorModel;
