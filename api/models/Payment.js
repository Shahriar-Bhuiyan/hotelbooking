import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema(
  {
    token: String,
  amount: Number,
  hotelId: String,
  email: String,
  chargeId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
