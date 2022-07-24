import './App.css';
import React from 'react';
import { useMoralis } from "react-moralis";
import { useState, useEffect } from 'react';
import Connect from './components/Connect';
import "./input.css";
import { Routes, Route } from "react-router-dom";

export default function App() {

    const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
  } = useMoralis();

  /* ------------------------------- 
  Enable Web3 provider if the user isn't authentificated
  ---------------------------------*/

  useEffect(()=> {
    const connectorId = window.localStorage.getItem("connectorId");
    if (
      window.ethereum &&
      isAuthenticated &&
      !isWeb3Enabled &&
      !isWeb3EnableLoading
    ) {
      enableWeb3({ provider: connectorId});
    }
  }, [isAuthenticated, isWeb3Enabled]);

    // asks the user for permission to change network to polygon mumbain testnet if other network is detected
    useEffect(() => {
      if (window.ethereum) {
        (async () => {
          await window.ethereum.request({
            id: 1,
            jsonrpc: "2.0",
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                chainName: "Polygon Testnet Mumbai",
                nativeCurrency: {
                  name: "tMATIC",
                  symbol: "tMATIC", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
              },
            ],
          });
        })();
      }
    }, []);
  // return (
  //   <div>{Connect()}</div>
  // )

  return(
    <Routes>
      <Route path="/" element ={<Connect/>}>

      </Route>
    </Routes>
  )
}