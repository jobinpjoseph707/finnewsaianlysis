// Copied from server/mcp/index.ts for Vercel API use
export function getMCPStatus() {
  return {
    status: "operational",
    updatedAt: new Date(),
    message: "MCP system is running smoothly."
  };
}
