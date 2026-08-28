import { describe, it, expect } from 'vitest';
import Blockchain from '../src/engine/Blockchain.js';

describe('Blockchain', () => {
  it('should create a blockchain with a genesis block', () => {
    const blockchain = new Blockchain();

    expect(blockchain.chain).toHaveLength(1);
    expect(blockchain.pendingTransactions).toEqual([]);
  });
});

it('should return the latest block in the chain', () => {
  const blockchain = new Blockchain();

  const latestBlock = blockchain.getLatestBlock();

  expect(latestBlock).toBe(blockchain.chain[0]);
  expect(latestBlock.index).toBe(0);
});
