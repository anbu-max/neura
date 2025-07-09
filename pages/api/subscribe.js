import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const sanitizedEmail = email.trim().toLowerCase();

  const filePath = path.join(process.cwd(), 'data', 'emails.csv');

  // Create data folder if it doesn't exist
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // If file doesn't exist, create it with headers
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Email,Timestamp\n');
  }

  const existingData = fs.readFileSync(filePath, 'utf-8');
  if (existingData.includes(sanitizedEmail)) {
    return res.status(409).json({ error: 'Email already subscribed' });
  }

  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
  fs.appendFileSync(filePath, `${sanitizedEmail},${timestamp}\n`);

  return res.status(200).json({ success: true });
}
