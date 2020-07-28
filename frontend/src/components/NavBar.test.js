import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import NavBar from './NavBar';
import { useSelector, useDispatch } from 'react-redux';


const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));

// smoke test
it("renders without crashing", function() {
  render(<MemoryRouter><NavBar /></MemoryRouter>);
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(<MemoryRouter><NavBar /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});


describe("NavBar buttons for annoymous user", function() {
  it("has login button", function() {
    const { getByText } = render(<MemoryRouter><NavBar /></MemoryRouter>);
    expect(getByText("Login")).toBeInTheDocument();
  });
});

describe("NavBar buttons for logged in user", function() {
  beforeEach(function() {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        user: {
          user: {
            id: 0, username: "test", first_name: "test", last_name: "user",
            email: "test@test.com"
          },
          error: null, isFetching: false,
        }
      })
    );
  });

  it("has profile button", function() {
    const { getByLabelText } = render(<MemoryRouter><NavBar /></MemoryRouter>);
    expect(getByLabelText("account of current user")).toBeInTheDocument();
  });

  it("has logout button", function() {
    const { getByLabelText } = render(<MemoryRouter><NavBar /></MemoryRouter>);
    expect(getByLabelText("log out")).toBeInTheDocument();
  });
});