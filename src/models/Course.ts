import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortContent: string;
  content: string;
  active: boolean;

  // Basic Info
  courseMode: "online" | "offline";
  lectures: number;
  duration: string;
  languages: string;
  displayOrder?: number;

  // Pricing
  originalPrice?: number;
  price?: number;
  totalFee?: number;
  oneTimeFee?: number;
  firstInstallment?: number;
  secondInstallment?: number;
  thirdInstallment?: number;
  fourthInstallment?: number;
   

  badge?: string;
  badgeColor?: string;
  features?: string[];

  // Images
    image: {
    url: string;
    key: string;
  };
  alt: string;

  // Videos
  demoVideo?: string;
  videos: string[];

  // SEO / Meta
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  index: boolean;
  follow: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortContent: { type: String },
    content: { type: String, required: true },
    active: { type: Boolean, default: true },

    courseMode: { type: String, enum: ["online", "offline"], required: true },
    lectures: { type: Number },
    duration: { type: String },
    languages: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },

    originalPrice: { type: Number },
    price: { type: Number },
    totalFee: { type: Number },
    oneTimeFee: { type: Number },
    firstInstallment: { type: Number },
    secondInstallment: { type: Number },
    thirdInstallment: { type: Number },
    fourthInstallment: { type: Number },

    badge: { type: String, default: 'Limited Seats' },
    badgeColor: { type: String, default: 'bg-indigo-500' },
    features: { type: [String], default: [] },     

      image: {
        url: { type: String, required: true },
        key: { type: String, required: true },
        alt: { type: String },
    },


    demoVideo: { type: String },
    videos: { type: [String], default: [] },

    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: [String], default: [] },
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    index: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
