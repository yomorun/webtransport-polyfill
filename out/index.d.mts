declare var src_default: typeof WebTransportPolyfill;
export class WebTransportPolyfill {
    constructor(_url: any, options: any);
    closed: any;
    ready: any;
    close: any;
    datagrams: any;
    incomingBidirectionalStreams: ServerInitiatedStreams;
    incomingUnidirectionalStreams: ServerInitiatedStreams;
    createBidirectionalStream(): any;
    createUnidirectionalStream(): any;
    #private;
}
declare class ServerInitiatedStreams {
    getReader(): void;
}
export { src_default as default };
//# sourceMappingURL=index.d.mts.map