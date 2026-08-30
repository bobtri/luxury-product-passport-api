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

export function minePendingTransactions(req, res) {
  const block = blockchain.minePendingTransactions();

  res.status(201).json({
    block,
  });
}

export function verifyProduct(req, res) {
  const { id } = req.params;

  const history = blockchain.getProductHistory(id);

  if (history.length === 0) {
    return res.status(404).json({
      error: 'Product not found',
    });
  }

  const currentOwner = blockchain.getCurrentOwner(id);

  res.status(200).json({
    serialNumber: id,
    currentOwner,
    history,
  });
}

export { blockchain };
