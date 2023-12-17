import mongoose from "mongoose";
const WalletSchema = new mongoose.Schema(
  {
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "Cv",
    },
    invoiceId: {
      type: String,
      default: null,
    },
    qrImage: {
      type: String,
      default: null,
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    urls: [
      {
        name: String,
        description: String,
        logo: String,
        link: String,
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Wallet", WalletSchema);
