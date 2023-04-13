"use strict";
// type Fun<T1, T2> = {
//   (_: T1): T2;
//   then: <T3>(g: Fun<T2, T3>) => Fun<T1, T3>;
//   repeat: (times: number) => Fun<T1, T1>;
//   repeatUntil: (condition: Fun<T1, boolean>) => Fun<T1, T1>;
// };
// const Fun = function <T1, T2>(f: (_: T1) => T2) {
//   const wrapper = f as Fun<T1, T2>;
//   wrapper.then = function <T3>(this: Fun<T1, T1>, g: Fun<T2, T3>) {
//     return Fun((x) => g(f(x)));
//   };
//   wrapper.repeat = function (this: Fun<T1, T1>, times: number): Fun<T1, T1> {
//     return times > 0 ? this.then(this.repeat(times - 1)) : Fun((x) => x);
//   };
//   wrapper.repeatUntil = function (
//     this: Fun<T1, T1>,
//     condition: Fun<T1, boolean>
//   ): Fun<T1, T1> {
//     return Fun((x) =>
//       condition(x) ? x : this.then(this.repeatUntil(condition))(x)
//     );
//   };
//   return wrapper;
// };
// const incr = Fun<number, number>((x) => x + 1);
// type Countainer<T1> = { content: T1; counter: number };
// const Countainer = <T1>(content: T1): Countainer<T1> => ({
//   content: content,
//   counter: 0,
// });
// const incrCountainer = <T>() =>
//   Fun<Countainer<T>, Countainer<T>>((c) => ({ ...c, counter: c.counter + 1 }));
// const mapCountainer = <T1, T2>(
//   f: Fun<T1, T2>
// ): Fun<Countainer<T1>, Countainer<T2>> =>
//   Fun((c) => ({ ...c, content: f(c.content) }));
// type List<T1> =
//   | {
//       kind: "Cons";
//       head: T1;
//       tail: List<T1>;
//     }
//   | {
//       kind: "Empty";
//     };
// const List = <T>([x, ...xs]: Array<T>): List<T> =>
//   x === undefined && xs.length === 0
//     ? { kind: "Empty" }
//     : { kind: "Cons", head: x, tail: List(xs) };
// const mapList = <T1, T2>(f: Fun<T1, T2>): Fun<List<T1>, List<T2>> =>
//   Fun((l) =>
//     l.kind === "Empty"
//       ? { kind: "Empty" }
//       : { kind: "Cons", head: f(l.head), tail: mapList(f)(l.tail) }
//   );
// type ErrorOr<T> =
//   | {
//       kind: "Error";
//       message: string;
//     }
//   | {
//       kind: "Result";
//       value: T;
//     };
// const mapErrorOr = <a, b>(f: Fun<a, b>): Fun<ErrorOr<a>, ErrorOr<b>> =>
//   Fun((e) => (e.kind == "Error" ? e : { ...e, value: f(e.value) }));
// type ListErrorOr<T> = List<ErrorOr<T>>;
// const mapListErrorOr = <T1, T2>(
//   f: Fun<T1, T2>
// ): Fun<ListErrorOr<T1>, ListErrorOr<T2>> => mapList(mapErrorOr(f));
// const concat = <T>(l1: List<T>, l2: List<T>): List<T> => {
//   if (l1.kind == "Empty") {
//     return l2;
//   }
//   var concatTail = concat(l1.tail, l2);
//   return {
//     kind: "Cons",
//     head: l1.head,
//     tail: concatTail,
//   };
// };
// const unitList = <T>(x: T): List<T> => ({
//   kind: "Cons",
//   head: x,
//   tail: List<T>([]),
// });
// const joinList = <T>(l: List<List<T>>): List<T> => {
//   if (l.kind == "Empty") {
//     return List<T>([]);
//   }
//   return concat(l.head, joinList(l.tail));
// };
//# sourceMappingURL=week-4-b.js.map