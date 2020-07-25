import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardActionArea, CardContent, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { removePortfolio } from '../reducers/portfolios/actions';


const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    minWidth: 275,
  },
  actionArea: {
    paddingTop: 20,
  },
  chip: {
    margin: 2,
  },
});

const PortfolioCard = ({ id, created_at, name, investments }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.actionArea} component={Link} to={`/portfolios/${id}`}>
        <Typography variant="h5" component="h3">
          {name}
        </Typography>
        <Typography gutterBottom variant="subtitle1" component="p">
          {moment(created_at).format("MMM Do, YYYY")}
        </Typography>
        <CardContent>
          {investments.map(i =>
            <Chip className={classes.chip} key={i.symbol} label={i.symbol} color="primary" style={{ backgroundColor: 'cornflowerblue' }} />)
          }
        </CardContent>
      </CardActionArea>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <IconButton onClick={() => dispatch(removePortfolio(id))}>
          <DeleteIcon color="secondary" />
        </IconButton>
      </CardActions>
    </Card>
  );
};


export default PortfolioCard;