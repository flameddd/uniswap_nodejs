const net = require("net");
const Web3 = require("web3");

const web3 = new Web3("/Users/flameddd/Library/Ethereum/testnet/geth.ipc", net);

async function main() {
  try {
    console.log("start 了");
    web3.eth.net
      .isListening()
      .then(() => console.log("is connected"))
      .catch(console.log);
  } catch (error) {
    console.error(error);
  }
}

main();
