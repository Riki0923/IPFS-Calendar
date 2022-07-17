import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from "react-router-dom";

/* ------------------------------- 
Setup Moralis server 
---------------------------------*/

// const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
// const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
// ENV filet megnézni mi nem jó!

const APP_ID = "59Ly5P8lU4zEIccGbR9wS1V7k6GU5vmWizxPmTCW";
const SERVER_URL = "https://detbyyesfssy.usemoralis.com:2053/server";

const Application = () => {
  if (!APP_ID || !SERVER_URL) {
     alert("Missing Moralis Application ID or Server URL. Make sure to set your .env file.") 
  }

  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MoralisProvider>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);