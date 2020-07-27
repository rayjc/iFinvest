import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Container, Grid, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PortfolioCard from './PortfolioCard';


const PortfolioList = () => {
  const { portfolios, isFetching, error } = useSelector(state => state.portfolios);

  return (
    <div className="PortfolioList">
      <Container style={{textAlign: 'center'}}>
        <Box my={4}>
          {isFetching && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {portfolios.length === 0
            && <h3><i>No portfolios yet!</i></h3>}
          <Grid container justify="center" alignItems="flex-start" spacing={3}>
            {portfolios.sort((a, b) => a.name.localeCompare(b.name))
              .map(p => (
                <Grid item xs={12} md={6} key={p.id}>
                  <PortfolioCard {...p} />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};


export default PortfolioList;