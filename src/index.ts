// import "regenerator-runtime/runtime.js";
import { BidirectionalStream } from './BidirectionalStream';
import { UnidirectionalStream } from './UnidirectionalStream'
import { Datagrams } from './Datagrams';
import { WebTransportCloseInfo } from './CloseInfo';
import { ServerInitiatedStreams } from './ServerInitiatedStreams';
// import { ReceiveStream } from './ReceiveStream';
// import { SendStream } from './SendStream';

declare global {
  interface Window {
    WebTransport: any;
  }
}

// https://www.w3.org/TR/webtransport/#web-transport
export class WebTransportPolyfill {
  public closed: Promise<unknown>;
  public ready: Promise<unknown>;
  public close: (closeInfo?: WebTransportCloseInfo) => void;
  datagrams: Datagrams | null = null;
  public incomingBidirectionalStreams: ServerInitiatedStreams = new ServerInitiatedStreams()
  public incomingUnidirectionalStreams: ServerInitiatedStreams = new ServerInitiatedStreams()
  #ws: WebSocket | null = null;
  #connErr: any;

  // https://www.w3.org/TR/webtransport/#webtransport-constructor
  // constructor(USVString url, optional WebTransportOptions options = {});
  constructor(_url: string) {
    let url: URL
    try {
      url = new URL(_url);
      if (url.protocol !== 'https:') {
        // 5.2.3 If parsedURL scheme is not https, throw a SyntaxError exception.
        // be careful, do not allow `wss` protocol here, this prevents code reuseable when upgrade to webtransport. otherwise, developer need to change `wss` to `https` when upgrade from websocket to webtransport.
        throw new SyntaxError("Invalid protocol")
      }
      if (url.hash !== '') {
        // 5.2.4 If parsedURL fragment is not null, throw a SyntaxError exception.
        throw new SyntaxError("Fragment is not permitted")
      }
    } catch (err) {
      // 5.2.2 If parsedURL is a failure, throw a SyntaxError exception
      throw new SyntaxError(err.message)
    }
    // change `https` to `wss`
    url.protocol = 'wss';
    let parsedUrl = url.toString();

    this.#ws = new WebSocket(parsedUrl);
    this.#ws.binaryType = 'arraybuffer';

    console.info("%cWebTransport polyfilled", "color: white; background-color: green");

    // readonly attribute Promise<WebTransportCloseInfo> closed;
    this.closed = new Promise((resolve, reject) => {
      if (!this.#ws) {
        return reject(Error('WebTransport is closed'));
      }
      this.#ws.addEventListener('close', (ce) => {
        resolve(ce)
      });
    });

    // readonly attribute Promise<undefined> ready;
    this.ready = new Promise((resolve, reject) => {
      if (!this.#ws) {
        return reject(Error('WebTransport is closed'));
      }

      this.#ws.addEventListener('open', () => {
        resolve(null);
      });
      this.#ws.addEventListener('error', (err) => {
        console.log(err, 'error')
        this.#connErr = err;
        reject(err);
      });

      this.datagrams = new Datagrams(this.#ws);
    });

    // https://www.w3.org/TR/webtransport/#dom-webtransport-close
    this.close = (closeInfo?: WebTransportCloseInfo) => {
      if (!this.#ws) {
        return;
      }
      // in case of close code is not in range 3000-4999, set it to 4000
      // ref: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.2
      if (closeInfo) {
        if (closeInfo.closeCode < 3000 || closeInfo.closeCode > 4999) {
          closeInfo.closeCode = 4000
        }
      }
      this.#ws.close(closeInfo?.closeCode, closeInfo?.reason);
    }
  }

  // Promise<WebTransportBidirectionalStream> createBidirectionalStream(optional WebTransportSendStreamOptions options = {});
  createBidirectionalStream(): Promise<BidirectionalStream> {
    return new Promise((resolve, reject) => {
      if (!this.#ws) return reject(Error('WebTransport is closed'));
      resolve(new BidirectionalStream(this.#ws));
    });
  }

  // Promise<WebTransportUniidirectionalStream> createBidirectionalStream(optional WebTransportSendStreamOptions options = {});
  createUnidirectionalStream(): Promise<UnidirectionalStream> {
    return new Promise((resolve, reject) => {
      if (!this.#ws) return reject(Error('WebTransport is closed'));
      resolve(new UnidirectionalStream(this.#ws));
    });
  }

  // didn't exists in spec

  // receiveBidrectionalStreams(): BidirectionalStream {
  //   if (!this.#ws) throw Error('WebTransport is closed');
  //   return new BidirectionalStream(this.#ws);
  // }
  // createSendStream(): SendStream {
  //   if (!this.#ws) throw Error('WebTransport is closed');
  //   return new SendStream(this.#ws);
  // }
  // receiveStream(): ReceiveStream {
  //   if (!this.#ws) throw Error('WebTransport is closed');
  //   return new ReceiveStream(this.#ws);
  // }
}

if (typeof window !== 'undefined') {
  if (typeof window.WebTransport === 'undefined') {
    window.WebTransport = WebTransportPolyfill;
  }
}

export default WebTransportPolyfill;
