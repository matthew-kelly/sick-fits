import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState({
    message: '',
  });

  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [resetPassword, { data, error, loading }] = useMutation(
    RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  const submitError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log({ inputs });
    const res = await resetPassword().catch(console.error);
    resetForm();
    // TODO: sign in user and redirect to home page
  }
  function validateForm(event, password, confirm) {
    event.preventDefault();
    setPasswordErrorMessage({ message: '' });
    setConfirmPassword('');
    if (password !== confirm) {
      setPasswordErrorMessage({ message: 'Passwords must match' });
    } else {
      return handleSubmit(event);
    }
  }

  return (
    <Form
      method="POST"
      onSubmit={(e) => {
        validateForm(e, inputs.password, confirmPassword);
      }}
    >
      <DisplayError error={error || submitError || passwordErrorMessage} />
      <DisplayError error={error} />
      <h2>Reset Your Password</h2>
      <p>Password must be at least 8 characters long.</p>
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! Your password has been updated.</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          New Password
          <input
            type="password"
            name="password"
            placeholder="New password"
            autoComplete="password"
            minLength="8"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirm-password">
          Confirm Password
          <input
            type="password"
            name="confirm-password"
            placeholder="Confirm password"
            autoComplete="password"
            minLength="8"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
}
