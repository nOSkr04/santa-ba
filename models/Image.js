import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    blurHash: String,
    width: Number,
    height: Number,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Image", ImageSchema);
