import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import StripeCheckout from "react-stripe-checkout";
import useFetch from "../../hooks/useFetch";
import { useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../reserve/reserve.css'

const Reserve = ({ setOpen, hotelId, amount }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const [completedCheckout, setCompletedCheckout] = useState(false); // State variable to track completed checkout

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms((prevSelectedRooms) =>
      checked
        ? [...prevSelectedRooms, value]
        : prevSelectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleToken = (tokenId) => {
    console.log(tokenId)
    const data = {
      token: tokenId.id,
      selectedRooms: selectedRooms,
      hotelId: hotelId,
      amount: amount,
      bill:tokenId.email
    };

    // Send the token and additional data to your server for processing
    axios
      .post("http://localhost:8800/api/checkout/payment", data)
      .then((response) => {
        // Handle the server response as needed
        response && navigate("/payment");
        console.log(response.data);
        setCompletedCheckout(response); // Mark checkout as completed
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  useEffect(() => {
    if (completedCheckout) {
      setOpen(false); // Close the reservation modal
      navigate("/payment"); // Navigate to the payment page
    }
  }, [completedCheckout, setOpen, navigate]);

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>

        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <StripeCheckout
          token={handleToken} // Pass the handleToken function correctly
          stripeKey="pk_test_51NJJa9HxbdfOSqH0zyX2LzyBavRw1xc0WLndQEr0a2hWMIWxhPRLxK1i1Er7QlPBM4vRt5WgosoxavXsHe1DoICD00mnNf2qWm"
          amount={amount * 100} // Amount in cents
          name="Hotel Reservation"
          description="Reserve Now!"
          currency="USD"
          closed={() => setOpen(false)}
        >
          <button className="rButton">Reserve Now!</button>
        </StripeCheckout>
      </div>
    </div>
  );
};

export default Reserve;
