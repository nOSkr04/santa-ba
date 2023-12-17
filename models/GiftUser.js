import mongoose from "mongoose";

const GiftUserSchema = new mongoose.Schema(
  {
    phone: [String],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("GiftUser", GiftUserSchema);
