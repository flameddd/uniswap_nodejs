## about this DEMO
- nodejs 去串 「uniswap（contract）」 把 ETH 換成「某一種 token」

### ref: The Developer’s Guide to Uniswap
- https://blog.oceanprotocol.com/the-developers-guide-to-uniswap-48fcf6e9ee1e
- https://github.com/oceanprotocol/Nautilus/tree/master/3-uniswap

### 其他
- uniswap 的 testnet 為 rinkeby
- 利用 infura 去連 rinkeby

### 執行方法
#### 先下載 repo、install  
```
git clone ＿＿＿＿＿＿
cd uniswap_nodejs
npm install
```

#### 申請 infura（有了就不用申請了）
- https://infura.io/dashboard
- 建立屬於自己的 project
- 記下 `PROJECT ID`

#### 建立環境變數 
- 根目錄底下建立 `.env` 檔案（可以複製 `.env.template` 出來改檔名）
- 填上 `INFURA_RINKEBY_KEY`（上面提到的 PROJECTID）
- 填上 `拿來測試用的 account 的私鑰`  

（`.env` 不會被 git 紀錄，也不會被 commit 出去）

#### 部署 test 用的 `erc20 contract`
此 repo 已經有一個了 (/contracts/OceanToken.sol)，所以直接 compile 吧  
```
truffle compile
truffle create migration deploy_contracts
```

然後部署文件(`/migrations/XXXX_deploy_contract.js`)改為
```js
const OceanToken = artifacts.require("./OceanToken.sol");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(OceanToken);
};
```

部署到 `rinkeby` testnet
```
truffle migrate --reset --network rinkeby
```

contract 的部分我不熟，這邊底下的 contract 都是從範例 copy 來的
- https://github.com/oceanprotocol/Nautilus/tree/master/3-uniswap/contracts


記住這次部署的 `contract address`
```
==============================
Deploying 'OceanToken'
   ----------------------
   > transaction hash:    0x9e2fbc73358cadf9e77650f46eb737f81651e213d820c563f4ab8161862e2249
   > Blocks: 1            Seconds: 9
   > contract address:    0x608e613c845C489fED85D3E22DD1e46FF10850C7
   > block number:        5219285
   > block timestamp:     1570428285
   > account:             0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3
   > balance:             7.027141236005765005
   > gas used:            2378701
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.02378701 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.02378701 ETH
```

#### 填上 `account address` 跟 `contract address`
- 修改 `src/index.js` 檔案的 **Line 17, 20** 行
  - 分別填上 `account address` 跟 `contract address`

```js
// 我的 public account
const addressFrom = '0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3';
const privateKey = process.env.PRIVATE_KEY
// 我「事前」部署用來 test 的 ERC20 contract
const tragetContractAddress = '0xa9Ed058b081421df9C53561BB02dd2b57bD386F5'
```

### 執行
```
npm start
```


（重複執行的話，`step1 createExchangeContract` 會 fail  
因為 `uniswap` 針對**一個 contract 只會建立一個 exchange contract**
後續的步驟還是會成功）  

最後去
- https://rinkeby.etherscan.io/

查看 account 的 `token`，有多 `10 LINK token` 就是成功了  
（看到 step6 的成功訊息後，可能還要稍微等一下下才能在 etherscan 看到結果）  
- ex: https://rinkeby.etherscan.io/address/0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3