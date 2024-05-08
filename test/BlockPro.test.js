const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockPro", function () {
  let BlockPro;
  let blockPro;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    BlockPro = await ethers.getContractFactory("BlockPro");
    blockPro = await BlockPro.deploy();
  });

  describe("createProfile", function () {
    it("Should create a new profile", async function () {
      await blockPro
        .connect(addr1)
        .createProfile("John Doe", "Software Engineer");
      const profile = await blockPro.getProfile(addr1.address);
      expect(profile[0]).to.equal("John Doe");
      expect(profile[1]).to.equal("Software Engineer");
    });

    it("Should retrieve an existing profile", async function () {
      await blockPro.connect(addr2).createProfile("Alice", "Data Scientist");
      const profile = await blockPro.getProfile(addr2.address);
      expect(profile[0]).to.equal("Alice");
      expect(profile[1]).to.equal("Data Scientist");
    });
  });

  describe("createPost", function () {
    it("Should create a Post", async function () {
      await blockPro
        .connect(addr1)
        .createProfile("John Doe", "Software Engineer");
      await blockPro.connect(addr1).createPost("Hello World");
      const post = await blockPro.getPost(0);
      expect(post[0]).to.equal(addr1.address);
      expect(post[1]).to.equal("Hello World");
    });

    it("Should retrieve a post", async function () {
      await blockPro
        .connect(addr1)
        .createProfile("John Doe", "Software Engineer");
      await expect(blockPro.connect(addr1).createPost("Hello World"))
        .to.emit(blockPro, "PostCreated")
        .withArgs(addr1.address, "Hello World");
    });
  });

  describe("updateProfile", function () {
    it("Should update a profile", async function () {
      await blockPro.createProfile("Alice", "Software Engineer");
      await blockPro
        .connect(addr1)
        .updateProfile("Tomas", "AeroSpacial Engineer II");
      const profile = await blockPro.getProfile(addr1.address);
      expect(profile[0]).to.equal("Tomas");
      expect(profile[1]).to.equal("AeroSpacial Engineer II");
    });

    it("Should emit a ProfileUpdated event", async function () {
      await blockPro.createProfile("Alice", "Software Engineer");
      await expect(
        blockPro
          .connect(addr1)
          .updateProfile("Tomas", "AeroSpacial Engineer II")
      )
        .to.emit(blockPro, "ProfileUpdated")
        .withArgs(addr1.address, "Tomas", "AeroSpacial Engineer II");
    });
  });

  describe("deleteProfile", function () {
    it("Should delete a profile", async function () {
      await blockPro.createProfile("Alice", "Software Engineer");
      await blockPro.connect(addr1).deleteProfile();
      const profile = await blockPro.getProfile(addr1.address);
      expect(profile[0]).to.equal(""); // or expect(profile[0]).to.equal(null);
      expect(profile[1]).to.equal(""); // or expect(profile[1]).to.equal(null);
    });

    it("Should emit a ProfileDeleted event", async function () {
      await blockPro.createProfile("Alice", "Software Engineer");
      await expect(blockPro.connect(addr1).deleteProfile())
        .to.emit(blockPro, "ProfileDeleted")
        .withArgs(addr1.address);
    });
  });

  describe("getPostCount", function () {
    it("should return the correct post count", async function () {
      await blockPro.createPost("Hello, world!");
      await blockPro.createPost("Hello, again!");
      const postCount = await blockPro.getPostCount();
      expect(postCount).to.equal(2);
    });
  });
});
