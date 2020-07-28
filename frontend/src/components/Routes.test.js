import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Routes from './Routes';
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
          { id: 0, name: "alpha", user_id: 0, created_at: "2020-01-10", investments: [] },
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
  render(<MemoryRouter><Routes /></MemoryRouter>);
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(<MemoryRouter><Routes /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});