## 探索方向

1. nodejs 去串 「uniswap（contract）」 把 ETH 換成「某一種 token」
2. nodejs 去串「Compound（contract）」把「某一種token」「借/收」出去

### ref
- https://docs.uniswap.io/
- https://compound.finance/developers
- The Developer’s Guide to Uniswap
  - https://blog.oceanprotocol.com/the-developers-guide-to-uniswap-48fcf6e9ee1e
- https://stevenocean.github.io/2018/04/18/contract-with-truffle-1.html

### prerequire
- `geth`

### 啟動
用 `geth` 去連 `ropsten` testnet (**light** mode)
- https://github.com/ethereum/ropsten

```
geth --testnet --syncmode light --bootnodes "enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303,enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303" console
```

console 會顯示相關資訓，最後面幾行查看 `ipc` 位置，如
- `/Users/flameddd/Library/Ethereum/testnet/geth.ipc`

接著寫到 `src/index.js` 裡面
```js
const web3 = new Web3('/Users/flameddd/Library/Ethereum/testnet/geth.ipc', net);
```

最後
```
npm start
```

成功 connect

### nodejs and contract
先弄清楚怎麼 nodejs 怎麼呼叫 contract 吧！  

### test account
我的 test account
- `0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3`

### mnemonic 產生器
要產生`英文`的
- https://iancoleman.io/bip39/#english

### 20190926
１６：４３  
今天的方向，官方文件 testnet 在 `rinkeby`  
另外我要存取 node，我就需要 full node  
所以我來用 `infura` 吧  
- https://rinkeby.infura.io/v3/759c26b919e94d998a0bcd5a2a787a00

A typical developer’s **workflow** using Uniswap is:
1. 部署「ERC20 token contract」到 **Ethereum** network;
2. 透過「factory contract」來為「ERC20 token」建立一個「exchange contract」
3. 使用「exchange contract」來把「ERC20 token」跟「其他 tokens」做交換！

```
Each token exchange contract can only swap ERC20 token with ETH by itself. To swap between different ERC20 tokens, Uniswap uses ETH as the “ bridge” or intermediary token (i.e., sell token A into ETH and buy token B using ETH).
```

１８：００ 先這樣吧  今天進度不算好  
下次方向！
1. Truffle 基本重新學一次，build, compile, deploy to testnet
2. 有部署了後，在繼續後面的步驟  

### 20190927
１５：１９ 開工  
第一個目標 部署 contract  

試試看  
找到參考文件了，一步步做出來  
```
truffle init
（truffle create contract OceanToken1） 直接用上面的參考範例
truffle compile
truffle create migration deploy_contracts
```

１５：４３ 順利 compile  
接著部署？  

１５：４６ 產生部署文件  
- truffle create migration deploy_contracts

１５：５３ 部署文件是要用產生的啊～  
調整參數  

１５：５７ 能成功嗎？  
- truffle migrate --reset --network rinkeby

１６：１６ 恩... 真想罵  
mnemonic 要符合 `BIP39（英文）` 的規範  
- https://iancoleman.io/bip39/#english


１６：１８ 雖然報錯，但方向對的，要成功了  
```
Error: Error: Error:  *** Deployment Failed ***

"Migrations" could not deploy due to insufficient funds
   * Account:  0x51fD37D53Aed6A07b9728d3Abc8C5d406BeEBd7A
   * Balance:  0 wei
   * Message:  sender doesn't have enough funds to send tx. The upfront cost is: 60000000000000000 and the sender's account only has: 0
   * Try:
      + Using an adequately funded account
      + If you are using a local Geth node, verify that your node is synced.
```

１６：５７ 終於成功了  
原來不是隨便產生 BIP，是要拿自己的 private key 去處理 ...  
```
1569570371_deploy_contracts.js
==============================

   Deploying 'OceanToken'
   ----------------------
   > transaction hash:    0x612aa06938b11baa2f51bb6021bc3a56b4629c5076e687a5edff7fd459495c25
   > Blocks: 0            Seconds: 9
   > contract address:    0x14B40533228EcF2CAF6ffaccBd71B1341177dd55
   > block number:        5162382
   > block timestamp:     1569574652
   > account:             0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3
   > balance:             7.472728084
   > gas used:            2378701
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.02378701 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.02378701 ETH
```

１７：００ 想把 config 檔設計先弄出來！！  

１７：１１  
測試的 contract address
- Contract: 0x14B40533228EcF2CAF6ffaccBd71B1341177dd55

１７：１４
要為「ERC20 token」建立「exchange contract」，需要 send「簽名的 createExchange 交易」  
到 `Uniswap` 的「Factory contract」去  
（`Uniswap` 在 `Rinkeby` 的 factory contract: `0xf5d915570bc477f9b8d6c0e980aa81757a3aac36`）  

所以接下來的目標是
- use Infura to send signed raw transactions

１７：３３ 加油，努力 create exchange contract  

１７：４４ 首次執行 create exchange contract  

１８：０１ 執行成功，但我還沒看到 or 看懂內容  
```
sent 0x7a2560472dee0d27c08d5202e80b68c84e8fff89fdbe8c2ca4c539416308f0a6
```


看來是失敗了，明天吧...  
吃飯去  

### 20191001
１５：０５ 開工  
上次 create exchange contract 失敗了...  
忘了有什麼訊息嗎？  

```
(node:43501) UnhandledPromiseRejectionWarning: Error: Transaction has been reverted by the EVM:
{
  "blockHash": "0x26d93a81a68c21995505f55c37ab5107997192e6c0402343f4b6760de8f55739",
  "blockNumber": 5184974,
  "contractAddress": null,
  "cumulativeGasUsed": 294834,
  "from": "0xcbab04d00e2eb9354f7b66bbc2c0d76b43ed02d3",
  "gasUsed": 23441,
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": false,
  "to": "0xf5d915570bc477f9b8d6c0e980aa81757a3aac36",
  "transactionHash": "0x145c49e7ccbcb2be892b3edb3eabed05aa050401a863cbda8ffd8b93ff60fdc6",
  "transactionIndex": 2
}
```

我猜想是上次部署的 contract 裡面沒有 eth  
打一點過去看看  

１５：５０ 我懷疑，我沒有成功部署 erc20  
１６：０１ 從 testnet 也要不到 eth  應該是失敗的 erc20  

調整 import 位置，重新部署一次
```
truffle compile
truffle create migration deploy_contracts
truffle migrate --reset --network rinkeby
```

第二次部署
```
1569570371_deploy_contracts.js
==============================

   Replacing 'OceanToken'
   ----------------------
   > transaction hash:    0xeaa91b54f4ed867d14c3bcd1710c38f462c1a34c66f3a401ae3f50da67ef52ef
   > Blocks: 0            Seconds: 9
   > contract address:    0xa9Ed058b081421df9C53561BB02dd2b57bD386F5
   > block number:        5185220
   > block timestamp:     1569917289
   > account:             0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3
   > balance:             7.442766674
   > gas used:            2378701
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.02378701 ETH
```

１８：０９ 可惡，3小時下來，沒找出問題 ...  

２１：５２ 剛剛吃完晚餐就閃人了  
想說回來幫忙買東西  
現在繼續吧  看能不能有點突破  

２３：４７ 碰 uniswape 成功做一些操作  
但它都沒用到 createExchange 啊＠＠  
Orz||| 不能當參考  

００：５９ 「的交易所已經存在！」< --- what the fack... ????  
０１：１８ 這真的是我成功的嗎？  
- https://rinkeby.etherscan.io/tx/0x16c10dd09bbe197a8ed6249c02cfe4a2c7c44ba2f2b5ae214024b815ed1ae595

再接著往下做吧   

### 20191003
先往下繼續 try 看看  
１４：０７ 下一個步驟是 `get exchange address` !  
cool 這步驟剛好驗證，我上步驟是否成功  

１４：１１ 第一次 try get，有這麼簡單嗎ＱＱ  

１４；４２ 應該對了  所以我 text 的 exchage contract 是
- https://rinkeby.etherscan.io/address/0xa27fCC6f359543f518E3C2496e7B053e013F7D04


１４：５０ 下一步驟是，增加「exchange contract」的 Liquidity
需要
- Token contract address
- Exchange contract address

「Exchange contract」需要 initial token deposits 來提供 certain liquidity as an exchange

1. approve 「exchange contract」去「我的錢包」「withdraw ERC20 tokens」
2. 然後在「exchange contract」執行 `addLiquidity` function 來 deposit 「ERC20 tokens」跟「ETH」

```
4. Add Liquidity to Exchange Contract
Now we are ready to interact with the exchange contract. Here are important contract addresses that will be used:
Token contract address: 0xCC4d8eCFa6a5c1a84853EC5c0c08Cc54Cb177a6A
Exchange contract address: 0x416F1Ac032D1eEE743b18296aB958743B1E61E81
The exchange contract requires some initial token deposits in order to provide certain liquidity as an exchange. To this end, we need to first approve the exchange contract to withdraw ERC20 tokens from our wallet and then invoke addLiquidity function in the exchange contract to deposit both ERC20 tokens and ETH as following:
```

１５：００ 那個... 冷靜一下  
也算是成就了，待圖書館遇到火警 = =||||  

１５：１８ 接著來實作這兩個步驟  
```
1. token.approve(exchange_address, TOKEN_RESERVE)
2. exchange.addLiquidity(0, TOKEN_RESERVE, DEADLINE, transact={'value': ETH_RESERVE})
```

１５：５７ approve 應該是成功了  
１６：１９ 持續努力 addExchangeContractLiquidity 中  
看今天能不能完成這步驟  

１６：２５ 首次執行 addExchangeContractLiquidity  

雖然有很多不懂的地方，但應該是成功 增加「exchange contract」的 Liquidity 了  
我 test 的「exchange contract」  
- https://rinkeby.etherscan.io/address/0xa27fCC6f359543f518E3C2496e7B053e013F7D04

有看到「Balance: 0.1 Ether」了！  

１６：３４ 剩下最後一個步驟耶＠＠  
程式碼可以弄看看 = = |||  

１６：３６ 第五步驟

我錯了，還有兩步驟才對  
這樣明天有機會完成！！  
先休息吧 = =  

### 20191005
１５：１５ 開工，做到 １８：００  

１５：３１ 第一次執行步驟 5  
看起來成功了，找看看 ethscan  

查看我的 exchange contract
- https://rinkeby.etherscan.io/address/0xa27fCC6f359543f518E3C2496e7B053e013F7D04

「Balance: 0.15 Ether」，有變成 `0.15` 了 

步驟 5 做的事情是
```
Etherscan shows 0.05 ETH has been deposited into the 「exchange contract」 and converted into 5 ERC20 tokens, which are transferred to the buyer’s wallet.
```

１５：４３ 接著換攻略步驟 6  
```
we can swap between two ERC20 tokens. Here, we use our deployed ERC20 token and LINK token as an example
```

１６：１０ 執行步驟 6 之前  
先看看到底怎樣是正確的結果？  

- 會在我的 test account public addree 看到結果
- Uniswap withdraws 0.0015 我的「ERC20 token」然後 deposits「10 LINK tokens」進 wallet

１６：１５ 交易成功？  我有花到 ETH 嗎？  
有拿到「10 LINK tokens」了  

看起來是成功了  
但我對背後的原理還是不懂  不清楚  
可以先簡單重構程式碼，整理一下  

１７：００ 先開始寫 readme 吧  

１７：５８ 持續寫 readme 中  
還沒寫完  下次繼續  
奇怪，部署失敗  
下次再查原因吧
```
Error: Error: Error:  *** Deployment Failed ***

"Migrations" exceeded the block limit (with a gas value you set).
   * Block limit:  0x20269fb
   * Gas sent:     8000000
   * Try:
      + Sending less gas.
      + Setting a higher network block limit if you are on a
        private network or test client (like ganache).
```

### 20191007
１３：５４ 持續寫 readme 吧  
邊寫邊釐清原理  

１５：１０ commit and push to github  
花費 2 週實現此 DEMO  
- https://github.com/flameddd/uniswap_nodejs