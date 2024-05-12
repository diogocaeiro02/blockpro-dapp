// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlockPro {

    struct Profile {
        string name;
        string headline;
    }

    struct Post {
        address author;
        string content;
        uint256 timestamp;
    }

    mapping(address => Profile) public profiles;
    Post[] public posts;

    event ProfileCreated(address indexed user, string name, string headline);
    event ProfileUpdated(address indexed user, string name, string headline);
    event ProfileDeleted(address indexed user);
    event PostCreated(address indexed author, string content);

    constructor() {
        creator = msg.sender;
    }

    address public creator;

    function createProfile(string memory _name, string memory _headline) public {
        profiles[msg.sender] = Profile(_name, _headline);
        emit ProfileCreated(msg.sender, _name, _headline);
    }

    function getProfile(address _user) public view returns (string memory, string memory) {
        Profile memory profile = profiles[_user];
        return (profile.name, profile.headline);
    }

    function updateProfile(string memory _name, string memory _headline) public {
        profiles[msg.sender].name = _name;
        profiles[msg.sender].headline = _headline;
        emit ProfileUpdated(msg.sender, _name, _headline);
    }

    function deleteProfile() public {
        delete profiles[msg.sender];
        emit ProfileDeleted(msg.sender);
    }

    function createPost(string memory _content) public {
        uint256 timestamp = block.timestamp;
        posts.push(Post(msg.sender, _content, timestamp));
        emit PostCreated(msg.sender, _content);
    }

    function getPost(uint256 _index) public view returns (address, string memory, uint256) {
        require(_index < posts.length, "Post does not exist");
        Post memory post = posts[_index];
        return (post.author, post.content, post.timestamp);
    }

    function getPostCount() public view returns (uint256) {
        return posts.length;
    }
}