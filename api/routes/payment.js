import express from "express";
import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { verifyToken } from "../utils/verifyToken.js";
import Hotel from "../models/Hotel.js";

router.post("/payment", async (req, res) => {
  try {
    const { token, amount, hotelId, bill } = req.body;
    console.log(req.body);
    const charge = await stripeInstance.charges.create({
      source: token,
      amount: amount,
      currency: "usd",
      description: "Payment for hotel booking",
      metadata: {
        hotelId: hotelId,
        email: bill,
      },
    });

    const payment = new Payment({
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      hotelId: hotelId,
      email: bill,
      // Add other relevant payment data
    });

    await payment.save();

    // Find the user based on the email
    const user = await User.findOne({ email: bill });

    // Update the user document with the payment data
    if (user) {
      user.payments.push(payment._id);
      await user.save();
    }

    res.status(200).json(charge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/payment/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the payment references from the user document
    const paymentIds = user.payments;

    // Find the payments using the payment IDs
    const payments = await Payment.find({ _id: { $in: paymentIds } });

    // Gather hotel information for each payment
    const paymentDetails = [];
    for (const payment of payments) {
      const hotel = await Hotel.findById(payment.hotelId);
      if (hotel) {
        const hotelName = hotel.name;
        const hotelCity = hotel.city;
        const paymentInfo = {
          paymentId: payment._id,
          amount:payment.amount,
          email:payment.email,
          hotelName,
          hotelCity,
          

          // Include other payment details as needed
        };
        paymentDetails.push(paymentInfo);
      }
    }

    res.status(200).json(paymentDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.use((req, res, next) => {
  req.headers.Authorization = `Bearer ${process.env.STRIPE_SECRET_KEY}`;
  next();
});

export default router;
