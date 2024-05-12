import React, { useState, useEffect } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { ethers } from "ethers";
import "./profile.css";

function Profile({ contractAddress, BlockProContract }) {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (name && headline) {
      await updateProfile();
    } else {
      await createProfile();
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      await enableMetamask();
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signerAddress = (await provider.getSigner()).address;
      const contract = new ethers.Contract(
        contractAddress,
        BlockProContract.abi,
        provider
      );
      const userProfile = await contract.getProfile(signerAddress);
      setProfile({
        name: userProfile[0],
        headline: userProfile[1],
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch profile");
      setLoading(false);
    }
  }

  async function createProfile() {
    try {
      await enableMetamask();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BlockProContract.abi,
        signer
      );
      const transaction = await contract.createProfile(name, headline);
      await transaction.wait();
      alert("Profile created successfully!");
      await getProfile(); // Refresh profile after creating
    } catch (error) {
      console.error(error);
      setError("Failed to create profile");
    }
  }

  async function updateProfile() {
    try {
      await enableMetamask();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BlockProContract.abi,
        provider
      ).connect(signer);
      const transaction = await contract.updateProfile(name, headline);
      await transaction.wait();
      alert("Profile updated successfully!");
      await getProfile(); // Refresh profile after updating
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError("Failed to update profile");
    }
  }

  async function enableMetamask() {
    if (!window.ethereum) throw new Error("Metamask not installed");
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit} className="profile-set">
        <h2>Profile</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label align="left">Name</Form.Label>
          <Form.Control
            className="typing-form"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formHeadline">
          <Form.Label>Industry</Form.Label>
          <Form.Control
            className="typing-form"
            type="text"
            placeholder="Enter your Industry"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </Form.Group>
        <Button className="button-profile" variant="primary" type="submit">
          Save
        </Button>
        <Button
          className="button-profile"
          variant="info"
          onClick={getProfile}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Get My Profile"
          )}
        </Button>
      </Form>
      {profile && (
        <div>
          <h2 className="gt-2">My Profile</h2>
          <p className="us-2">
            <strong>Name:</strong> {profile.name}
          </p>
          <p className="us-2">
            <strong>Industry:</strong> {profile.headline}
          </p>
        </div>
      )}
    </Container>
  );
}

export default Profile;
