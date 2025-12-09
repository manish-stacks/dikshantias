import mongoose, { Schema, Document } from "mongoose"

export interface IResultSection extends Document {
  description: {
    en: string
    hi: string
  }
  buttonText: {
    en: string
    hi: string
  }
  buttonLink: string
}

const ResultSectionSchema = new Schema<IResultSection>(
  {
    description: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    buttonText: {
      en: { type: String, default: "View All Results" },
      hi: { type: String, default: "  " },
    },
    buttonLink: { type: String, default: "/results" },
  },
  { timestamps: true }
)

export default mongoose.models.ResultSection ||
  mongoose.model<IResultSection>(
    "ResultSection",
    ResultSectionSchema,
    "resultsections"
  )
