import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Alerts from './Alerts';
import { useDispatch } from 'react-redux';
import { login } from '../helpers/auth';
import { loadUser } from '../reducers/user/actions';
import LoginApi from '../api/loginApi';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  // const { setToken } = useContext(AuthContext);
  const dispatch = useDispatch();
  const classes = useStyles();
  const INIT_FORM_STATE = {
    "username": "",
    "password": "",
  };
  const [formData, setFormData] = useState(INIT_FORM_STATE);
  const [formErrors, setFormErrors] = useState([]);
  const history = useHistory();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setFormErrors([]);    // reset alert
    try {
      const token = await LoginApi.login(formData.username, formData.password);
      login(token);
      dispatch(loadUser(token));
      setFormData(INIT_FORM_STATE);   // empty out forms
      history.push('/');
    } catch (error) {
      // show alerts
      setFormErrors(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.length !== 0 && <Alerts points={formErrors} />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={formData.username.length === 0 || formData.password.length === 0}
          >
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}