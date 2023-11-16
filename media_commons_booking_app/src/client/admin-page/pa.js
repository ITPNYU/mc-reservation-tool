import React from 'react';
import ReactDOM from 'react-dom';
import PAPage from './components/PAPage';
import './styles.css';

const App = () => {
  return (
    <>
      <PAPage />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('index'));
