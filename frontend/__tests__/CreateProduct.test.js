import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import wait from 'waait';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { fakeItem, makePaginationMocksFor } from '../lib/testUtils';
import { ALL_PRODUCTS_QUERY } from '../components/Products';

const item = fakeItem();

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CreateProduct />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('handles the updating', async () => {
    // render the form
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    // type into boxes
    userEvent.type(screen.getByPlaceholderText('Name'), item.name);
    userEvent.type(screen.getByPlaceholderText('Price'), item.price.toString());
    userEvent.type(
      screen.getByPlaceholderText('Description'),
      item.description
    );
    // check that boxes are populated
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('creates the item when the form is submitted', async () => {
    // create the mocks
    const mocks = [
      {
        request: {
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            price: item.price,
            image: '',
          },
        },
        result: {
          data: {
            createProduct: {
              ...item, // all fake item fields
            },
          },
        },
      },
      {
        request: {
          query: ALL_PRODUCTS_QUERY,
          variables: {
            skip: 0,
          },
        },
        result: {
          data: {
            allProducts: [item],
          },
        },
      },
    ];
    // render the form
    const { container, debug } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateProduct />
      </MockedProvider>
    );
    // type into boxes
    userEvent.type(screen.getByPlaceholderText('Name'), item.name);
    userEvent.type(screen.getByPlaceholderText('Price'), item.price.toString());
    userEvent.type(
      screen.getByPlaceholderText('Description'),
      item.description
    );
    userEvent.click(screen.getByText(/Add Product/));
    await waitFor(() => wait(10));
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({
      pathname: `/product/${item.id}`,
    });
  });
});
