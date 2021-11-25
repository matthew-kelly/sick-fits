import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import wait from 'waait';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { SIGNIN_MUTATION } from '../components/SignIn';
import { fakeUser } from '../lib/testUtils';

const user = fakeUser();
const password = 'examplepass';

const mocks = [
  {
    // Mutation mock
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: user.name,
        email: user.email,
        password,
      },
    },
    result: {
      data: {
        createUser: {
          id: 'abc123',
          name: user.name,
          email: user.email,
        },
      },
    },
  },
  {
    // Current user mock
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        authenticatedItem: user,
      },
    },
  },
];

describe('<SignUp />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignUp />
      </MockedProvider>
    );
    // type into the boxes
    await userEvent.type(screen.getByPlaceholderText('Your Name'), user.name);
    await userEvent.type(
      screen.getByPlaceholderText('Your Email Address'),
      user.email
    );
    await userEvent.type(screen.getByPlaceholderText('Password'), password);
    // click submit
    userEvent.click(screen.getByText('Sign Up'));
    const re = new RegExp(`Welcome to Sick Fits, ${user.name}!`);
    await screen.findByText(re);
    expect(container).toHaveTextContent(re);
  });
});
