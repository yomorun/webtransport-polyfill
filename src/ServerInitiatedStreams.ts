export class ServerInitiatedStreams {
  getReader() {
    throw new Error("websocket do not support server initiated stream")
  }
}
