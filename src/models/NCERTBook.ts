import mongoose, { Schema, Document, models, model } from "mongoose";

/* ---------- Subject ---------- */

export interface ISubject {
  // OLD FIELD (existing data support)
  subjectName: string;
  pdf: string;

  // NEW FIELDS
  subjectNameHindi?: string;

  englishPdf?: string;
  hindiPdf?: string;
}

/* ---------- NCERT ---------- */

export interface INCERTBook extends Document {
  // OLD FIELD
  className:
    | "Class 6"
    | "Class 7"
    | "Class 8"
    | "Class 9"
    | "Class 10"
    | "Class 11"
    | "Class 12";

  // NEW FIELD
  classNameHindi?: string;

  subjects: ISubject[];

  status: boolean;
}

/* ---------- Subject Schema ---------- */

const SubjectSchema = new Schema<ISubject>(
  {
    // OLD FIELD
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    // OLD FIELD
    pdf: {
      type: String,
      required: true,
    },

    // NEW FIELD
    subjectNameHindi: {
      type: String,
      default: "",
      trim: true,
    },

    // NEW FIELD
    englishPdf: {
      type: String,
      default: "",
    },

    // NEW FIELD
    hindiPdf: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

/* ---------- Main Schema ---------- */

const NCERTBookSchema = new Schema<INCERTBook>(
  {
    // OLD FIELD
    className: {
      type: String,

      enum: [
        "Class 6",
        "Class 7",
        "Class 8",
        "Class 9",
        "Class 10",
        "Class 11",
        "Class 12",
      ],

      required: true,
    },

    // NEW FIELD
    classNameHindi: {
      type: String,
      default: "",
    },

    subjects: {
      type: [SubjectSchema],
      default: [],
    },

    status: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  },
);

const NCERTBook =
  models.NCERTBook ||
  model<INCERTBook>("NCERTBook", NCERTBookSchema);

export default NCERTBook;