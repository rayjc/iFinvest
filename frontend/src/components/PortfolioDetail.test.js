import React from 'react';
import { useParams, MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import PortfolioDetail from './PortfolioDetail';
import { useSelector, useDispatch } from 'react-redux';


const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    id: 0
  }),
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
        investments: {}, error: null, isFetching: false,
      }
    }
    )
  );
});


// smoke test
it("renders without crashing", function() {
  render(<MemoryRouter><PortfolioDetail /></MemoryRouter>);
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(<MemoryRouter><PortfolioDetail /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});