import Blockchain from '../engine/Blockchain.js';

const blockchain = new Blockchain();

export function getChain(req, res) {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
}

export { blockchain };
