import React from 'react';
import { useParams } from 'react-router-dom';
import InvestmentsList from './InvestmentsList';


const PortfolioDetail = () => {
  const { id } = useParams();

  return (
    <InvestmentsList portfolioId={+id} />
  );

};


export default PortfolioDetail;