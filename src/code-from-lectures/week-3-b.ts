// type Fun<A, B> = {
//   (_: A): B;
//   then: <C>(g: Fun<B, C>) => Fun<A, C>;
// };

// const Fun = function <A, B>(f: (_: A) => B): Fun<A, B> {
//   const tmp = f as Fun<A, B>;

//   tmp.then = function <C>(this: Fun<A, B>, g: Fun<B, C>) {
//     return Fun((x) => g(f(x)));
//   };

//   return tmp;
// };

// const double = Fun<number, number>((x) => x * 2);

// type Countainer<Content> = { content: Content; counter: number };
// const Countainer = <Content>(content: Content): Countainer<Content> => ({
//   content: content,
//   counter: 0,
// });
// const incrCountainer = <T>(c: Countainer<T>): Countainer<T> => ({
//   ...c,
//   counter: c.counter + 1,
// });

// type Person = { firstName: string; age: number };
// const incrAge = Fun<Person, Person>((p) => ({ ...p, age: p.age + 1 }));
// const setFirstName = (newFirstName: string) =>
//   Fun<Person, Person>((p) => ({ ...p, firstName: newFirstName }));
// const personCountainer = Countainer<Person>({ firstName: "Jaim", age: 22 });

// const mapCountainer = <Content, NewContent>(
//   transformContent: Fun<Content, NewContent>
// ): Fun<Countainer<Content>, Countainer<NewContent>> =>
//   Fun((c) => ({ ...c, content: transformContent(c.content) }));

// const composite = mapCountainer(incrAge.then(setFirstName("Jamey"))).then(
//   Fun(incrCountainer)
// );

// // type Option<A> = { kind: "none" } | { kind: "some"; value: A };
// // const none = <T>(): Option<T> => ({ kind: "none" });
// // const some = <T>(value: T): Option<T> => ({ kind: "some", value: value });
// // const mapOption = <Content, NewContent>(
// //   transformContent: Fun<Content, NewContent>
// // ): Fun<Option<Content>, Option<NewContent>> =>
// //   Fun((o) =>
// //     o.kind == "none"
// //       ? none<NewContent>()
// //       : some<NewContent>(transformContent(o.value))
// //   );

// // type CountainerMaybe<A> = Countainer<Option<A>>;

// // const mapCountainerMaybe = <A, B>(
// //   transformContent: Fun<A, B>
// // ): Fun<CountainerMaybe<A>, CountainerMaybe<B>> =>
// //   mapCountainer(mapOption(transformContent));

// type List<a> =
//   | {
//       kind: "Const";
//       head: a;
//       tail: List<a>;
//     }
//   | { kind: "Empty" };

// const mkList = <a>(arr: Array<a>): List<a> => {
//   let list: List<a> = {
//     kind: "Empty",
//   };

//   for (let i = arr.length - 1; i >= 0; i--) {
//     if (list.kind == "Empty") {
//       list = {
//         kind: "Const",
//         head: arr[i],
//         tail: list,
//       };
//     } else {
//       list = {
//         kind: "Const",
//         head: arr[i],
//         tail: list,
//       };
//     }
//   }

//   return list;
// };

// // const createList = <Type>([x, ...xs]: Array<Type>): List<Type> => {      
// //   if (xs.length === 0 && x === undefined) {
// //     return { kind: "Empty" };
// //   } else {
// //     return { kind: "Cons", head: x, tail: createList(xs) };
// //   }
// // };

// const printFunc = function <a>(l: List<a>): string {
//   if (l.kind == "Empty") {
//     return "";
//   }
//   return l.head + " " + printFunc(l.tail);
// };

// const mapList = <a, b>(f: Fun<a, b>): Fun<List<a>, List<b>> =>
//   Fun((l: List<a>): List<b> => {
//     if (l.kind == "Empty") {
//       return {
//         kind: "Empty",
//       };
//     } else {
//       return { kind: "Const", head: f(l.head), tail: mapList(f)(l.tail) };
//     }
//   });

// const incr = Fun<number, number>((x) => x + 1);

// const list = mapList(incr)(mkList([1, 2, 3]));

// const incrCharCode = (offset: number) =>
//   Fun((char: string): number => char.charCodeAt(0) + offset);
// const fromCharCode = Fun((charCode: number) => String.fromCharCode(charCode));

// const encode: Fun<List<string>, List<string>> = mapList(
//   incrCharCode(5).then(fromCharCode)
// );

// const encodeWithShift: Fun<number, Fun<List<string>, List<string>>> = Fun(
//   (shift: number) => mapList(incrCharCode(shift).then(fromCharCode))
// );

// const mappedList = mkList(["a", "b", "c"]);
// console.log(printFunc(mappedList));

// type ErrorOr<a> =
//   | {
//       kind: "Error";
//       message: string;
//     }
//   | {
//       kind: "Result";
//       value: a;
//     };

// const mapErrorOr = <a, b>(f: Fun<a, b>): Fun<ErrorOr<a>, ErrorOr<b>> =>
//   Fun((e) => (e.kind == "Error" ? e : { ...e, value: f(e.value) }));

// const failure: ErrorOr<any> = {
//   kind: "Error",
//   message: "An error occured",
// };

// const succes: ErrorOr<number> = {
//   kind: "Result",
//   value: 200,
// };

// mapErrorOr(incr)(succes)
// mapErrorOr(incr)(failure)
