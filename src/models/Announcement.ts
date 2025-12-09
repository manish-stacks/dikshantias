import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: {
    en: string;
    hi: string;
  };
  bgcolor: string;
  active: boolean;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    bgcolor: { type: String, default: "bg-blue-500" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
