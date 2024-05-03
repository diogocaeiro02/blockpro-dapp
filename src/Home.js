import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { ethers } from "ethers";
import BlockProContract from "./artifacts/contracts/BlockPro.sol/BlockPro.json";
import "./App.css";

// Define the contract address
const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

function Home({ contract }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Connect to the contract
        const provider = new ethers.JsonRpcProvider();
        const contractInstance = new ethers.Contract(
          contract,
          BlockProContract.abi,
          provider
        );

        // Fetch post count
        const postCount = await contractInstance.getPostCount();

        // Fetch posts
        const postsData = [];
        for (let i = 0; i < postCount; i++) {
          const postData = await contractInstance.getPost(i);
          postsData.push({
            author: postData[0],
            content: postData[1],
          });
        }

        // Set posts state
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    }

    fetchPosts();
  }, [contract]);

  // Function to create a new post
  const createPost = async () => {
    try {
      await enableMetamask();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BlockProContract.abi,
        signer
      );
      // Call the createPost function on the contract
      const transaction = await contract.createPost(postContent);
      await transaction.wait();
      alert("Post created successfully!");
      setPostContent("");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  };

  // Function to enable Metamask
  const enableMetamask = async () => {
    if (!window.ethereum) throw new Error("Metamask not installed");
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  };

  return (
    <Container className="posts-content">
      <div>
        <h2>Create Post</h2>
        <Form>
          {/* Post Content Field */}
          <Form.Group className="mb-3" controlId="formPostContent">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your post content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </Form.Group>
          {/* Submit Button */}
          <Button
            className="button-post"
            variant="primary"
            onClick={createPost}
          >
            Post
          </Button>
        </Form>
      </div>
      <h2>Latest Posts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div>
          {posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            [...posts]
              .sort((a, b) => b.timestamp - a.timestamp)
              .reverse()
              .slice(0, 5)
              .map((post, index) => (
                <Card key={index} className="my-3">
                  <Card.Body>
                    <Card.Title>Post by {post.author}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                  </Card.Body>
                </Card>
              ))
          )}
        </div>
      )}
    </Container>
  );
}

export default Home;
