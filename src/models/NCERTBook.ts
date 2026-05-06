import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISubject {
  subjectName: string;
  pdf: string;
}

export interface INCERTBook extends Document {
  className:
    | "Class 6"
    | "Class 7"
    | "Class 8"
    | "Class 9"
    | "Class 10"
    | "Class 11"
    | "Class 12";

  subjects: ISubject[];

  status: boolean;
}

const SubjectSchema = new Schema<ISubject>(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    pdf: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const NCERTBookSchema = new Schema<INCERTBook>(
  {
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