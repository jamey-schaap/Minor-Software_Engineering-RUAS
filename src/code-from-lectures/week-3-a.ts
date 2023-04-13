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

// /* 
// Functor (or mappable) is a structure 
// a generic
// type F<a> = ...a...

// a mapping function is a structure preserving transformation
// mapF<A,B>(f: Fun<A,B>): Fun<F<A>, F<B>>

// Laws of functors = "The mapping function all and only the available content once and preserves the surrounding properties"
// mapF(id<A>) == id<F<A>>()
// mapF(f.then(g)) == mapF(f).then(mapF(g))

// composition of functors
// type F<a>, mapF
// type G<a>, mapG
// F<G<a>>, mapF.then(mapG) is also a functor
// */

// const id = <T>(_: T) => Fun((_) => _);

// type Many<A> = Array<A>;
// const mapMany = <A, B>(f: Fun<A, B>): Fun<Many<A>, Many<B>> =>
//   Fun((inputArray) => inputArray.map(f));

// type Option<A> = { kind: "empty" } | { kind: "full"; content: A };
// const empty = <A>(): Option<A> => ({ kind: "empty" });
// const full = <A>(content: A): Option<A> => ({ kind: "full", content: content });
// const mapOption = <A, B>(f: Fun<A, B>): Fun<Option<A>, Option<B>> =>
//   Fun((o) => (o.kind == "empty" ? empty() : full(f(o.content))));
// // ! Null object pattern

// type X<A> = Many<Option<Countainer<A>>>;
// const f = (xs: X<number>): X<number> =>
//   mapMany(mapOption(mapCountainer(double)))(xs);

// /*
// number, + 
// + : [number, number] => number
// (a+b)+c == a+(b+c)
// a+0 == 0+a == a

// number, * 
// * : [number, number] => number
// (a*b)*c =?= a*(b*c)
// a*1 == 1*a == a

// string, +, ""
// + : [string, string] => string
// (a+b)+c == a+(b+c)
// a+"" == "+a == a

// Array<a>, concat, []
// concat: [Array<a>, Array<a>] => Array<a>
// a.concat(b.concat(c)) == (a.concat(b)).concat(c)
// a.concat([]) == [].concat(a) == a

// Fun<a,a>, then, id
// then: [Fun<a,a>, Fun<a,a>] => Fun<a,a> 
// a.then(b.then(c)) == (a.then(b)).then(c)
// a.then(id) == id.then(a) = a

// A monoid or triple is (Triplet of 3 things)
// a type T
// an operator +:[T,T] => T
// an element  z:T
// such that 
// (a+b)+c == a+(b+c)     <- associative law
// a+z == z+a == a        <- identity law
//  */
