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

  it('POST /api/transactions should reject transfer from non-owner', async () => {
    const firstTransaction = {
      serialNumber: 'ROLEX-API-INVALID-001',
      brand: 'Rolex',
      model: 'Submariner',
      fromAddress: '0xManufacturerKey',
      toAddress: '0xCollectorA',
      timestamp: Date.now(),
    };

    await request(app).post('/api/transactions').send(firstTransaction);

    const invalidTransaction = {
      serialNumber: 'ROLEX-API-INVALID-001',
      brand: 'Rolex',
      model: 'Submariner',
      fromAddress: '0xCollectorB',
      toAddress: '0xCollectorC',
      timestamp: Date.now() + 1,
    };

    const response = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      'Transaction rejected: sender is not the current owner',
    );
  });

  it('POST /api/mine should mine pending transactions', async () => {
    const transaction = {
      serialNumber: 'ROLEX-API-MINE-001',
      brand: 'Rolex',
      model: 'Submariner',
      fromAddress: '0xManufacturerKey',
      toAddress: '0xCollectorA',
      timestamp: Date.now(),
    };

    await request(app).post('/api/transactions').send(transaction);

    const response = await request(app).post('/api/mine');

    expect(response.status).toBe(201);
    expect(response.body.block.data).toContainEqual(transaction);
    expect(response.body.block.hash.startsWith('00')).toBe(true);
  });

  it('GET /api/verify/:id should return product history and current owner', async () => {
    const firstTransaction = {
      serialNumber: 'ROLEX-VERIFY-001',
      brand: 'Rolex',
      model: 'Submariner',
      fromAddress: '0xManufacturerKey',
      toAddress: '0xCollectorA',
      timestamp: Date.now(),
    };

    const secondTransaction = {
      serialNumber: 'ROLEX-VERIFY-001',
      brand: 'Rolex',
      model: 'Submariner',
      fromAddress: '0xCollectorA',
      toAddress: '0xCollectorB',
      timestamp: Date.now() + 1,
    };

    await request(app).post('/api/transactions').send(firstTransaction);

    await request(app).post('/api/mine');

    await request(app).post('/api/transactions').send(secondTransaction);

    await request(app).post('/api/mine');

    const response = await request(app).get('/api/verify/ROLEX-VERIFY-001');

    expect(response.status).toBe(200);
    expect(response.body.serialNumber).toBe('ROLEX-VERIFY-001');
    expect(response.body.currentOwner).toBe('0xCollectorB');
    expect(response.body.history).toHaveLength(2);
  });
});
