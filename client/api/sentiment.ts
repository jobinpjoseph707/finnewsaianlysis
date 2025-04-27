import { VercelRequest, VercelResponse } from '@vercel/node';
import { SentimentAnalyzer } from '../server/mcp/sentiment-analyzer';

const sentimentAnalyzer = new SentimentAnalyzer();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(sentimentAnalyzer.getSentimentData());
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
