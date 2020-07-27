import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  InputAdornment, TextField, Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}));


const InvestmentDisplay = ({ investmentId }) => {
  const classes = useStyles();
  const investment = useSelector(state => state.investments.investments[investmentId], shallowEqual);
  const { initial_value, symbol, start_date, end_date } = investment;

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={6}>
        <TextField
          required
          id={`symbol-${investmentId}`}
          label="Symbol"
          name="symbol"
          value={symbol}
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          required
          id={`initial-input-${investmentId}`}
          label="Initial Investment"
          name="initial_value"
          type="number"
          value={initial_value}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          required
          id={`start-date-${investmentId}`}
          label="Start Date"
          type="date"
          name="start_date"
          value={start_date}
          InputLabelProps={{
            shrink: true,
          }}
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id={`end-date-${investmentId}`}
          label="End Date"
          type="date"
          name="end_data"
          value={end_date ? end_date : ""}
          InputLabelProps={{
            shrink: true,
          }}
          disabled
        />
      </Grid>
    </Grid>
  );

};


export default InvestmentDisplay;