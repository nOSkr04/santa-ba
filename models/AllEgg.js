import mongoose from "mongoose";

const AllEggSchema = new mongoose.Schema(
  {
    phone: [String],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("AllEgg", AllEggSchema);
