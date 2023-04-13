"use strict";
// type Fun<T1, T2> = {
//     (_: T1): T2;
//     then: <T3>(g: Fun<T2, T3>) => Fun<T1, T3>;
//     repeat: (times: number) => Fun<T1, T1>;
//     repeatUntil: (condition: Fun<T1, boolean>) => Fun<T1, T1>;
//   };
//   const Fun = function <T1, T2>(f: (_: T1) => T2): Fun<T1, T2> {
//     const wrapper = f as Fun<T1, T2>;
//     wrapper.then = function <T3>(this: Fun<T1, T2>, g: Fun<T2, T3>): Fun<T1, T3> {
//       return Fun((x) => g(this(x)));
//     };
//     wrapper.repeat = function (this: Fun<T1, T1>, times: number): Fun<T1, T1> {
//       return times > 0 ? this.then(this.repeat(times - 1)) : Fun((x) => x);
//     };
//     wrapper.repeatUntil = function (
//       this: Fun<T1, T1>,
//       condition: Fun<T1, boolean>
//     ): Fun<T1, T1> {
//       return Fun((x) =>
//         condition(x) ? x : this.then(this.repeatUntil(condition))(x)
//       );
//     };
//     return wrapper;
//   };
//   type Option<T> =
//     | {
//         kind: "none";
//       }
//     | {
//         kind: "some";
//         value: T;
//       };
//   const none = <T>(): Fun<null, Option<T>> => Fun((_) => ({ kind: "none" }));
//   const some = <T>(): Fun<T, Option<T>> =>
//     Fun((v) => ({ kind: "some", value: v }));
//   const mapOption = <T1, T2>(f: Fun<T1, T2>): Fun<Option<T1>, Option<T2>> =>
//     Fun((o) =>
//       o.kind == "none" ? none<T2>()(null) : f.then(some<T2>())(o.value)
//     );
//   const unitOption = <T>(): Fun<T, Option<T>> => some<T>();
//   const joinOption = <T>(): Fun<Option<Option<T>>, Option<T>> =>
//     Fun((o) => (o.kind == "none" ? none<T>()(null) : o.value));
//   const bindOption = <T1, T2>(
//     opt: Option<T1>,
//     f: Fun<T1, Option<T2>>
//   ): Option<T2> => mapOption<T1, Option<T2>>(f).then(joinOption())(opt);
//   type Either<L, R> =
//     | {
//         kind: "left";
//         value: L;
//       }
//     | {
//         kind: "right";
//         value: R;
//       };
//   // injection left
//   const inl = <L, R>(): Fun<L, Either<L, R>> =>
//     Fun((v) => ({ kind: "left", value: v }));
//   // injection right
//   const inr = <L, R>(): Fun<R, Either<L, R>> =>
//     Fun((v) => ({ kind: "right", value: v }));
//   const unitEither = <L, R>(): Fun<L, Either<L, R>> => inl<L, R>();
//   // Either is a bifunctor
//   const mapEither = <L1, R1, L2, R2>(
//     f: Fun<L1, L2>,
//     g: Fun<R1, R2>
//   ): Fun<Either<L1, R1>, Either<L2, R2>> =>
//     Fun((e) =>
//       e.kind == "left"
//         ? f.then(inl<L2, R2>())(e.value)
//         : g.then(inr<L2, R2>())(e.value)
//     );
//   const joinEither = <L, R>(): Fun<Either<L, Either<L, R>>, Either<L, R>> =>
//     Fun((nestedvalue) =>
//       nestedvalue.kind == "left" ? nestedvalue : nestedvalue.value
//     );
//   // type List<T> =
//   //   | {
//   //       kind: "Cons";
//   //       head: T;
//   //       tail: List<T>;
//   //     }
//   //   | {
//   //       kind: "Empty";
//   //     };
//   // const List = <T>([x, ...xs]: Array<T>): List<T> =>
//   //   x === undefined && xs.length === 0
//   //     ? { kind: "Empty" }
//   //     : { kind: "Cons", head: x, tail: List(xs) };
//   // const mapList = <T1, T2>(f: Fun<T1, T2>): Fun<List<T1>, List<T2>> =>
//   //   Fun((l) =>
//   //     l.kind === "Empty"
//   //       ? { kind: "Empty" }
//   //       : { kind: "Cons", head: f(l.head), tail: mapList(f)(l.tail) }
//   //   );
//   // const unitList = <T>(v: T): List<T> => ({
//   //   kind: "Cons",
//   //   head: v,
//   //   tail: List([]),
//   // });
//   // const concatList = <T>(l1: List<T>, l2: List<T>): List<T> =>
//   //   l1.kind == "Empty"
//   //     ? l2
//   //     : { kind: "Cons", head: l1.head, tail: concatList(l1.tail, l2) };
//   // // const zeroList = <T>(): List<T> => List([]);
//   // const zeroList = <T>(): Fun<null, List<T>> => Fun((_) => List<T>([]));
//   // // const joinList = <T>(l: List<List<T>>): List<T> =>
//   // //   l.kind == "Empty"
//   // //     ? List<T>([])
//   // //     : concatList(l.head, joinList(l.tail));
//   // const joinList = <T>(): Fun<List<List<T>>, List<T>> =>
//   //   Fun((l) =>
//   //     l.kind == "Empty" ? List<T>([]) : concatList(l.head, joinList<T>()(l.tail))
//   //   );
//   type ServerConnection = {
//     ip: string;
//     hello: string;
//   };
//   const ServerConnection = (ip: string): ServerConnection => ({
//     ip: ip,
//     hello: `Hello ${ip}`,
//   });
//   type Exception<T> = Either<string, T>;
//   const exceptionInl = <T>(): Fun<string, Exception<T>> =>
//     Fun((value) => ({ kind: "left", value: value }));
//   const exceptionInr = <T>(): Fun<T, Exception<T>> =>
//     Fun((value) => ({ kind: "right", value: value }));
//   const connect = (ip: string): Exception<ServerConnection> => {
//     if (
//       /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
//         ip
//       )
//     ) {
//       return exceptionInl<ServerConnection>()("Invalid IP-Adress");
//     }
//     return Math.random() <= 0.15
//       ? exceptionInl<ServerConnection>()("Connection timeout")
//       : exceptionInr<ServerConnection>()(ServerConnection(ip));
//   };
//   type ServerContent = {
//     ip: string;
//     content: string;
//   };
//   const ServerContent = (ip: string): ServerContent => ({
//     ip: ip,
//     content: `${Math.random()}`,
//   });
//   const get = (ip: string): Exception<ServerContent> => {
//     if (Math.random() <= 0.15) {
//       return exceptionInl<ServerContent>()("Connection timeout");
//     }
//     if (Math.random() <= 0.15) {
//       return exceptionInl<ServerContent>()("Server unavailable");
//     }
//     return exceptionInr<ServerContent>()(ServerContent(ip));
//   };
//   const fetch = (ip: string): Option<ServerContent> => {
//     let connection = connect(ip);
//   };
//# sourceMappingURL=week-5-b.js.map