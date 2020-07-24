import React, { useState } from 'react';
import MenuDrawer from './MenuDrawer';
import NavBar from './NavBar';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../helpers/auth';
import { resetUser } from '../reducers/user/actions';


const Menu = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    dispatch(resetUser());
    history.push('/');
  };

  return (
    <>
      <NavBar setShowDrawer={setShowDrawer} handleLogout={handleLogout} />
      <MenuDrawer isOpen={showDrawer} setIsOpen={setShowDrawer} handleLogout={handleLogout} />
    </>
  );
};


export default Menu;