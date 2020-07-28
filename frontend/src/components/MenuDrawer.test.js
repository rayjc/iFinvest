import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
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