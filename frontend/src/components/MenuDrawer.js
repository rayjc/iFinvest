import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  portfolio: {
    paddingLeft: 70,
  }
});

const MenuDrawer = ({ isOpen, setIsOpen, handleLogout }) => {
  const classes = useStyles();
  const user = useSelector(state => state.user.user);
  const portfolios = useSelector(
    state => state.portfolios.portfolios.sort((a, b) => a.name < b.name)
  );

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsOpen(open);
  };

  const list = () => (
    <div
      className={`${classes.list} ${classes.fullList}`}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem component={NavLink} to="/" exact button>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {user && portfolios.map(p => (
          <ListItem className={classes.portfolio}
            component={NavLink} to={`/protfolios/${p.id}`} exact button key={p.id}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary={p.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {user ?
          <>
            <ListItem component={NavLink} to="/profile" button>
              <ListItemIcon><AccountBoxIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={handleLogout} button>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          </> :
          <>
            <ListItem component={NavLink} to="/auth#signup" exact button>
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Sign up" />
            </ListItem>
            <ListItem component={NavLink} to="/auth" exact button>
              <ListItemIcon><VpnKeyIcon /></ListItemIcon>
              <ListItemText primary="Log in" />
            </ListItem>
          </>
        }
      </List>
    </div>
  );

  return (
    <SwipeableDrawer
      open={isOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {list()}
    </SwipeableDrawer>
  );
};


export default MenuDrawer;