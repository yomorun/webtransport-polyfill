// a unit test for WebTransportPolyfill
import * as assert from 'assert';
import { WebTransportPolyfill } from '../src/index';

describe('WebTransportPoly .ctor', () => {
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
})
