import mongoose, {
  Schema,
  Document,
  models,
  model,
} from "mongoose";

export interface IGlobalBanner
  extends Document {
  link: string;

  desktopBanner: {
    url: string;
    key: string;
  };

  mobileBanner: {
    url: string;
    key: string;
  };

  status: boolean;
}

const GlobalBannerSchema =
  new Schema<IGlobalBanner>(
    {
      link: {
        type: String,
        required: true,
        trim: true,
      },

      desktopBanner: {
        url: {
          type: String,
          required: true,
        },

        key: {
          type: String,
          required: true,
        },
      },

      mobileBanner: {
        url: {
          type: String,
          required: true,
        },

        key: {
          type: String,
          required: true,
        },
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

const GlobalBanner =
  models.GlobalBanner ||
  model<IGlobalBanner>(
    "GlobalBanner",
    GlobalBannerSchema,
  );

export default GlobalBanner;    