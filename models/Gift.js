import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Нэр оруулна уу"],
  },
  image: {
    url: String,
    blurHash: String,
  },
  type: String,
  productType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  isRandom: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Gift", GiftSchema);
