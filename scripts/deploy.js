const hre = require("hardhat");

async function main() {
  const BlockProFactory = await hre.ethers.getContractFactory("BlockPro");
  const blockPro = await BlockProFactory.deploy();

  console.log("BlockPro contract deployed to ", await blockPro.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
