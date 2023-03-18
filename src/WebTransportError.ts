// ref: https://www.w3.org/TR/webtransport/#web-transport-error
export interface WebTransportErrorInit {
  streamErrorCode?: number;
  message: string;
}

export class WebTransportError extends Error {
  source: 'stream' | 'session';
  streamErrorCode?: number;

  constructor(init?: WebTransportErrorInit) {
    super();
    this.source = "stream";
    this.streamErrorCode = init?.streamErrorCode;
    this.message = init?.message || '';
  }
}