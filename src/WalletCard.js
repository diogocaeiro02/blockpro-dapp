// Importing necessary modules and components
import React, { useState } from "react";
import { formatEther } from "ethers";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

// Defining the WalletCard component
const WalletCard = () => {
  // State variables for managing data and UI
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [isActive, setIsActive] = useState(false);

  // Function to handle connecting the wallet
  const connectWalletHandler = async () => {
    // Checking if MetaMask is installed
    if (window.ethereum) {
      // Requesting access to user accounts from MetaMask
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          // Handling the change in user account
          accountChangedHandler(result[0]);
        });
      // Setting the wallet as active
      setIsActive(true);
    } else {
      // Displaying an error message if MetaMask is not installed
      setErrorMessage("MetaMask not installed; using read-only defaults");
      return;
    }
  };

  // Function to handle changes in the user account
  const accountChangedHandler = (newAccount) => {
    // Setting the new account as the default account
    setDefaultAccount(newAccount);
    // Getting the balance of the new account
    getUserBalance(newAccount.toString());
  };

  // Function to get the user balance
  const getUserBalance = (address) => {
    // Requesting the balance of the user account from MetaMask
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        // Formatting and setting the user balance
        setUserBalance(formatEther(balance));
      });

    // Function to handle changes in the blockchain network
    const chainChangedHandler = () => {
      // Reloading the page when the network changes
      window.location.reload();
    };

    // Function to handle disconnecting the wallet
    const disconnectWalletHandler = () => {
      console.log("Disconnecting from Metamask...");
      try {
        // Resetting account-related data and deactivating the wallet
        setDefaultAccount(null);
        setUserBalance(null);
        setIsActive(false);
      } catch (error) {
        console.error("Error on disconnect: ", error);
      }
    };

    // Adding event listeners for account and chain changes
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);

    // Rendering the wallet card component based on wallet activation status
    return (
      <div className="WalletCard">
        {!isActive ? (
          <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
              <div
                className="card p-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h2 className="text-center mb-4">Login</h2>
                <div className="mb-3">
                  <h4>
                    {" "}
                    {
                      "Connection to Metamask using window.ethereum methods"
                    }{" "}
                  </h4>
                  <Button variant="primary" onClick={connectWalletHandler}>
                    {connButtonText}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
              <div
                className="card p-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h2 className="text-center mb-4">Login</h2>
                <div className="mb-3"></div>
                <div className="accountDisplay">
                  <h3>Address: {defaultAccount}</h3>
                </div>
                <div className="balanceDisplay">
                  <h3>Balance: {userBalance}</h3>
                </div>
                <Button variant="danger" onClick={disconnectWalletHandler}>
                  Disconnect Wallet
                </Button>
                {errorMessage}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
};
// Exporting the WalletCard component
export default WalletCard;
