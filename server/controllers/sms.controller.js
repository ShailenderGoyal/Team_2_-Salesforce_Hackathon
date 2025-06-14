    // controllers/smsController.js
import { sendSMS } from '../service/vonageService.js';

export async function sendSMSHandler(req, res) {

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }

  try {
    const result = await sendSMS({ phone, code });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: err.message
    });
  }
}
