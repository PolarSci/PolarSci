require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    solana: {
      url: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "solana-testnet": {
      url: process.env.SOLANA_TESTNET_RPC_URL || "https://api.testnet.solana.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
}; 