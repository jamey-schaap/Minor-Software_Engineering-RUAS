import {
  Either,
  Fun,
  Option,
  inl,
  inr,
  none,
  unitOption,
} from "./lib";

interface ServerConnection {
  ip: string;
  hello: string;
}

const servers: ServerConnection[] = [
  { ip: "192.168.1.1", hello: "Hello from server 1!" },
  { ip: "192.168.1.2", hello: "Hello from server 2!" },
  { ip: "192.168.1.3", hello: "Hello from server 3!" },
  { ip: "192.168.1.4", hello: "Hello from server 4!" },
  { ip: "192.168.1.5", hello: "Hello from server 5!" },
];

const connect: Fun<string, Option<ServerConnection>> = Fun((ip) => {
  const server = servers.find((server) => server.ip == ip);
  if (!server || Math.random() < 0.15) {
    return none<ServerConnection>()();
  }
  return unitOption<ServerConnection>()(server);
});

interface ServerContent {
  ip: string;
  content: string;
}

const contents: ServerContent[] = [
  { ip: "192.168.1.1", content: "Content from server 1!" },
  { ip: "192.168.1.2", content: "Content from server 2!" },
  { ip: "192.168.1.3", content: "Content from server 3!" },
  { ip: "192.168.1.4", content: "Content from server 4!" },
  { ip: "192.168.1.5", content: "Content from server 5!" },
];

const get: Fun<ServerConnection, Option<ServerContent>> = Fun(
  (serverConnection) => {
    const content = contents.find(
      (content) => content.ip == serverConnection.ip
    );
    if (!content || Math.random() < 0.25) {
      return none<ServerContent>()();
    }

    return unitOption<ServerContent>()(content);
  }
);

const fetch = Fun<string, Option<ServerContent>>((ip) => connect(ip).bind(get));

type Exception<a> = Either<string, a>;

const tryConnect = Fun<string, Exception<ServerConnection>>((ip) => {
  const server = servers.find((server) => server.ip == ip);
  if (!server || Math.random() < 0.15) {
    return inl<string, ServerConnection>()(`Connection to ${ip} failed`);
  }

  return inr<string, ServerConnection>()(server);
});

const tryGet = Fun<ServerConnection, Exception<ServerContent>>(
  (serverConnection) => {
    const content = contents.find(
      (content) => content.ip == serverConnection.ip
    );
    if (!content || Math.random() < 0.25) {
      return inl<string, ServerContent>()(
        `Failed to download content from ${serverConnection.ip}`
      );
    }

    return inr<string, ServerContent>()(content);
  }
);

const tryFetch = Fun<string, Exception<ServerContent>>((ip) =>
  tryConnect(ip).then(tryGet)
);
