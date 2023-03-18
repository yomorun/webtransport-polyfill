// a unit test for WebTransportPolyfill
import * as assert from 'assert';
import { WebTransportPolyfill } from '../src/index';

describe('WebTransportPoly', () => {
  it('should throw SyntaxError', () => {
    const err = new SyntaxError("url is not valid");
    assert.throws(() => { new WebTransportPolyfill("oooo") }, err);
  });
})
