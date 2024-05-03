import React, { useState, useEffect } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner, Navbar, Nav, Button, Container, Form } from "react-bootstrap";
import "./App.css";
import { ethers } from "ethers";
import BlockProContract from "./artifacts/contracts/BlockPro.sol/BlockPro.json";
import logo from "./logo.png";
import Profile from "./Profile.js";
import Home from "./Home.js";
import Main from "./Main.js";

// Define the contract address
const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

function App() {
  // State variables
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [profile, setProfile] = useState(null);

  // Function to handle Metamask connection
  const web3Handler = async () => {
    try {
      // Request user accounts from Metamask
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      // Setup event listeners for Metamask
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", async () => {
        setLoading(true);
        web3Handler();
      });
      // Get provider from Metamask
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Get signer
      const signer = provider.getSigner();
      loadContract(signer);
    } catch (error) {
      console.error(error);
      alert("Failed to connect wallet");
    }
  };

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
      setContract(contract);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing contract:", error);
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar expand="lg" bg="secondary" variant="dark">
          <Container>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <div className="logo-title">
                  <img src={logo} width="40" height="40" className="" alt="" />
                  <Nav.Link as={Link} to="/main">
                    BlockPro
                  </Nav.Link>
                </div>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                {account ? (
                  <Nav.Link
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button nav-button btn-sm mx-4"
                  >
                    <Button variant="outline-light" className="connect-button">
                      {account.slice(0, 5) + "..." + account.slice(38, 42)}
                    </Button>
                  </Nav.Link>
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
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
              }}
            >
              <Spinner animation="border" style={{ display: "flex" }} />
              <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home contract={contractAddress} />} />
              <Route path="/main" element={<Main />} />
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
