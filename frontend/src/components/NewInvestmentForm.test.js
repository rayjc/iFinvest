import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import NewInvestmentForm from './NewInvestmentForm';
import { useSelector, useDispatch } from 'react-redux';
import { addInvestment } from '../reducers/investments/actions';


jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../reducers/investments/actions', () => ({
  addInvestment: jest.fn(),
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
      }
    })
  );
});


// smoke test
it("renders without crashing", function() {
  render(
    <MemoryRouter>
      <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
    </MemoryRouter>
  );
});

// snapshot test
it("matches snapshot", function() {
  const { asFragment } = render(
    <MemoryRouter>
      <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

describe("form values can be update", function() {

  it("symbol input can be changed", function() {
    const { getByLabelText } = render(
      <MemoryRouter>
        <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
      </MemoryRouter>
    );

    const symbolInput = getByLabelText("Symbol", { exact: false });
    fireEvent.change(symbolInput, { target: { value: 'test symbol' } });
    expect(symbolInput.value).toBe("test symbol");
  });

  it("investment input can be changed", function() {
    const { getByLabelText } = render(
      <MemoryRouter>
        <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
      </MemoryRouter>
    );

    const investmentInput = getByLabelText("Initial Investment", { exact: false });
    fireEvent.change(investmentInput, { target: { value: '100' } });
    expect(investmentInput.value).toBe("100");
  });

  it("startDate input can be changed", function() {
    const { getByLabelText } = render(
      <MemoryRouter>
        <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
      </MemoryRouter>
    );

    const startDateInput = getByLabelText("Start Date", { exact: false });
    fireEvent.change(startDateInput, { target: { value: '2020-01-01' } });
    expect(startDateInput.value).toBe("2020-01-01");
  });

  it("endDate input can be changed", function() {
    const { getByLabelText } = render(
      <MemoryRouter>
        <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
      </MemoryRouter>
    );

    const endDateInput = getByLabelText("End Date", { exact: false });
    fireEvent.change(endDateInput, { target: { value: '2020-01-01' } });
    expect(endDateInput.value).toBe("2020-01-01");
  });
});


it("Dispatches addInvestment() on submit", function() {

  const mockedDispatch = jest.fn();
  useDispatch.mockReturnValue(mockedDispatch);

  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
    </MemoryRouter>
  );

  const symbolInput = getByLabelText("Symbol", { exact: false });
  fireEvent.change(symbolInput, { target: { value: 'test' } });
  const investmentInput = getByLabelText("Initial Investment", { exact: false });
  fireEvent.change(investmentInput, { target: { value: '100' } });
  const startDateInput = getByLabelText("Start Date", { exact: false });
  fireEvent.change(startDateInput, { target: { value: '2020-07-14' } });
  const endDateInput = getByLabelText("End Date", { exact: false });
  fireEvent.change(endDateInput, { target: { value: '2020-07-15' } });

  const submitBtn = getByText("Add", { exact: false });
  fireEvent.click(submitBtn);

});