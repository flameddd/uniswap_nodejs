const HDWalletProvider = require("truffle-hdwallet-provider");
const { INFURA_URL } = require("./src/constants");

require("dotenv").config(); // import env

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `${INFURA_URL}${process.env.INFURA_RINKEBY_KEY}`
        );
      },
      network_id: 4,
      gas: 6000000,
      gasPrice: 10000000000
    }
  }
};
