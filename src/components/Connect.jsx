import React from 'react';
import { useMoralis } from 'react-moralis';
import { useState } from 'react';

export default function Connect() {
    const { authenticate, isAuthenticated, isAuthenticating, account, logout } = useMoralis();
    const [buttonText, changeButtonText] = useState("Connect with Metamask");

    const login = async () => {

        if(!isAuthenticated) {

            await authenticate().then(function (){
                changeButtonText("Logged in");
                console.log(("you were just authenticated"))
            })
            .catch(function (error) {
                console.log(error);
              });
        }
    };

    const logOut = async () => {
      await logout().then(function(){
        changeButtonText("Connect with Metamask");
        console.log("logget out");
      });

    };

    return (
      <div>
        <button style={{margin: "20px", fontSize: "20px"}} onClick={login}> {buttonText} </button>
        <button style={{margin: "20px", fontSize: "20px"}} onClick={logOut} disabled={isAuthenticating}> logOut</button>
      </div>
    )
}
