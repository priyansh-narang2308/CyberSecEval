import express from 'express';
import { getRSAPublicKey } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/public-key', getRSAPublicKey);

export default router;
