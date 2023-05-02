const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    goerli: {
      provider: () =>
        new HDWalletProvider(
          keys.MNEMONIC,
          keys.INFURA_PROJECT_ID
        ),
      network_id: 5,
      gas: 5500000,
      gasPrice: 32000000000,
      confirmations: 2, 
      timeoutBlocks: 200,
    },
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
    }
  }
};
