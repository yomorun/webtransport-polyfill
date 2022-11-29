export class SendStream {
  constructor(ws: WebSocket) {
    return new Proxy(this, {
      get(_, prop) {
        if (prop === 'writable') {
          return new WritableStream<Uint8Array>({
            start(_) {},
            write(chunk) {
              return new Promise((resolve, reject) => {
                try {
                  ws.send(chunk);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              });
            },
            close() {},
            abort(_) {},
          });
        }
        return undefined;
      },
    });
  }
}
