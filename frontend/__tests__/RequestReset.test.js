import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import RequestReset, {
  RESET_REQUEST_MUTATION,
} from '../components/RequestReset';
import { fakeUser } from '../lib/testUtils';

const user = fakeUser();

const mocks = [
  {
    request: {
      query: RESET_REQUEST_MUTATION,
      variables: {
        email: user.email,
      },
    },
    result: {
      data: {
        sendUserPasswordResetLink: null,
      },
    },
  },
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation when submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // type into email box
    userEvent.type(
      screen.getByPlaceholderText('Your Email Address'),
      user.email
    );
    // click submit
    userEvent.click(screen.getByText('Request Reset'));
    const success = await screen.findByText(
      'Success! Check your email for a link.'
    );
    expect(success).toBeInTheDocument();
  });
});
