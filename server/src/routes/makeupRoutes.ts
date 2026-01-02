import { Router } from 'express';
import { generateMakeup } from '../controllers/makeupController';

const router = Router();

router.post('/generate', generateMakeup);

export default router;
