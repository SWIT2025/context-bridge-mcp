#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { list } from "./tools/list";
import { read } from "./tools/read";
import { search } from "./tools/search";

/**
 * Context Bridge Server (McpServer version).
 */
const server = new McpServer({
  name: "context-bridge",
  version: "1.0.0",
});

server.registerTool(
    "list_documents",
    {
      title: "List documents",
      description: "List supported documents in a directory",
      inputSchema: {
        path: z.string().describe("Absolute path").optional(),
        recursive: z.boolean().describe("Recurse").optional(),
      }
    },
    async ({ path, recursive }) => {
      const docs = await list(path || process.cwd(), recursive);
      return {
        content: [
          { type: "text", text: JSON.stringify(docs, null, 2) },
        ],
      };
    }
);

server.registerTool(
    "read_document",
    {
        title: "Read document",
        description: "Extract text from a file",
        inputSchema: {
            path: z.string().describe("Absolute path"),
        },
    },
    async ({ path }) => {
        const { content, flag } = await read(path);

        return {
            // важное: as const, чтобы type был "text", а не string
            content: [
                { type: "text", text: content } as const,
                ...(flag
                    ? [{ type: "text", text: "\n[Warning: Truncated]" } as const]
                    : []),
                ],
        };
    }
);

server.registerTool(
    "search_documents",
    {
      title: "Search documents",
      description: "Search text within documents",
      inputSchema: {
        query: z.string().describe("Term"),
        path: z.string().describe("Path").optional(),
        recursive: z.boolean().describe("Recurse").optional(),
      },
    },
    async ({ query, path, recursive }) => {
      const results = await search(query, path || process.cwd(), recursive);
      return {
        content: [
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
      };
    }
);

/**
 * Main entry.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
