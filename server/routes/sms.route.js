// routes/smsRoutes.js
import express from 'express';
import { sendSMSHandler } from '../controllers/sms.controller.js';

const router = express.Router();

router.post('/send-sms', sendSMSHandler);

export default router;
