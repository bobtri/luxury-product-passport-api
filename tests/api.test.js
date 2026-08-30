import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Blockchain API', () => {
  it('GET /api/chain should return the blockchain', async () => {
    // ditt befintliga test
  });

  it('POST /api/transactions should add a valid transaction', async () => {
    const transaction = {
      serialNumber: 'ROLEX-SUB-9981',
      brand: 'Rolex',
      model: 'Submariner',
      fromAddress: '0xManufacturerKey',
      toAddress: '0xCollectorA',
      timestamp: Date.now(),
    };

    const response = await request(app)
      .post('/api/transactions')
      .send(transaction);

    expect(response.status).toBe(201);
    expect(response.body.transaction).toEqual(transaction);
  });
});
