# webtransport-polyfill ![NPM](https://badgen.net/npm/v/@yomo/webtransport-polyfill) [![MIT](https://badgen.net/npm/license/@yomo/webtransport-polyfill)](https://codecov.io/gh/yomorun/yomo) [![Discord](https://img.shields.io/discord/770589787404369930.svg?label=discord&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/RMtNhx7vds)

The WebTransport Polyfill is a library that allows you to use the WebTransport API in browsers that do not support it natively by fallback to WebSocket.

## 🍱 WebTransport

[WebTransport](https://web.dev/webtransport) is a web API that uses the HTTP/3 protocol as a bidirectional transport.
It's intended for two-way communications between a web client and an HTTP/3 server.
It supports sending data both unreliably via its datagram APIs, and reliably via its streams APIs.

WebTransport enables low-latency, high-throughput communication between clients and servers, which is useful for applications such as SaaS with real-time collaboration feature, gaming, live streaming, video conferencing, and more.

> 
> Try it out
> The best way to experiment with WebTransport is to start up a compatible HTTP/3 server. You can then use this page with a basic JavaScript client to try out client/server communications.
> 
> Additionally, a community-maintained echo server is available at [webtransport.day](https://webtransport.day).
>

*Link:* https://web.dev/webtransport#try-it-out

However, WebTransport is not widely supported by browsers yet: 

<img width="1367" alt="image" src="https://user-images.githubusercontent.com/65603/220812476-a384468a-39ab-4d7f-b9ad-645ec4e3c6fe.png">

*Link:* https://caniuse.com/?search=webtransport

Frontend developers need to spend time and effort between high performance networking and browser compatibility.
This polyfill project allows developers to use the WebTransport API in browsers that do not support it natively by providing a fallback transport mechanism and implementing the WebTransport protocol on top of it.

## 🍜 Get Started

### Installation

You can install the WebTransport Polyfill using npm:

```bash
npm install @yomorun/webtransport-polyfill
```

### Usage

To use the WebTransport Polyfill, you need to import it into your JavaScript code:

```javascript
import { WebTransportPolyfill } from '@yomorun/webtransport-polyfill';
```

Create a connection:

```javascript
const conn = new WebTransportPolyfill('https://api.example.com');
```

Then, use the WebTransport API to send and recieve data:

```javascript
// Send data
const encoder = new TextEncoder();
const message = encoder.encode('Hello, world!');
conn.send(message);

// Receive data
const decoder = new TextDecoder();
const data = await conn.receive();
const message = decoder.decode(data);
console.log(message);
```

### Limitations

The WebTransport Polyfill is not a complete implementation of the WebTransport API, and APIs maybe changed as this project is following [W3C Working Draft](https://www.w3.org/TR/webtransport/)

The polyfill consists of two parts: a client-side JavaScript library that exposes the WebTransport API to your web app, and a server-side backends that handles WebSocket and WebTransport connections at the same time, the source code can be found here: https://github.com/yomorun/presencejs.

To use this polyfill, you need to install and run the server component on your own machine or cloud service. You also need to include the client-side library in your web app and create a WebTransport object with the URL of your server. The polyfill will automatically detect if the browser supports WebTransport natively or not, and use the appropriate transport layer accordingly. You can then use the WebTransport object as you would normally do with the native API.

## 🥑 WebTransport vs WebSocket: A Comparison

WebTransport and WebSocket are both technologies that enable real-time communication between clients and servers over the web. However, there are several key differences between these two technologies.

### Protocol

WebSocket uses a single underlying protocol (WebSocket protocol) for both transport and application layer, 
while WebTransport uses a separate transport protocol (QUIC) and application protocols (e.g., HTTP, WebSocket, and HTTP/3).

### Multiplexing

WebTransport allows for multiplexing of multiple streams over a single connection, which enables better resource utilization and lower latency. 
WebSocket does not support multiplexing by default, but it can be achieved using various techniques such as sub-protocols.

### Security

WebTransport provides built-in security features such as encrypted transport and origin authentication. 
WebSocket does not provide built-in security features, but it can be secured using SSL/TLS.

### Flexibility

WebTransport is designed to be more flexible than WebSocket, as it can support different application protocols, including WebSocket, HTTP/3, and others. 
WebSocket is limited to the WebSocket protocol only.

### Performance

WebTransport is designed to be faster and more efficient than WebSocket, especially in high-latency and low-bandwidth environments. 
This is due to the use of the QUIC transport protocol, which is optimized for performance in these types of environments.

### Conclusion

WebTransport and WebSocket are two web APIs that offer different trade-offs between performance, flexibility, reliability, and compatibility. WebTransport may be a better choice for applications that need low-latency, event-driven communication .
While WebSocket is a well-established technology that has been widely adopted for real-time communication over the web, WebTransport is a newer technology that provides several advantages in terms of flexibility, security, and performance by multiple streams per connection and unreliable datagrams. However, WebTransport is not yet widely supported by browsers and servers, hope this project helped on this.

## 🍻 Contributing

If you would like to contribute to the WebTransport Polyfill, please fork the repository and submit a pull request. You can also submit issues or feature requests on the GitHub page.

## 🥡 License

The WebTransport Polyfill is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.
