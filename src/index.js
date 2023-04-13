"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const servers = [
    { ip: "192.168.1.1", hello: "Hello from server 1!" },
    { ip: "192.168.1.2", hello: "Hello from server 2!" },
    { ip: "192.168.1.3", hello: "Hello from server 3!" },
    { ip: "192.168.1.4", hello: "Hello from server 4!" },
    { ip: "192.168.1.5", hello: "Hello from server 5!" },
];
const connect = (0, lib_1.Fun)((ip) => {
    const server = servers.find((server) => server.ip == ip);
    if (!server || Math.random() < 0.15) {
        return (0, lib_1.none)()();
    }
    return (0, lib_1.unitOption)()(server);
});
const contents = [
    { ip: "192.168.1.1", content: "Content from server 1!" },
    { ip: "192.168.1.2", content: "Content from server 2!" },
    { ip: "192.168.1.3", content: "Content from server 3!" },
    { ip: "192.168.1.4", content: "Content from server 4!" },
    { ip: "192.168.1.5", content: "Content from server 5!" },
];
const get = (0, lib_1.Fun)((serverConnection) => {
    const content = contents.find((content) => content.ip == serverConnection.ip);
    if (!content || Math.random() < 0.25) {
        return (0, lib_1.none)()();
    }
    return (0, lib_1.unitOption)()(content);
});
const fetch = (0, lib_1.Fun)((ip) => connect(ip).bind(get));
const tryConnect = (0, lib_1.Fun)((ip) => {
    const server = servers.find((server) => server.ip == ip);
    if (!server || Math.random() < 0.15) {
        return (0, lib_1.inl)()(`Connection to ${ip} failed`);
    }
    return (0, lib_1.inr)()(server);
});
const tryGet = (0, lib_1.Fun)((serverConnection) => {
    const content = contents.find((content) => content.ip == serverConnection.ip);
    if (!content || Math.random() < 0.25) {
        return (0, lib_1.inl)()(`Failed to download content from ${serverConnection.ip}`);
    }
    return (0, lib_1.inr)()(content);
});
const tryFetch = (0, lib_1.Fun)((ip) => tryConnect(ip).then(tryGet));
//# sourceMappingURL=index.js.map