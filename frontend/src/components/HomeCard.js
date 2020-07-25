import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    minWidth: 275,
  }
});

const HomeCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography component="h3" variant="h4">
          <strong>Welcome to iFinvest!</strong>
        </Typography>
        <Typography component="h5" variant="h6">
          <i>
            if-in-vest is an investment tracking tool for you to track your portfolio and explore your what-if's.
          </i>
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }} >
        <Button variant="contained" size="medium" color="primary" component={Link} to="/auth">Log in</Button>
        <Button variant="contained" size="medium" color="primary" component={Link} to="/auth#signup">Sign up</Button>
      </CardActions>
    </Card>
  );
};


export default HomeCard;