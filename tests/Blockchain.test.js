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

it('should add the first ownership transaction for a new product', () => {
  const blockchain = new Blockchain();

  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    brand: 'Rolex',
    model: 'Submariner',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: Date.now(),
  };

  blockchain.addTransaction(transaction);

  expect(blockchain.pendingTransactions).toHaveLength(1);
  expect(blockchain.pendingTransactions[0]).toEqual(transaction);
});

it('should reject a transaction from someone who is not the current owner', () => {
  const blockchain = new Blockchain();

  const firstTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    brand: 'Rolex',
    model: 'Submariner',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: Date.now(),
  };

  blockchain.addTransaction(firstTransaction);

  const invalidTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    brand: 'Rolex',
    model: 'Submariner',
    fromAddress: '0xCollectorB',
    toAddress: '0xCollectorC',
    timestamp: Date.now(),
  };

  expect(() => {
    blockchain.addTransaction(invalidTransaction);
  }).toThrow('Transaction rejected: sender is not the current owner');
});

it('should allow the current owner to transfer the product', () => {
  const blockchain = new Blockchain();

  const firstTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    brand: 'Rolex',
    model: 'Submariner',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: Date.now(),
  };

  blockchain.addTransaction(firstTransaction);

  const secondTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    brand: 'Rolex',
    model: 'Submariner',
    fromAddress: '0xCollectorA',
    toAddress: '0xCollectorB',
    timestamp: Date.now(),
  };

  blockchain.addTransaction(secondTransaction);

  expect(blockchain.pendingTransactions).toHaveLength(2);
  expect(blockchain.getCurrentOwner('ROLEX-SUB-9981')).toBe('0xCollectorB');
});

it('should mine pending transactions into a new block', () => {
  const blockchain = new Blockchain();

  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    brand: 'Rolex',
    model: 'Submariner',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: Date.now(),
  };

  blockchain.addTransaction(transaction);

  const minedBlock = blockchain.minePendingTransactions();

  expect(blockchain.chain).toHaveLength(2);
  expect(minedBlock.data).toContainEqual(transaction);
  expect(minedBlock.previousHash).toBe(blockchain.chain[0].hash);
  expect(blockchain.pendingTransactions).toEqual([]);
});
