// implement WebTransportCloseInfo followed https://www.w3.org/TR/webtransport/#dictdef-webtransportcloseinfo 

export interface WebTransportCloseInfo {
  // ref: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.2
  // 0-999

  //   Status codes in the range 0-999 are not used.

  // 1000-2999

  //   Status codes in the range 1000-2999 are reserved for definition by
  //   this protocol, its future revisions, and extensions specified in a
  //   permanent and readily available public specification.

  // 3000-3999

  //   Status codes in the range 3000-3999 are reserved for use by
  //   libraries, frameworks, and applications.  These status codes are
  //   registered directly with IANA.  The interpretation of these codes
  //   is undefined by this protocol.

  // 4000-4999

  //   Status codes in the range 4000-4999 are reserved for private use
  //   and thus can't be registered.  Such codes can be used by prior
  //   agreements between WebSocket applications.  The interpretation of
  //   these codes is undefined by this protocol.
  closeCode: number;
  reason: string;
}