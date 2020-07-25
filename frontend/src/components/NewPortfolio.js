import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NewPortfolioForm from './NewPortfolioForm';


const NewPortfolio = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    showForm ?
      <NewPortfolioForm setShowForm={setShowForm} /> :
      <div style={{ textAlign: 'center' }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}
          onClick={() => setShowForm(state => !state)}>
          New Portfolio
        </Button>
      </div>
  );
};


export default NewPortfolio;