# telnet-worker
Cloudflare Workers の [TCP Socket(`connect()` API)](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/) と [WebSocket API](https://developers.cloudflare.com/workers/runtime-apis/websockets/) を使った Telnet みたいなもの

## Demo
[`telnet.lain.im`](https://telnet.lain.im/)
1. `URL`と`Port`を入力
2. `Connect WS`をクリックしてWebSocketサーバに接続
3. `Connect Telnet`をクリックしてリモートサーバへ接続
4. `Send Message`をクリックすると、`Message`の内容がリモートサーバへ送信されます

## Deploy
`wrangler deploy --minify ./index.js`

## Author
[shinosaki](https://shinosaki.com/)

## LICENSE
[MIT](./LICENSE)
