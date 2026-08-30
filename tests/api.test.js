import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Blockchain API', () => {
  it('GET /api/chain should return the blockchain', async () => {
    const response = await request(app).get('/api/chain');

    expect(response.status).toBe(200);
    expect(response.body.chain).toHaveLength(1);
    expect(response.body.pendingTransactions).toEqual([]);
  });
});
