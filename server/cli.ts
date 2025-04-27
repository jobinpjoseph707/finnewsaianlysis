// CLI tool for MarketDataService
import { MarketDataService } from "./mcp/market-data";

async function main() {
  const [,, command, ...args] = process.argv;
  const mds = new MarketDataService();

  if (command === "fetch") {
    const symbol = args[0];
    if (!symbol) {
      console.log("Usage: node cli.js fetch SYMBOL");
      return;
    }
    const data = await mds.getMarketDataBySymbol(symbol);
    console.log(JSON.stringify(data, null, 2));
  } else if (command === "all") {
    const data = await mds.getMarketData();
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log("Usage: node cli.js [fetch SYMBOL | all]");
  }
}

main();
