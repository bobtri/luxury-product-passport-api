import crypto from 'crypto';

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;

    this.nonce = 0;

    this.hash = this.calculateHash();
  }

  calculateHash() {
    const blockData =
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.previousHash +
      this.nonce;

    return crypto.createHash('sha256').update(blockData).digest('hex');
  }
}

export default Block;
