import React, { useState } from 'react';
import { Box, Container, Paper, Tab, Tabs, makeStyles } from '@material-ui/core';
import Login from './Login';
import Signup from './Signup';
import { Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    marginTop: 50,
  }
});

const Auth = () => {
  const classes = useStyles();
  const currUser = useSelector(state => state.user.user);
  const location = useLocation();
  const [tabValue, setTabValue] = useState(location.hash === "#signup" ? 1 : 0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (currUser) {
    return <Redirect to='/' />;
  }

  return (
    <Container className={classes.root} maxWidth="xs">
      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          centered
          aria-label="login and signup form"
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>
      </Paper>
      <TabPanel value={tabValue} index={0}>
        <Login />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Signup />
      </TabPanel>
    </Container>
  );
};


export default Auth;