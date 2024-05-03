const { expect } = require("chai");

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
