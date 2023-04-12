import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import styles from "./StripeForm.module.scss";

const StripeForm = ({ amount, setChipDone, setShowStripeForm }) => {
  const stripe = useStripe();
  const elements = useElements();

  const closeForm = (e) => {
    e.preventDefault();
    setShowStripeForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("[error]", error);
    } else {
      // Call your backend to create a PaymentIntent with the specified amount
      const { data } = await axios.post(
        "http://localhost:3001/api/gift/create-payment-intent",
        {
          amount: amount,
        }
      );
      const { clientSecret } = data;

      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        console.error("[error]", confirmError);
      } else {
        // Payment was successful, create the gift and chip

        setChipDone(true);
        setShowStripeForm(false);

        // You might want to call a prop function to handle the error or update the state in the parent component
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <CardElement />
      <button className={styles.button} type="submit" disabled={!stripe}>
        Pay
      </button>
      <button className={styles.closeForm} onClick={closeForm}>
        Cancel Payment
      </button>
    </form>
  );
};

export default StripeForm;
