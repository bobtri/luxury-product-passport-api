import express from 'express';
import {
  getChain,
  addTransaction,
  minePendingTransactions,
  verifyProduct,
} from '../controllers/blockchainController.js';
import { validateTransaction } from '../middleware/validateTransaction.js';

const router = express.Router();

router.get('/chain', getChain);
router.post('/transactions', validateTransaction, addTransaction);
router.post('/mine', minePendingTransactions);
router.get('/verify/:id', verifyProduct);

export default router;
