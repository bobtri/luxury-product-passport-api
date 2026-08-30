import Block from './Block.js';

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];

    this.difficulty = Number.parseInt(process.env.POW_DIFFICULTY ?? '2', 10);
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

  getProductHistory(serialNumber) {
    const history = [];

    for (const block of this.chain) {
      for (const transaction of block.data) {
        if (transaction.serialNumber === serialNumber) {
          history.push(transaction);
        }
      }
    }

    for (const transaction of this.pendingTransactions) {
      if (transaction.serialNumber === serialNumber) {
        history.push(transaction);
      }
    }

    return history;
  }

  addTransaction(transaction) {
    const currentOwner = this.getCurrentOwner(transaction.serialNumber);

    if (currentOwner !== null && transaction.fromAddress !== currentOwner) {
      throw new Error('Transaction rejected: sender is not the current owner');
    }

    this.pendingTransactions.push(transaction);

    return transaction;
  }

  minePendingTransactions() {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      [...this.pendingTransactions],
      this.getLatestBlock().hash,
    );

    newBlock.mineBlock(this.difficulty);

    this.chain.push(newBlock);

    this.pendingTransactions = [];

    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

export default Blockchain;
