import React, { useState } from 'react';
import { Button, Grid, InputAdornment, TextField } from '@material-ui/core';
import moment from 'moment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { validateWeekday } from '../helpers/validate';
import { updateInvestment } from '../reducers/investments/actions';


const EditInvestmentForm = ({ investmentId, handleClose }) => {
  const investment = useSelector(state => state.investments.investments[investmentId], shallowEqual);
  const INIT_FORM_DATA = {
    "initial_value": investment.initial_value,
    "symbol": investment.symbol,
    "start_date": investment.start_date || moment().format(),
    "end_date": investment.end_date || moment().format(),
  };
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INIT_FORM_DATA);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(updateInvestment(
      investmentId, { ...formData, initial_value: +formData.initial_value }
    ));
    handleClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} justify='center'>
        <Grid item xs={6}>
          <TextField
            required
            id="symbol"
            label="Symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="initial-input"
            label="Initial Investment"
            name="initial_value"
            type="number"
            value={formData.initial_value}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: "0" },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="start-date"
            label="Start Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            error={!validateWeekday(formData.start_date)}
            helperText={!validateWeekday(formData.start_date) ? `Closed on weekend...` : ''}
            InputProps={{
              inputProps: {
                min: moment().subtract(5, "years").format("YYYY-MM-DD"),
                max: moment(formData.end_date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD'),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="end-date"
            label="End Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            // end_date could be null
            error={formData.end_date && !validateWeekday(formData.end_date)}
            helperText={formData.end_date && !validateWeekday(formData.end_date) ? `Closed on weekend...` : ''}
            InputProps={{
              inputProps: {
                min: moment(formData.start_date).format("YYYY-MM-DD"),
                max: moment().format('YYYY-MM-DD')
              },
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" type="submit"
            disabled={!validateWeekday(formData.end_date) || !validateWeekday(formData.start_date)}>
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );

};


export default EditInvestmentForm;