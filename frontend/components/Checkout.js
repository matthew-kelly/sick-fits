import { gql, useMutation } from '@apollo/client';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../lib/cartState';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  const router = useRouter();
  const { closeCart } = useCart();

  async function handleSubmit(e) {
    // 1. stop the form from submitting and turn the loader on
    e.preventDefault();
    setLoading(true);
    // 2. start the page transition
    nProgress.start();
    // 3. create the payment method via stripe (returns token if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);
    // 4. handle any errors from stripe
    if (error) {
      console.log(error);
      setError(error);
      nProgress.done();
      return; // stops the checkout from happening
    }
    // 5. send token to keystone server with custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log('Finished with the order!');
    console.log(order);
    // 6. change the page to view the order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    // 7. close the cart
    closeCart();
    // 8. turn the loader off
    setLoading(false);
    nProgress.done();
  }
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12, color: 'red' }}>{error.message}</p>}
      {graphQLError && (
        <p style={{ fontSize: 12, color: 'red' }}>{graphQLError.message}</p>
      )}
      <CardElement />
      <SickButton>Check out now</SickButton>
    </CheckoutFormStyles>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}
