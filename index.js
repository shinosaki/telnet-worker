import { connect } from 'cloudflare:sockets';

const html = `<body>
  <label>URL: <input id="host" value="koukoku.shadan.open.ad.jp" /></label>
  <label>Port: <input id="port" value="23" /></label>
  <button id="button">Connect WS</button>
  <button id="send">Connect Telnet</button>

  <br>
  <label>Message: <input id="message" /></label>
  <button id="messageSend">Send Message</button>

  <pre id="terminal"></pre>

  <script>
    const host = document.getElementById('host');
    const port = document.getElementById('port');
    const button = document.getElementById('button');
    const terminal = document.getElementById('terminal');
    const send = document.getElementById('send');
    const message = document.getElementById('message');
    const messageSend = document.getElementById('messageSend');
    let ws;

    button.addEventListener('click', e => {
      e.preventDefault();

      ws = new WebSocket('ws://' + window.location.host + '/ws?host=' + host.value + '&port=' + port.value);
      ws.addEventListener('message', e => {
        terminal.innerText += e.data;
      });
    });

    send.addEventListener('click', e => {
      ws.send('connect')
    });

    messageSend.addEventListener('click', e => {
      ws.send(message.value)
    });
  </script>
</body>`;

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    if (!url.pathname.startsWith('/ws')) return new Response(html, { headers: { 'content-type': 'text/html' } })

    const host = url.searchParams.get('host') || 'koukoku.shadan.open.ad.jp';
    const port = url.searchParams.get('port') || 23;

    const { client, server } = ws();
    let readable, writable;
    
    server.send(`Host: ${host}\r\n`);
    server.send(`Port: ${port}`);

    server.addEventListener('message', async e => {
      switch (e.data) {
        case 'close':
          server.send('Bye');
          server.close();
          break;

        case 'connect':
          connecting(host, port, c => {
            readable = c.readable;
            writable = c.writable;
          });

          for await (const chunk of readable) {
            server.send(new TextDecoder().decode(chunk));
          };
          // await readable.pipeTo(writable, { preventClose: true });
          // return writer.close();
          
          break;

        default:
          console.log(e.data)
          await writable.getWriter().write(new TextEncoder().encode(e.data + '\r\n'));
          break;
      };
    });

    return new Response(null, { status: 101, webSocket: client });
  }
};

const connecting = (hostname, port, cb) => {
  const { readable, writable, close } = connect({ hostname, port });
  cb({ readable, writable, close });
};

const ws = () => {
  const [client, server] = Object.values(new WebSocketPair());
  server.accept();
  return { client, server };
};
