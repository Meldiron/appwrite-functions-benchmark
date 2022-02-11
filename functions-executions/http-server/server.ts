import { serve } from 'https://deno.land/std/http/server.ts';

const s = serve({ port: 7777 })
console.log(`🦕 Deno server running at http://localhost:8000/ 🦕`);
for await (const req of s) {
  req.respond({ body: 'Hello from your first Deno server' });
}