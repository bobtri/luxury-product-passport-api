import { describe, it, expect } from 'vitest';
import Block from '../src/engine/Block.js';

describe('Block', () => {
  it('should create a SHA-256 hash', () => {
    const block = new Block(0, Date.now(), [], '0');

    expect(block.hash).toHaveLength(64);
    expect(block.hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

it('should mine a block that satisfies the difficulty', () => {
  const block = new Block(1, Date.now(), [], '0');

  block.mineBlock(2);

  expect(block.hash.startsWith('00')).toBe(true);
});
