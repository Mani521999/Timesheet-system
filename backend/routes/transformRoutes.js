import express from 'express';
import * as ctrl from '../controllers/transformController.js';

const router = express.Router();

router.post('/flattenEmployee', ctrl.flattenEmployee);
router.post('/flattenProducts', ctrl.flattenProducts);
export default router;
