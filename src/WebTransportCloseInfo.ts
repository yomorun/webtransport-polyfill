// implement WebTransportCloseInfo followed https://www.w3.org/TR/webtransport/#dictdef-webtransportcloseinfo 

export interface WebTransportCloseInfo {
  closeCode: number;
  reason: string;
}