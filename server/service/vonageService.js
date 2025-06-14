// services/vonageService.js
import { Vonage } from '@vonage/server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const vonage = new Vonage({
  apiKey: process.env.apikey,
  apiSecret: process.env.apiSecret
});

export async function sendSMS({ phone, code }) {
    console.log(process.env.apikey);
    console.log(process.env.apiSecret);
    
  const from = "Vonage APIs";
  const to = `91${phone}`; // India country code
  const text = `Your verification code is: ${code}`;

  try {
    const response = await vonage.sms.send({ to, from, text });

    if (response.messages[0].status === '0') {
      return { success: true, message: 'Message sent successfully' };
    } else {
      return {
        success: false,
        error: 'Failed to send SMS',
        details: response.messages[0]
      };
    }
  } catch (error) {
    throw new Error(`Vonage Error: ${error.message}`);
  }
}
