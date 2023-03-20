export class BidirectionalStream {
  writable: WritableStream<Uint8Array> | null = null;
  readable: ReadableStream<Uint8Array> | null = null;
  constructor(ws: WebSocket) {
    return new Proxy(this, {
      get(_, prop) {
        if (prop === 'writable') {
          return new WritableStream<Uint8Array>({
            start(_) { },
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
            close() { },
            abort(_) { },
          });
        } else if (prop === 'readable') {
          return new ReadableStream({
            start(controller) {
              let timer: any | null = null;
              const cb = (ev: any) => {
                if (timer) {
                  clearTimeout(timer);
                }
                controller.enqueue(ev.data);
                timer = setTimeout(
                  () => ws.removeEventListener('message', cb),
                  1_000
                );
              };
              ws.addEventListener('message', cb);
            },
            cancel() { },
          });
        }
        return undefined;
      },
    });
  }
}
