import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import InvestmentsList from './InvestmentsList';
import { useSelector, useDispatch } from 'react-redux';


const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));


beforeEach(function() {

  useSelector.mockImplementation((selectorFn) =>
    selectorFn({
      user: {
        user: {
          id: 0, username: "test", first_name: "test", last_name: "user",
          email: "test@test.com"
        },
        error: null, isFetching: false,
      },
      portfolios: {
        portfolios: [
          {
            id: 0, name: "alpha", user_id: 0, created_at: "2020-01-10",
            investments: [{ id: 0, symbol: "test" }]
          },
        ],
        error: null, isFetching: false,
      },
      investments: {
        investments: {
          0: {
            initial_value: 1000, initial_price: null, symbol: "test",
            portfolio_id: 0, start_date: '2020-01-01', end_date: null,
          }
        },
        error: null, isFetching: false,
      }
    }
    )
  );
});


// smoke test
it("renders without crashing", function() {
  render(<MemoryRouter><InvestmentsList portfolioId={0} /></MemoryRouter>);
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(<MemoryRouter><InvestmentsList portfolioId={0} /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});

it("displays one investment", function() {
  const { getByDisplayValue } = render(<MemoryRouter><InvestmentsList portfolioId={0} /></MemoryRouter>);
  expect(getByDisplayValue("test")).toBeInTheDocument();
});