import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './components/Admin';
import './styles.css';

const App = () => {
  return (
    <>
      <Admin />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('index'));
