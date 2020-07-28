import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import Menu from './Menu';
import { useSelector, useDispatch } from 'react-redux';


const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));

// smoke test
it("renders without crashing", function() {
  render(<MemoryRouter><Menu /></MemoryRouter>);
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(<MemoryRouter><Menu /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});

describe("Menu buttons for annoymous user", function() {
  it("has home button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("has login button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("Log in")).toBeInTheDocument();
  });

  it("has signup button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("Sign up")).toBeInTheDocument();
  });
});

describe("Menu buttons for logged in user", function() {
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
        }
      })
    );
  });

  it("has home button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("has portfolio button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("alpha")).toBeInTheDocument();
  });

  it("has profile button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("Profile")).toBeInTheDocument();
  });

  it("has logout button", async function() {
    const { getByText, findByLabelText } = render(<MemoryRouter><Menu /></MemoryRouter>);
    const menuButton = await findByLabelText("menu");
    fireEvent.click(menuButton);

    expect(getByText("Log out")).toBeInTheDocument();
  });
});