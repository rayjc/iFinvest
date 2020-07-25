import React from 'react';
import { useSelector } from 'react-redux';
import PortfolioList from './PortfolioList';
import HomeCard from './HomeCard';
import { Container, Grid, Box } from '@material-ui/core';
import NewPortfolio from './NewPortfolio';

const Home = () => {
  const user = useSelector(state => state.user.user);

  if (user) {
    return (
      <>
        <PortfolioList />
        <NewPortfolio />
      </>
    );
  } else {
    return (
      <Container>
        <Box my={8}>
          <Grid container justify="center" alignItems="flex-start" spacing={3}>
            <Grid item xs={12} md={6}>
              <HomeCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

};


export default Home;