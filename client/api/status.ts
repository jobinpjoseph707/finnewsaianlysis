import { VercelRequest, VercelResponse } from '@vercel/node';
import { getMCPStatus } from '../server/mcp';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(getMCPStatus());
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
