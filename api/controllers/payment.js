require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const processPayment = async (req, res) => {
  const { token, amount } = req.body;

  try {
    // Create a charge using the Stripe API
    const charge = await stripe.charges.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      source: token.id, // 
      description: 'Payment for reservation', 
    });

   
    res.status(200).json({ message: 'Payment processed successfully', charge });
  } catch (error) {
    console.error(error);


    res.status(500).json({ error: 'Payment processing failed' });
  }
};

module.exports = {
  processPayment,
};