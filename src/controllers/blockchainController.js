import Blockchain from '../engine/Blockchain.js';

const blockchain = new Blockchain();

export function getChain(req, res) {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
}

export function addTransaction(req, res) {
  try {
    const transaction = blockchain.addTransaction(req.body);

    res.status(201).json({
      transaction,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export { blockchain };
