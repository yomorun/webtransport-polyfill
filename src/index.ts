// import "regenerator-runtime/runtime.js";
import { BidirectionalStream } from './BidirectionalStream';
import { DataGrams } from './Datagrams';
import { ReceiveStream } from './ReceiveStream';
import { SendStream } from './SendStream';

declare global {
  interface Window {
    WebTransport: any;
  }
}

export class WebTransportPolyfill {
  public closed: Promise<unknown>;
  public ready: Promise<unknown>;
  #ws: WebSocket | null = null;
  #connErr: any;
  datagrams: DataGrams | null = null;
  constructor(public url: string) {
    this.closed = new Promise((resolve, reject) => {
      resolve(null);
      reject();
    });
    this.ready = new Promise((resolve, reject) => {
      url = url.replace(/^http/, 'ws');
      this.#ws = new WebSocket(url);
      this.#ws.binaryType = 'arraybuffer';
      this.#ws.addEventListener('open', () => {
        resolve(null);
      }),
        this.#ws.addEventListener('error', (err) => {
          this.#connErr = err;
          reject(err);
        }),
        this.#ws.addEventListener('close', () => {
          this.closed = new Promise((resolve, reject) => {
            resolve(null);
            reject();
          });
          reject(this.#connErr);
        }),
        (this.datagrams = new DataGrams(this.#ws));
    });
  }
  createSendStream(): SendStream {
    if (!this.#ws) throw Error('WebTransport is closed');
    return new SendStream(this.#ws);
  }
  receiveStream(): ReceiveStream {
    if (!this.#ws) throw Error('WebTransport is closed');
    return new ReceiveStream(this.#ws);
  }
  createBidirectionalStream(): Promise<BidirectionalStream> {
    return new Promise((resolve, reject) => {
      if (!this.#ws) return reject(Error('WebTransport is closed'));
      resolve(new BidirectionalStream(this.#ws));
    });
  }
  receiveBidrectionalStreams(): BidirectionalStream {
    if (!this.#ws) throw Error('WebTransport is closed');
    return new BidirectionalStream(this.#ws);
  }
}

if (typeof window !== 'undefined') {
  if (typeof window.WebTransport === 'undefined') {
    window.WebTransport = WebTransportPolyfill;
  }
}

export default WebTransportPolyfill;
