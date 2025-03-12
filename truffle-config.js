require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const INFURA_API_URL = process.env.INFURA_API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, INFURA_API_URL),
      network_id: 3, // Ropsten Testnet ID
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },
};
