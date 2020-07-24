import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logoutButton: {
    marginLeft: theme.spacing(2),
  }
}));

const NavBar = ({ setShowDrawer, handleLogout }) => {
  const classes = useStyles();
  const user = useSelector(state => state.user.user);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton}
            color="inherit" aria-label="menu" onClick={() => setShowDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            iFinvest
          </Typography>
          {user ?
            <>
              <IconButton
                aria-label="account of current user"
                color="inherit"
                component={Link}
                to="/profile"
              >
                <AccountCircle />
              </IconButton>
              <IconButton
                className={classes.logoutButton}
                aria-label="log out"
                color="inherit"
                onClick={handleLogout}
              >
                <ExitToAppIcon />
              </IconButton>
            </> :
            <Button color="inherit" component={Link} to="/auth">Login</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};


export default NavBar;