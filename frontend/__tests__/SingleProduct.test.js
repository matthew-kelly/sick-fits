import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import SingleProduct, {
  SINGLE_PRODUCT_QUERY,
} from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

const mocks = [
  {
    // When someone requests this query and variable combo
    request: {
      query: SINGLE_PRODUCT_QUERY,
      variables: {
        id: '123',
      },
    },
    // Return this data
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<SingleProduct />', () => {
  it('renders with proper data', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    // Wait for the test ID to show up
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('errors out when an item is not found', async () => {
    const errorMocks = [
      {
        // When someone requests this query and variable combo
        request: {
          query: SINGLE_PRODUCT_QUERY,
          variables: {
            id: '123',
          },
        },
        // Return this data
        result: {
          errors: [{ message: 'Item not found' }],
        },
      },
    ];
    const { container, debug } = render(
      <MockedProvider mocks={errorMocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found');
  });
});
