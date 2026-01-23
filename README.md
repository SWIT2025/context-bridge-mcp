<p align="center">
  <img src="./assets/logo.png" width="200" height="200" style="border-radius: 50%;" alt="Context Bridge Logo">
</p>

# Context Bridge MCP

Context Bridge is a Model Context Protocol (MCP) server designed to provide Large Language Models (LLMs) with secure, read-only access to local documentation. It acts as an intermediary layer, allowing agents to scan directories, search for keywords, and extract content from PDF, DOCX, Markdown, and plain text files directly from the host filesystem.

This tool resolves the context isolation problem by enabling agents to reference large local knowledge bases without requiring file uploads or manual copy-pasting.

## Features

- **File System Scanning:** recursively list documents with metadata (size, modification date) to understand the knowledge base structure.
- **Content Extraction:** parse and extract text from binary formats (PDF, DOCX) and text-based formats (Markdown, TXT).
- **Semantic Search:** perform keyword-based search across multiple files to locate relevant information snippets.
- **Safety:** operates in read-only mode to prevent accidental data modification.

## Getting Started

### Local Installation (Source)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/elkraps/context-bridge-mcp.git
   cd context-bridge
   ```

2. **Install dependencies and build:**
   ```bash
   npm install
   npm run build
   ```

3. **Client Configuration:**
   Add the server configuration to your MCP-compatible client's settings file. For example:

   ```json
   {
     "mcpServers": {
       "context-bridge": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/context-bridge/build/index.js"]
       }
     }
   }
   ```

### NPX Usage

Configure your MCP client to run the server directly via npx:

```json
{
  "mcpServers": {
    "context-bridge": {
      "command": "npx",
      "args": ["-y", "@elkraps/context-bridge"]
    }
  }
}
```

## Usage

To effectively utilize this tool, you must explicitly direct the agent to interface with the local documentation using the **context-bridge** terminology. It is recommended to provide the absolute path to the target documentation directory.

### Interaction Examples

**Correct Prompting:**
> "Please analyze the system architecture described in my documentation folder at `/Users/username/projects/docs` using **context-bridge**. List the available files first."

> "Search for 'authentication protocols' within the local documentation using **context-bridge** and summarize the findings."

> "Read the file `/Users/username/projects/docs/api-spec.pdf` using **context-bridge** and generate a Python client based on it."

### Supported File Types

- **PDF** (`.pdf`): Text extraction only (OCR not supported).
- **Microsoft Word** (`.docx`): Text extraction.
- **Markdown** (`.md`): Native text reading.
- **Plain Text** (`.txt`): Native text reading.
