import React, { useEffect } from 'react';
import { authenticate } from '../helpers/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../reducers/user/actions';
import { loadPortfolios } from '../reducers/portfolios/actions';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';
import Menu from './Menu';
import Routes from './Routes';


const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    // check if user is logged in
    const token = authenticate();
    if (token) {
      // fetch and store user info to store
      dispatch(loadUser(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(loadPortfolios());
    }
  }, [user, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Menu />
      <main>
        <Routes />
      </main>
    </ThemeProvider>
  );
}

export default App;
