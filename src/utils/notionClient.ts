import { Client as NotionClient } from "@notionhq/client";

export default new NotionClient({
  auth: process.env.NOTION_API_KEY!,
});