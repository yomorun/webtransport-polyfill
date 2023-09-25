export class Datagrams {
  writable: WritableStream<Uint8Array> | null = null;
  readable: ReadableStream<Uint8Array> | null = null;
  constructor(ws: WebSocket) {
    return new Proxy(this, {
      get(_, prop) {
        if (prop === "writable") {
          return new WritableStream<Uint8Array>({
            start(_) { },
            write(chunk) {
              return new Promise((resolve, reject) => {
                try {
                  if (ws.readyState !== WebSocket.OPEN) {
                    console.debug("Datagram.send(): ws.readyState:", ws.readyState);
                    return
                  }
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
        } else if (prop === "readable") {
          return new ReadableStream({
            start(controller) {
              let timer: any | null = null;
              const cb = (ev: any) => {
                if (timer) {
                  clearTimeout(timer);
                }
                controller.enqueue(ev.data);
                // controller.close();
                // ws.removeEventListener('message', cb);
              };
              ws.addEventListener("message", cb);
            },
            cancel() { },
          });
        }
        return undefined;
      },
    });
  }
}
