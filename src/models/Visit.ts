import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  page: { type: String, required: true },
  ip: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate entry for same page + ip + date
VisitSchema.index({ page: 1, ip: 1, date: 1 }, { unique: true });

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);
