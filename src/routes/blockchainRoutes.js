import express from 'express';
import {
  getChain,
  addTransaction,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', getChain);
router.post('/transactions', addTransaction);

export default router;
