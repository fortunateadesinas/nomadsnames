require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    bscTestnet: {
      url: process.env.BSC_RPC_URL,  // BSC Testnet RPC URL
      accounts: [process.env.PRIVATE_KEY] // Deployer's private key
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY, // Your BscScan API key
  }
};
