## 探索方向

1. nodejs 去串 「uniswap（contract）」 把 ETH 換成「某一種 token」
2. nodejs 去串「Compound（contract）」把「某一種token」「借/收」出去

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