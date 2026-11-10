import { Router } from 'express';
import { getDashboard } from '../Controllers/dashboard.controller';

const router = Router();
router.get('/', getDashboard);
export default router;
