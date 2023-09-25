// a unit test for WebTransportPolyfill
import { beforeEach, describe, expect, test } from 'bun:test';
import { WebTransportPolyfill } from '../src/index';

// suppress console.log and console.info
beforeEach(() => {
  Object.assign(globalThis, {
    window: {
      addEventListener: () => { },
      console: {
        log: () => { },
        info: () => { },
        debug: () => { },
      },
      WebSocket: class WebSocket {
        constructor() { }
        addEventListener() { }
        close() { }
      },
    },
  })
});

describe('test .ctor', () => {
  test('should throw SyntaxError when url is absence', () => {
    expect(() => {
      new WebTransportPolyfill(process.env.URL as string)
    }).toThrow(SyntaxError)
  });

  test('should throw SyntaxError when url is not valid', () => {
    expect(() => {
      new WebTransportPolyfill(process.env.URL as string)
    }).toThrow(SyntaxError)

    expect(() => {
      new WebTransportPolyfill("oooo")
    }).toThrow(SyntaxError)
  });

  test('should throw SyntaxError when url is not https', () => {
    // const err = new SyntaxError("Invalid protocol");
    expect(() => {
      new WebTransportPolyfill("wss://lo.yomo.dev:8443")
    }).toThrow(SyntaxError)
  });

  test('should throw SyntaxError when url has fragement', () => {
    // const err = new SyntaxError("Fragment is not permitted");
    expect(() => {
      new WebTransportPolyfill("https://lo.yomo.dev:8443/#abced")
    }).toThrow(SyntaxError)
  });

  test('should work', () => {
    new WebTransportPolyfill("https://lo.yomo.dev:8443/v1");
  });
})

describe('test close()', () => {
  test('should close the connection', () => {
    const wt = new WebTransportPolyfill("https://lo.yomo.dev:8443");
    wt.close();
  })

  test('should close the connection with code and reason', () => {
    const wt = new WebTransportPolyfill("https://lo.yomo.dev:8443");
    wt.close({ closeCode: 4321, reason: "test" });
  });
})

describe('test server initiated stream', () => {
  test('incomingBidirectionalStreams', async () => {
    const wt = new WebTransportPolyfill("https://lo.yomo.dev:8443");
    const rs = wt.incomingBidirectionalStreams;
    const err = new Error("websocket do not support server initiated stream")
    expect(() => {
      rs.getReader()
    }).toThrow()
  })

  test('incomingUniidirectionalStreams', async () => {
    const wt = new WebTransportPolyfill("https://lo.yomo.dev:8443");
    const rs = wt.incomingUnidirectionalStreams;
    const err = new Error("websocket do not support server initiated stream")
    expect(() => {
      rs.getReader()
    }).toThrow()
  })
})
