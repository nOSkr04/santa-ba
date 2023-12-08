import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    blurHash: {
      type: String,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Banner", BannerSchema);
