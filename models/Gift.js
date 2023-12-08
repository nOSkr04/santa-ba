import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Утасны дугаараа оруулна уу"],
  },
  image: {
    url: String,
    blurHash: String,
  },
  type: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Gift", GiftSchema);
