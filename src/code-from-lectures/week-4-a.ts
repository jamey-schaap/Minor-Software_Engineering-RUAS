// type Fun<T1, T2> = {
//   (_: T1): T2;
//   then: <T3>(g: Fun<T2, T3>) => Fun<T1, T3>;
//   repeat: (times: number) => Fun<T1, T1>;
//   repeatUntil: (condition: Fun<T1, boolean>) => Fun<T1, T1>;
// };

// const Fun = function <T1, T2>(f: (_: T1) => T2): Fun<T1, T2> {
//   const wrapper = f as Fun<T1, T2>;

//   wrapper.then = function <T3>(this: Fun<T1, T2>, g: Fun<T2, T3>): Fun<T1, T3> {
//     return Fun((x) => g(this(x)));
//   };

//   wrapper.repeat = function (this: Fun<T1, T1>, times: number) {
//     return times > 0 ? this.then(this.repeat(times - 1)) : Fun((_) => _);
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

// // interface Monoid<T> {
// //   join(fst: T, snd: T): T;
// //   get zero(): T;
// // }

// interface Monoid<T> {
//   get join(): Fun<[T, T], T>;
//   zero: Fun<null, T>;
// }

// class NumberSum implements Monoid<number> {
//   get join(): Fun<[number, number], number> {
//     return Fun(([x, y]) => x + y);
//   }
//   get zero(): Fun<null, number> {
//     return Fun((_: null) => 0);
//   }
// }

// class NumberTimes implements Monoid<number> {
//   get join(): Fun<[number, number], number> {
//     return Fun(([x, y]) => x * y);
//   }
//   get zero(): Fun<null, number> {
//     return Fun((_: null) => 1);
//   }
// }

// class StringConcat implements Monoid<string> {
//   get join(): Fun<[string, string], string> {
//     return Fun(([x, y]) => x + y);
//   }
//   get zero(): Fun<null, string> {
//     return Fun((_: null) => "");
//   }
// }

// class ArrayConcat<ArrayArg> implements Monoid<Array<ArrayArg>> {
//   get join(): Fun<[Array<ArrayArg>, Array<ArrayArg>], Array<ArrayArg>> {
//     return Fun(([x, y]) => x.concat(y));
//   }
//   get zero(): Fun<null, Array<ArrayArg>> {
//     return Fun((_: null) => []);
//   }
// }

// type Countainer<T1> = {
//   content: T1;
//   counter: number;
// };

// const Countainer = <T1>(content: T1) => ({ content: content, counter: 0 });

// // Countainer can't be a Monoid because of it's content which is a generic type, without variable size.
// // class CountainerConcat<Arg> implements Monoid<Countainer<Arg>> {
// //   join(x: Countainer<Arg>, y: Countainer<Arg>): Countainer<Arg> {
// //     return x.concat(y);
// //   }
// //   get zero(): Countainer<Arg> {
// //     return null!;
// //   }
// // }

// function monoidAssociationLaw<T>(monoid: Monoid<T>, x: T, y: T, z: T): boolean {
//   return (
//     monoid.join([x, monoid.join([y, z])]) ==
//     monoid.join([monoid.join([x, y]), z])
//   );
// }

// function monoidIdentityLaw<T>(monoid: Monoid<T>, x: T): boolean {
//   return (
//     monoid.join([x, monoid.zero(null)]) == x &&
//     monoid.join([monoid.zero(null), x]) == x
//   ); // && monoid.join(x, monoid.zero) == monoid.join(monoid.zero, x)
// }

// /*
//   A monoid
//   a type T (number, string, array)
//   an operator join: [T,T] => T
//   an identity element zero: T
//   association
//     join(x, join(y,z)) == join((join(x,y),z))
//   identity law
//     join(x, zero) == join(zero, x) == x

//   - variable size | flexible in size
//   - string -> char[]
//   - number -> value of the number
// */

// // interface MonoidalFunctor<F where is a functor> {
// //   join: <T>(nestedValue: F<F<T>>) => F<T>
// //   zero: <T>() => F<T>;
// // }

// class ArrayFunctor {
//   join<T>(nestedValue: Array<Array<T>>): Array<T> {
//     let result: Array<T> = [];
//     for (const x of nestedValue) {
//       result = result.concat(x);
//     }
//     return result;
//   }
//   // join([[1], [2,5], [4]]) => [1,2,5,4]
//   zero<T>(): Array<T> {
//     return [];
//   }
// }

// // Can't be a monoid
// // class CountainerFunctor {
// //   join<T>(nestedValue: Countainer<Countainer<T>>): Countainer<T> {
// //     return {
// //       counter: nestedValue.counter + nestedValue.content.counter,
// //       content: nestedValue.content.content,
// //     };
// //   }
// //   zero<T>(): Countainer<T> {
// //     return ({ counter: 0, content: ???});
// //   }
// // }

// /*
//   A monoidal functor / Monad
//   a functor F<T>, (mapF: (Fun<A,B>) => (Fun<F<A>, F<B>>))
//   an operator join: F<F<T>> => F<T>
//   an identity element zero: F<T>
//   association
//     join(x, join(y,z)) == join((join(x,y),z))
//   identity law
//     join(x, zero) == join(zero, x) == x

//   - variable size | flexible in size
//   - string -> char[]
//   - number -> value of the number
// */

// // Option can be a monoid, because it has an empty value
// // Monoidal functor == Monad

