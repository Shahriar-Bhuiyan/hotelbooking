import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../Booked/book.css'
import axios from 'axios';

const Book = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/checkout/payment/${user._id}`);
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <>
    <center><h1>Booking Payment Section</h1></center>
      {payments ? <ol className="payment-section">
        {payments.map((payment) => (
          <li className="payment-item" key={payment._id}>
            <p className="payment-id">Payment ID: {payment._id}</p>
            <p className="payment-amount">Amount: {payment.amount}$</p>
            <p className="payment-email">Email: {payment.email}</p>
            <p className="payment-hotel">Hotel: {payment.hotelName}</p>
            <p className="payment-hotel">City:{payment.hotelCity}</p>
          </li>
        ))}
      </ol>:<h1>You have not done any booking yet.</h1>}
    </>
  );
};

export default Book;
