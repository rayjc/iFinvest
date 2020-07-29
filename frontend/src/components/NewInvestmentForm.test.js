import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import NewInvestmentForm from './NewInvestmentForm';
import { useSelector, useDispatch } from 'react-redux';
import { addInvestment } from '../reducers/investments/actions';
import ApiHelper from '../api/apiHelper';


jest.mock('../api/apiHelper');

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../reducers/investments/actions', () => ({
  addInvestment: jest.fn(),
}));



beforeEach(function() {

  ApiHelper.mockClear();

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
  ApiHelper.request.mockResolvedValue({ stocks: [{ symbol: 'test' }] });

  it("symbol input can be changed", function() {
    const { getByLabelText } = render(
      <MemoryRouter>
        <NewInvestmentForm portfolioId={0} handleClose={jest.fn()} />
      </MemoryRouter>
    );

    const symbolInput = getByLabelText("Symbol", { exact: false });
    fireEvent.change(symbolInput, { target: { value: 'test' } });
    expect(symbolInput.value).toBe("test");
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


it("Dispatches addInvestment() on submit", async function() {

  const mockedDispatch = jest.fn();
  useDispatch.mockReturnValue(mockedDispatch);

  const { getByLabelText, getByText, findByTestId } = render(
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

  const submitBtn = await findByTestId("add-investment-btn", { exact: false });
  fireEvent.click(submitBtn);

  expect(mockedDispatch).toHaveBeenCalled();
  expect(mockedDispatch).toHaveBeenCalledWith(addInvestment({
    symbol: "test",
    initial_value: "100",
    start_date: "2020-07-14",
    end_date: "2020-0715",
  }));
});