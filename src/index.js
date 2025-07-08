import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Global styles
import App from './App';
import reportWebVitals from './reportWebVitals';

// Context API setup
import { StateProvider } from "./components/StateProvider";
import reducer, { initialState } from "./components/reducer";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional performance logging
reportWebVitals(); // you can use: reportWebVitals(console.log)
