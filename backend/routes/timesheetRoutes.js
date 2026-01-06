import express from 'express';
import * as ctrl from '../controllers/timesheetController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { timesheetValidation, updateTimesheetValidation } from '../validators/timesheetValidator.js';

const router = express.Router();

router.post('/create', timesheetValidation, ctrl.createTimesheet);
router.post('/import', upload.single('file'), ctrl.importTimesheet);
router.get('/get', ctrl.getTimesheets);
router.put('/update/:id', updateTimesheetValidation, ctrl.updateTimesheet);
router.delete('/delete/:id', ctrl.deleteTimesheet);

export default router;

