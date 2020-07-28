import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import App from './App';
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
  render(<MemoryRouter><App /></MemoryRouter>);
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(<MemoryRouter><App /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});



describe("NavBar links test", function() {
  it("goes to /profile", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><App /></MemoryRouter>);
    const profileLink = await findByLabelText("account of current user");

    fireEvent.click(profileLink);
    expect(getByText("First Name")).toBeInTheDocument();
    expect(getByText("Last Name")).toBeInTheDocument();
    expect(getByText("Email Address")).toBeInTheDocument();
  });
});

describe("Drawer links test", function() {
  it("goes to /profile", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><App /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);
    const profileLink = getByText("Profile");
    fireEvent.click(profileLink);

    expect(getByText("First Name")).toBeInTheDocument();
    expect(getByText("Last Name")).toBeInTheDocument();
    expect(getByText("Email Address")).toBeInTheDocument();
  });

  it("goes to /:portfolioId", async function() {
    const { getAllByText, getByText, findByLabelText } = render(<MemoryRouter><App /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);
    const portfolioLinks = getAllByText("alpha");
    fireEvent.click(portfolioLinks[0]);

    expect(getByText("No investments yet!")).toBeInTheDocument();
  });
});