import { VercelRequest, VercelResponse } from '@vercel/node';
import { MarketDataService } from '../lib/market-data';

const marketDataService = new MarketDataService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const data = await marketDataService.getMarketData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
}
