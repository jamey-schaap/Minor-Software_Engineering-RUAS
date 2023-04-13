// import { List } from "immutable";

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

// /*
//   A monoidal functor | Monad
//   a generic type F<?> (Array<?>, List<?>, Option<?>, ...)
//   an operator join: F<F<T>> => F<T>
//   an identity element unit: T => F<T>

//   association
//     join.then(join) == mapF(join).then(join)
//   identity law
//     unit.then(join) == mapF(unit).then(join) == id

//   - variable size | flexible in size
//   - string -> char[]
//   - number -> value of the number
// */

// // interface MonoidalFunctor<F where is a functor> {
// //   join: <T>(nestedValue: F<F<T>>) => F<T>
// //   zero: <T>(unstructuredValue: T) => F<T>;
// // }

// // functor -> zero
// // monaid -> zero
// // monad -> unit

// const l = List([1, 2, 3]);
// l.flatten;

// class ArrayFunctor {
//   // flatten
//   static join<T>(nestedValue: Array<Array<T>>): Array<T> {
//     let result: Array<T> = [];
//     for (const value of nestedValue) {
//       result = result.concat(value);
//     }
//     return result;
//   }
//   // cons / zero
//   static unit<T>(unstructuredValue: T): Array<T> {
//     return [unstructuredValue];
//   }
// }

// // ----------------
// // const a = [
// //   [[1], [2, 3]],
// //   [[4], [5]],
// // ];
// // // const a = ArrayFunctor.join(ArrayFunctor.unit(ArrayFunctor.unit(1))); // : Array<number == [1]
// // const b = ArrayFunctor.unit(ArrayFunctor.unit(ArrayFunctor.unit(1))); // : Array<Array<Array<number>>>
// // const c = ArrayFunctor.join(b); // : Array<Array<number>>
// // const d = ArrayFunctor.join(c); // : Array<number>

// type Many<T> = Array<T>;
// const mapMany = <T1, T2>(f: Fun<T1, T2>): Fun<Many<T1>, Many<T2>> =>
//   Fun((inputArray) => inputArray.map(f));

// // const b1: Array<Array<number>> = mapMany(
// //   Fun((nestedValue: Array<Array<number>>) => ArrayFunctor.join(nestedValue))
// // )(a); // == [[1,2,3], [4,5]]
// // ----------------

// const a = [1, 2, 3];
// const innerA = mapMany(Fun((_: number) => ArrayFunctor.unit(_)))(a); // : Array<Array<number>> == [[1], [2], [3]]
// const outerA = ArrayFunctor.unit(a); // : Array<Array<number>> == [[1,2,3]]
// const joinedInner = ArrayFunctor.join(innerA); // : Array<number> == [1,2,3]
// const joinedOuter = ArrayFunctor.join(outerA); // : Array<number> == [1,2,3]

// type Option<A> = { kind: "empty" } | { kind: "full"; content: A };
// const empty = <T>(): Option<T> => ({ kind: "empty" });
// const full = <T>(content: T): Option<T> => ({ kind: "full", content: content });
// const mapOption = <Content, NewContent>(
//   transformContent: Fun<Content, NewContent>
// ): Fun<Option<Content>, Option<NewContent>> =>
//   Fun((o) =>
//     o.kind == "empty"
//       ? empty<NewContent>()
//       : full<NewContent>(transformContent(o.content))
//   );

// class OptionFunctor {
//   static join<T>(nestedValue: Option<Option<T>>): Option<T> {
//     return nestedValue.kind == "empty"
//       ? empty()
//       : nestedValue.content.kind == "empty"
//       ? empty()
//       : full(nestedValue.content.content);
//     // return nestedValue.kind == "empty" ? empty() : nestedValue.content;
//   }
//   static unit<T>(unstructuredValue: T): Option<T> {
//     return full(unstructuredValue);
//   }
// }

// type Countainer<Content> = { content: Content; counter: number };
// const Countainer = <Content>(content: Content): Countainer<Content> => ({
//   content: content,
//   counter: 0,
// });

// class CountainerFunctor {
//   static join<T>(nestedValue: Countainer<Countainer<T>>): Countainer<T> {
//     return {
//       content: nestedValue.content.content,
//       counter: nestedValue.counter + nestedValue.content.counter,
//     };
//   }
//   static unit<T>(unstructuredValue: T): Countainer<T> {
//     return Countainer(unstructuredValue);
//   }
// }
