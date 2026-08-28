import Block from './Block.js';

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getCurrentOwner(serialNumber) {
    const transactions = [];

    for (const block of this.chain) {
      for (const transaction of block.data) {
        if (transaction.serialNumber === serialNumber) {
          transactions.push(transaction);
        }
      }
    }

    for (const transaction of this.pendingTransactions) {
      if (transaction.serialNumber === serialNumber) {
        transactions.push(transaction);
      }
    }

    if (transactions.length === 0) {
      return null;
    }

    return transactions[transactions.length - 1].toAddress;
  }

  addTransaction(transaction) {
    const currentOwner = this.getCurrentOwner(transaction.serialNumber);

    if (currentOwner !== null && transaction.fromAddress !== currentOwner) {
      throw new Error('Transaction rejected: sender is not the current owner');
    }

    this.pendingTransactions.push(transaction);

    return transaction;
  }
}

export default Blockchain;
