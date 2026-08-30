import express from 'express';
import {
  getChain,
  addTransaction,
  minePendingTransactions,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', getChain);
router.post('/transactions', addTransaction);
router.post('/mine', minePendingTransactions);

export default router;
