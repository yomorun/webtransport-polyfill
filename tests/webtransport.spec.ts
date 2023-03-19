// a unit test for WebTransportPolyfill
import * as assert from 'assert';
import { WebTransportPolyfill } from '../src/index';

describe('.ctor', () => {

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

describe('close()', () => {
  it('should close the connection', () => {
    Object.assign(globalThis, {
      WebSocket: class WebSocket {
        constructor(url: string) {
          assert.strictEqual(url, "wss://api.example.com/");
        }
        close(a, b) {
          assert.strictEqual(a, 4321);
          assert.strictEqual(b, "test");
        }
      }
    });
    const wt = new WebTransportPolyfill("https://api.example.com");
    wt.close({ closeCode: 4321, reason: "test" });
  });
})
