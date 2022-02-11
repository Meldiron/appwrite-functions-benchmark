const server = Deno.listen({ port: 7777 });
console.log("HTTP server started on :7777");

let totalExecutions = 0;

for await (const conn of server) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    totalExecutions++;
    console.log(Date.now(), totalExecutions);
    requestEvent.respondWith(
      new Response('OK', {
        status: 200,
      }),
    );
  }
}