import React from 'react';
import { useParams } from 'react-router-dom';
import InvestmentsList from './InvestmentsList';
import NewInvestment from './NewInvestment';
import PortfolioChart from './PortfolioChart';


const PortfolioDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ paddingBottom: '80px' }}>
      <InvestmentsList portfolioId={+id} />
      <NewInvestment portfolioId={+id} />
      <PortfolioChart portfolioId={+id} />
    </div>
  );

};


export default PortfolioDetail;