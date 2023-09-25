/// <reference lib="dom" />

import { BidirectionalStream } from "./BidirectionalStream";
import { WebTransportCloseInfo } from "./CloseInfo";
import { Datagrams } from "./Datagrams";
import { ServerInitiatedStreams } from "./ServerInitiatedStreams";
import { UnidirectionalStream } from "./UnidirectionalStream";

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
  public incomingBidirectionalStreams: ServerInitiatedStreams =
    new ServerInitiatedStreams();
  public incomingUnidirectionalStreams: ServerInitiatedStreams =
    new ServerInitiatedStreams();
  #ws: WebSocket | null = null;
  #url: string

  // https://www.w3.org/TR/webtransport/#webtransport-constructor
  // constructor(USVString url, optional WebTransportOptions options = {});
  constructor(_url: string, options?: any) {
    let url: URL;
    try {
      url = new URL(_url);
      if (url.protocol !== "https:") {
        // 5.2.3 If parsedURL scheme is not https, throw a SyntaxError exception.
        // be careful, do not allow `wss` protocol here, this prevents code reuseable when upgrade to webtransport. otherwise, developer need to change `wss` to `https` when upgrade from websocket to webtransport.
        throw new SyntaxError("Invalid protocol");
      }
      if (url.hash !== "") {
        // 5.2.4 If parsedURL fragment is not null, throw a SyntaxError exception.
        throw new SyntaxError("Fragment is not permitted");
      }
    } catch (err) {
      // 5.2.2 If parsedURL is a failure, throw a SyntaxError exception
      throw new SyntaxError(err.message);
    }

    // change `https` to `wss`
    url.protocol = "wss";
    // let parsedUrl = url.toString();

    this.#url = url.toString();
    this.#connect();
    this.#init();
  }

  #connect() {
    const ws = new WebSocket(this.#url);
    ws.binaryType = "arraybuffer";
    this.#ws = ws;
  }

  #init() {
    console.info(
      "%c%s",
      "color: white; background-color: green",
      "WebTransport polyfilled for " + this.#url
    );

    // https://www.w3.org/TR/webtransport/#dom-webtransport-close
    this.close = (closeInfo?: WebTransportCloseInfo) => {
      console.debug("[polyfill] close()", closeInfo)
      if (this.#ws && this.#ws.readyState <= WebSocket.OPEN) {
        this.#ws.close(closeInfo?.closeCode || 1000, closeInfo?.reason || 'user close');
      }
    };

    // readonly attribute Promise<WebTransportCloseInfo> closed;
    this.closed = new Promise((resolve, reject) => {
      if (!this.#ws) {
        return reject(Error("WebTransport is closed"));
      }
      this.#ws.addEventListener("close", (closeEvent) => {
        console.log("[polyfill] closed", `code=${closeEvent.code}, reason=${closeEvent.reason}`)
        // code < 4000 means it's not a normal close
        if (closeEvent && (closeEvent.code > 1000 && closeEvent.code < 4000)) {
          return reject(closeEvent)
        }
        resolve(closeEvent);
      });
    });

    // readonly attribute Promise<undefined> ready;
    this.ready = new Promise((resolve, reject) => {
      if (!this.#ws) {
        return reject(Error("WebTransport is closed"));
      }

      this.#ws.addEventListener("open", () => {
        resolve(null);
      });

      this.#ws.addEventListener("error", (evt) => {
        // console.debug("#ws.addEventListener(error)", { evt });
        // console.debug("#ws.addEventListener(error)", evt.target);
        // TODO: this `err` is a Event, not Error
        // this.#connErr = evt;
        reject(evt);
      });

      this.datagrams = new Datagrams(this.#ws);
    });
  }

  // Promise<WebTransportBidirectionalStream> createBidirectionalStream(optional WebTransportSendStreamOptions options = {});
  createBidirectionalStream(): Promise<BidirectionalStream> {
    return new Promise((resolve, reject) => {
      if (!this.#ws) return reject(Error("WebTransport is closed"));
      resolve(new BidirectionalStream(this.#ws));
    });
  }

  // Promise<WebTransportUnidirectionalStream> createBidirectionalStream(optional WebTransportSendStreamOptions options = {});
  createUnidirectionalStream(): Promise<UnidirectionalStream> {
    return new Promise((resolve, reject) => {
      if (!this.#ws) return reject(Error("WebTransport is closed"));
      resolve(new UnidirectionalStream(this.#ws));
    });
  }
}

if (typeof window !== "undefined") {
  if (typeof window.WebTransport === "undefined") {
    window.WebTransport = WebTransportPolyfill;
    console.log("[webtransport-polyfill]: WebTransport is polyfilled")
  }
}

export default WebTransportPolyfill;
