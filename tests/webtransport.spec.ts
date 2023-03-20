// a unit test for WebTransportPolyfill
import * as assert from 'assert';
import { WebTransportPolyfill } from '../src/index';

// suppress console.log and console.info
beforeEach(() => {
  Object.assign(globalThis, {
    console: {
      log: () => { },
      info: () => { }
    }
  })
});

describe('test .ctor', () => {
  it('should throw SyntaxError when url is not valid', () => {
    const err = new SyntaxError("Invalid URL");
    assert.throws(() => { new WebTransportPolyfill("oooo") }, err);
  });

  it('should throw SyntaxError when url is not https', () => {
    const err = new SyntaxError("Invalid protocol");
    assert.throws(() => { new WebTransportPolyfill("http://api.example.com") }, err);
  });

  it('should throw SyntaxError when url has fragement', () => {
    const err = new SyntaxError("Fragment is not permitted");
    assert.throws(() => { new WebTransportPolyfill("https://api.example.com/#abced") }, err);
  });

  it('should work', () => {
    Object.assign(globalThis, {
      WebSocket: class WebSocket {
        constructor(url: string) {
          assert.strictEqual(url, "wss://api.example.com/");
        }
      }
    });
    new WebTransportPolyfill("https://api.example.com");
  });
})

describe('test close()', () => {
  it('should close the connection', () => {
    Object.assign(globalThis, {
      WebSocket: class WebSocket {
        constructor(url: string) {
          assert.strictEqual(url, "wss://api.example.com/");
        }
        close(a: number, b: String) {
          assert.strictEqual(a, undefined);
          assert.strictEqual(b, undefined);
        }
      }
    });
    const wt = new WebTransportPolyfill("https://api.example.com");
    wt.close();
  })

  it('should close the connection with code and reason', () => {
    Object.assign(globalThis, {
      WebSocket: class WebSocket {
        constructor(url: string) {
          assert.strictEqual(url, "wss://api.example.com/");
        }
        close(a: number, b: String) {
          assert.strictEqual(a, 4321);
          assert.strictEqual(b, "test");
        }
      }
    });
    const wt = new WebTransportPolyfill("https://api.example.com");
    wt.close({ closeCode: 4321, reason: "test" });
  });
})

describe('test server initiated stream', () => {
  beforeEach(() => {
    Object.assign(globalThis, {
      WebSocket: class WebSocket {
        constructor(url: string) {
          console.log("> connect to:", url)
        }
        addEventListener() { }
      }
    });
  })

  it('incomingBidirectionalStreams', async () => {
    const wt = new WebTransportPolyfill("https://api.example.com");
    const rs = wt.incomingBidirectionalStreams;
    const err = new Error("websocket do not support server initiated stream")
    assert.throws(() => { rs.getReader() }, err)
  })

  it('incomingUniidirectionalStreams', async () => {
    const wt = new WebTransportPolyfill("https://api.example.com");
    const rs = wt.incomingUnidirectionalStreams;
    const err = new Error("websocket do not support server initiated stream")
    assert.throws(() => { rs.getReader() }, err)
  })
})
