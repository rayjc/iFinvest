import React, { useState } from 'react';
import { Button, Container, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { addPortfolio } from '../reducers/portfolios/actions';
import { useSelector, useDispatch } from 'react-redux';


const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
}));

const NewPortfolioForm = ({ setShowForm }) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const portfolios = useSelector(state => state.portfolios.portfolios);
  const dispatch = useDispatch();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (portfolios.find(p => p.name === name)) {
      // check if duplciate portfolio name
      setNameError(true);
    } else {
      // create portfolio on backend and store in redux
      dispatch(addPortfolio(name));
      setName("");
      setShowForm(false);
    }
  };

  const handleChange = (evt) => {
    setNameError(false);
    setName(evt.target.value);
  };

  const validateLength = () => name.length < 12;

  const showHelperText = () => {
    if (!validateLength()) {
      return "Please enter a shorter name.";
    } else if (nameError) {
      return "This name already exists.";
    } else {
      return "";
    }
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              required
              autoFocus
              error={!validateLength() || nameError}
              helperText={showHelperText()}
              size="small"
              fullWidth
              autoComplete="off"
              id="name"
              label="Portfolio Name"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              className={classes.submit}
              type="submit"
              size="small"
              fullWidth
              variant="contained"
              color="primary"
              disabled={name.length === 0 || !validateLength() || nameError}
            >
              Create
          </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};


export default NewPortfolioForm;