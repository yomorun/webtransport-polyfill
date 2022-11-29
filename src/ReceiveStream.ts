export class ReceiveStream {
  constructor(ws: WebSocket) {
    return new ReadableStream({
      start(controller) {
        let timer: any | null = null;
        const cb = (ev: any) => {
          if (timer) {
            clearTimeout(timer);
          }
          controller.enqueue(
            new ReadableStream({
              start(controller) {
                controller.enqueue(ev.data);
              },
            })
          );
          timer = setTimeout(
            () => ws.removeEventListener('message', cb),
            1_000
          );
        };
        ws.addEventListener('message', cb);
      },
      cancel() {},
    });
  }
}
