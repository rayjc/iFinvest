import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';


const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    minWidth: 275,
  },
  chip: {
    margin: 2,
  },
});

const PortfolioCard = ({ id, name, investments }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={`/portfolios/${id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
            {name}
          </Typography>
          <div>
            {investments.map(i =>
              <Chip className={classes.chip} key={i.symbol} label={i.symbol} color="secondary" />)
            }
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};


export default PortfolioCard;