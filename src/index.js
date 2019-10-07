const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const { factoryABI, exchangeABI } = require("./uniswapABI");
const {
  INFURA_URL,
  UNISWAP_FACTORT_CONTRACT_RINKEBY_ADDRESSS
} = require("./constants");

require("dotenv").config(); // import env

const PROVIDER = `${INFURA_URL}${process.env.INFURA_RINKEBY_KEY}`;

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
const addressTo = UNISWAP_FACTORT_CONTRACT_RINKEBY_ADDRESSS;

// 我的 public account
const addressFrom = "0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3";
const privateKey = process.env.PRIVATE_KEY;
// 我「事前」部署用來 test 的 ERC20 contract
const tragetContractAddress = "0xa9Ed058b081421df9C53561BB02dd2b57bD386F5";

async function sendSignedTransaction(txData) {
  const transaction = new EthereumTx(txData, {
    chain: "rinkeby",
    hardfork: "byzantium"
  });
  transaction.sign(new Buffer.from(privateKey, "hex"));
  const serializedTx = transaction.serialize().toString("hex");

  return await web3.eth
    .sendSignedTransaction(`0x${serializedTx}`)
    .on("error", console.error)
    .then(console.log);
}

// step1: 為「目標」建立「exchange contract」
async function createExchangeContract() {
  try {
    const contract = new web3.eth.Contract(factoryABI, addressTo);
    const tx = contract.methods.createExchange(tragetContractAddress);
    const encodedABI = tx.encodeABI();

    // get the number of transactions sent so far so we can create a fresh nonce
    const txCount = await web3.eth.getTransactionCount(addressFrom);

    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000),
      to: addressTo,
      from: addressFrom,
      data: encodedABI
    };

    await sendSignedTransaction(txData);
  } catch (error) {
    console.log("Error: createExchangeContract");
    console.log(error);
  }
}

// step2: 測試 step1 的結果，取回 step1 的 address
async function getExchangeContract() {
  try {
    const contract = new web3.eth.Contract(factoryABI, addressTo);
    const exchange = contract.methods.getExchange(tragetContractAddress);
    const address = await exchange.call({ from: addressFrom });
    return address || "";
  } catch (error) {
    console.log(`error: `, error);
  }
}

// step3: approve 「exchange contract」去「我的錢包」「withdraw ERC20 tokens」
async function approveExchangeContract(exchangeContractAddress) {
  try {
    if (!exchangeContractAddress) {
      return;
    }
    // 我的「exchnage contract address」，從 step2 取到的
    const exchangeAddr = exchangeContractAddress;
    const addressTo = tragetContractAddress;
    const contract = new web3.eth.Contract(exchangeABI, addressTo);
    const TOKEN_ADDED = web3.utils.toHex(100 * 10 ** 18);
    const tx = contract.methods.approve(exchangeAddr, TOKEN_ADDED);
    const encodedABI = tx.encodeABI();

    const txCount = await web3.eth.getTransactionCount(addressFrom);

    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
      to: addressTo,
      from: addressFrom,
      data: encodedABI
    };

    // approve 「exchange contract」去「我的錢包」「withdraw ERC20 tokens」
    await sendSignedTransaction(txData);
  } catch (error) {
    console.log("error", error);
  }
}

async function addExchangeContractLiquidity(exchangeContractAddress) {
  try {
    if (!exchangeContractAddress) {
      return;
    }
    // 我的「exchnage contract address」，從 step2 取到的
    const addressTo = exchangeContractAddress;
    const contract = new web3.eth.Contract(exchangeABI, addressTo);

    // const blcokNumber = await web3.eth.getBlockNumber();
    // const theMostRecentBlock = await web3.eth.getBlock(blcokNumber);
    // const DEADLINE = theMostRecentBlock.timestamp;

    // https://github.com/oceanprotocol/Nautilus/blob/master/3-uniswap/script/4.add.liquidity.js#L19
    // 不懂為什麼 DEADLINE 寫這數字就能成功 sendSignedTransaction
    // 我上面的取法反而會失敗...
    const DEADLINE = 1742680400; // deadline = w3.eth.getBlock(w3.eth.blockNumber).timestamp
    const ETH_ADDED = web3.utils.toHex(1 * 10 ** 17); // 0.1 ETH
    const TOKEN_ADDED = web3.utils.toHex(15 * 10 ** 18); // 15  tokens
    const tx = contract.methods.addLiquidity(1, TOKEN_ADDED, DEADLINE);
    const encodedABI = tx.encodeABI();

    const txCount = await web3.eth.getTransactionCount(addressFrom);

    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
      to: addressTo,
      from: addressFrom,
      data: encodedABI,
      value: ETH_ADDED
    };

    await sendSignedTransaction(txData);
  } catch (error) {
    console.log("error", error);
  }
}

async function swapEtherTOErc20() {
  try {
    // 我的「exchnage contract address」，從 step2 取到的
    const addressTo = "0xa27fCC6f359543f518E3C2496e7B053e013F7D04";
    const contract = new web3.eth.Contract(exchangeABI, addressTo);

    // 這個值是抄網路上範例的，前一步驟想自己取，但取出來不能順利送交易，還不懂原因。
    const DEADLINE = 1742680400;
    const ETH_SOLD = web3.utils.toHex(5 * 10 ** 16); // 0.1 ETH
    const tx = contract.methods.ethToTokenSwapInput(1, DEADLINE);
    const encodedABI = tx.encodeABI();

    const txCount = await web3.eth.getTransactionCount(addressFrom);

    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
      to: addressTo,
      from: addressFrom,
      data: encodedABI,
      value: ETH_SOLD
    };

    await sendSignedTransaction(txData);
  } catch (error) {
    console.log("error", error);
  }
}

async function convertToken2Token(exchangeContractAddress) {
  try {
    if (!exchangeContractAddress) {
      return;
    }
    // 我的「exchnage contract address」，從 step2 取到的
    const addressTo = exchangeContractAddress;

    // 這是 Chainlink team 部署 Rinkeby 的「LINK token contract」address
    const linkTokenAddress = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    const contract = new web3.eth.Contract(exchangeABI, addressTo);

    const DEADLINE = 1742680400;
    const LINK_BOUGHT = web3.utils.toHex(10 * 10 ** 18); // 10 link tokens
    const MAX_TOKEN_SOLD = web3.utils.toHex(80 * 10 ** 18); // 10 link tokens
    const MAX_ETH_SOLD = web3.utils.toHex(1 * 10 ** 17); // 0.1 ETH

    const tx = contract.methods.tokenToTokenTransferOutput(
      LINK_BOUGHT,
      MAX_TOKEN_SOLD,
      MAX_ETH_SOLD,
      DEADLINE,
      addressFrom,
      linkTokenAddress
    );
    const encodedABI = tx.encodeABI();
    const txCount = await web3.eth.getTransactionCount(addressFrom);

    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
      to: addressTo,
      from: addressFrom,
      data: encodedABI
    };

    await sendSignedTransaction(txData);
  } catch (error) {
    console.log("error", error);
  }
}

async function main() {
  console.log("執行 step1: 為「目標」建立「exchange contract」");
  console.log("只能執行一次，第二次執行會變成重複建立，會失敗。");
  await createExchangeContract(); // step1
  console.log("執行 step2: 測試 step1 的結果，取回 step1 的 address");
  const exchangeContractAddress = await getExchangeContract(); // step2
  console.log(
    "執行 step3: approve 「exchange contract」去「我的錢包」「withdraw ERC20 tokens」"
  );
  await approveExchangeContract(exchangeContractAddress); // step3
  console.log("執行 step4: 增加「Exchange contract」的 Liquidity");
  await addExchangeContractLiquidity(exchangeContractAddress); // step4
  console.log("執行 step5: 將 eth 跟 erc20 token 交換");
  await swapEtherTOErc20(); // step5
  console.log(
    "執行 step6: Uniswap「取出」XX 我的「ERC20 token」然後「存」XX「LINK tokens」"
  );
  await convertToken2Token(exchangeContractAddress); // step6
}

main();
