import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { removeInvestment } from '../reducers/investments/actions';


const RemoveInvestment = ({ investmentId, portfolioId }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(removeInvestment(investmentId, portfolioId));
  };

  return (
    <>
      <IconButton style={{ color: 'red' }} onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </>
  );
};


export default RemoveInvestment;