require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

// Create a task called accounts that will list the accounts that we get
//from our hardhat node and the balances each account holds currently
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account.address);
    console.log(account.address, ": ", balance);
  }
});

module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    artifacts: "./src/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainID: 1337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/<key>",
      //accounts: [privateKey1, privateKey2, ...]
    },
  },
  mocha: {
    timeout: 240000, // 4 minutes
  },
};
