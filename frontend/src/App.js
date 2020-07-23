import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { authenticate } from './helpers/auth';
import { useDispatch } from 'react-redux';
import { loadUser } from './reducers/user/actions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // check if user is logged in
    const token = authenticate();
    if (token) {
      // fetch and store user info to store
      dispatch(loadUser(token));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
