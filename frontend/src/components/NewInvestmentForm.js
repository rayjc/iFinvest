import React, { useState } from 'react';
import { Button, Grid, InputAdornment, TextField } from '@material-ui/core';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { validateWeekday } from '../helpers/validate';
import { addInvestment } from '../reducers/investments/actions';
import SymbolField from './SymbolField';


const NewInvestmentForm = ({ portfolioId, handleClose }) => {
  const INIT_FORM_DATA = {
    "initial_value": "",
    "start_date": "",
    "end_date": "",
  };
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INIT_FORM_DATA);

  const [autoValue, setAutoValue] = useState({ symbol: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newInvestment = {
      ...formData,
      ...autoValue,
      initial_value: +formData.initial_value,
      portfolio_id: portfolioId
    };

    if (moment(formData.end_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      delete newInvestment.end_date;
    }
    dispatch(addInvestment(newInvestment));
    // dispatch(addPortfolioInvestment(portfolioId,));
    setFormData(INIT_FORM_DATA);
    handleClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} justify='center'>
        <Grid item xs={6}>
          <SymbolField value={autoValue} setValue={setAutoValue} />
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
            error={formData.start_date.length !== 0 && !validateWeekday(formData.start_date)}
            helperText={formData.start_date && !validateWeekday(formData.start_date) ? `Closed on weekend...` : ''}
            InputProps={{
              inputProps: {
                min: moment().subtract(5, "years").format("YYYY-MM-DD"),
                max: formData.end_date ? moment(formData.end_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
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
            error={formData.end_date.length !== 0 && !validateWeekday(formData.end_date)}
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
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );

};


export default NewInvestmentForm;