// Import necessary modules and components
import React, { useState } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import "./App.css";
import { ethers } from "ethers";
import BlockProContract from "./artifacts/contracts/BlockPro.sol/BlockPro.json";
import { quantum } from "ldrs";
import logo from "./logo.png";
import Profile from "./Profile.js";
import Home from "./Home.js";
import Main from "./Main.js";

// Define the contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // State variables to manage application state
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [profile, setProfile] = useState(null);

  // Function to handle connection to Metamask and setup event listeners
  const web3Handler = async () => {
    try {
      // Request user accounts from Metamask
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]); // Set user's Ethereum account

      // Setup event listeners for Metamask
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", async () => {
        setLoading(true);
        web3Handler(); // Reconnect when accounts change
      });
      // Get provider from Metamask
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Get signer
      const signer = provider.getSigner();
      loadContract(signer); // Load contract with signer
    } catch (error) {
      console.error(error);
      alert("Failed to connect wallet");
    }
  };

  const disconnectWalletHandler = () => {
    console.log("Disconnecting from Metamask...");
    try {
      // Resetting account-related data and deactivating the wallet
      setAccount(null);
    } catch (error) {
      console.error("Error on disconnect: ", error);
    }
  };

  // Initialize Quantum animations
  quantum.register();

  // Function to load the contract
  const loadContract = async (signer) => {
    try {
      // Get provider from Metamask
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Get deployed contract instance
      const contract = new ethers.Contract(
        contractAddress,
        BlockProContract.abi,
        provider
      );
      setContract(contract); // Set contract instance
      setLoading(false); // Set loading state to false
    } catch (error) {
      console.error("Error initializing contract:", error);
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Navbar component */}
        <Navbar expand="lg" bg="secondary" variant="dark">
          <Container>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {/* Logo and title */}
                <div className="logo-title">
                  <img src={logo} width="40" height="40" className="" alt="" />
                  <Nav.Link as={Link} to="/main">
                    BlockPro
                  </Nav.Link>
                </div>
                {/* Navigation links */}
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                {/* Connect Wallet button */}
                {account ? (
                  <div>
                    <Nav.Link
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4"
                    >
                      <Button
                        variant="outline-light"
                        className="connect-button"
                      >
                        {account.slice(0, 5) + "..." + account.slice(38, 42)}
                      </Button>
                    </Nav.Link>
                    <Button
                      className="connect-button"
                      onClick={disconnectWalletHandler}
                      variant="outline-light"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="connect-button"
                    onClick={web3Handler}
                    variant="outline-light"
                  >
                    Connect Wallet
                  </Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          {/* Display loading spinner or application routes */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
              }}
            >
              <l-quantum size="45" speed="1.75" color="black"></l-quantum>
              <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              {/* Route to Home component */}
              <Route path="/" element={<Home contract={contractAddress} />} />
              {/* Route to Main component */}
              <Route path="/main" element={<Main />} />
              {/* Route to Profile component */}
              <Route
                path="/profile"
                element={
                  <Profile
                    contractAddress={contractAddress}
                    BlockProContract={BlockProContract}
                    name={name}
                    setName={setName}
                    headline={headline}
                    setHeadline={setHeadline}
                    profile={profile}
                    setProfile={setProfile}
                  />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
