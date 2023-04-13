"use strict";
// // ############################## Week 1 ##############################
// type Fun<input, output> = {
//   (input: input): output;
//   then: <finalOutput>(nextStep: Fun<output, finalOutput>) => Fun<input, finalOutput>;
//   repeat: (times: number) => Fun<input, input>;
//   repeatUntil: (condition: Fun<input, boolean>) => Fun<input, input>;
// };
// const Fun = <input, output>(implementation: (input:input) => output): Fun<input, output> => {
//   const tmp = implementation as Fun<input, output>
//   tmp.then = function<finalOutput>(this: Fun<input, output>, g: Fun<output, finalOutput>): Fun<input, finalOutput> { 
//     return Fun(x => g(this(x)))
//   }
//   tmp.repeat = function(this: Fun<input, input>, times: number): Fun<input, input> {
//     return times > 0 ? this.then(this.repeat(times - 1)) : Fun(_ => _);
//   }
//   tmp.repeatUntil = function (this: Fun<input, input>, condtion: Fun<input, boolean>): Fun<input, input> {
//     return Fun((x) => condtion(x) ? x : this.then(this.repeatUntil(condtion))(x) );
//   }
//   return tmp
// }
// const id: <inputOutput>() => Fun<inputOutput, inputOutput> = () => Fun(_ => _)
// const incr: Fun<number, number> = Fun((input) => input + 1);
// const decr: Fun<number, number> = Fun((input) => input - 1);
// const double: Fun<number, number> = Fun((input) => input * 2);
// const gtz: Fun<number, boolean> = Fun((input) => input > 0);
// const isEven: Fun<number, boolean> = Fun((input) => input % 2 === 0);
// const not: Fun<boolean, boolean> = Fun((input) => !input);
// const p0 = incr.then(double);
// const p1 = incr.then(double).then(decr).then(gtz);
// const p2 = decr.then(decr).then(double).then(gtz);
// const p3 = p2.then(not)
// // ############################## Week 2 ############################## 
// // type Countainer<content> = { content: content, counter: number};
// // const Countainer = <content>(content: content): Countainer<content> => ({ content: content, counter: 0});
// // type Person = { name: string, surname: string, age: number };
// // const personCountainer = Countainer({ name: "Jamey", surname: "Schaap", age: 22 });
// // const setName = (newName: string): Fun<Person, Person> => Fun((_) => ({..._, name: newName}));
// // const setSurname = (newSurname: string): Fun<Person, Person> => Fun((_) => ({..._, surname: newSurname}));
// // const setAge = (newAge: number): Fun<Person, Person> => Fun((_) => ({..._, age: newAge}));
// // const incrAge = Fun<Person, Person>((_) => ({..._, age: _.age + 1}));
// // // const incrCountainer = <content>(): Fun<Countainer<content>, Countainer<content>> => 
// // //   Fun((countainer: Countainer<content>) =>
// // //     ({...countainer, counter: countainer.counter + 1}))
// // const incrCountainer = <content>(countainer: Countainer<content>) => ({...countainer, counter: countainer.counter + 1});
// // const mapCountainer =
// //   <content, newContent>(transformContent: Fun<content, newContent>): Fun<Countainer<content>, Countainer<newContent>> =>
// //     Fun((coutainer) => ({ ...coutainer, content: transformContent(coutainer.content)}));
// // const mapArray =
// //   <content, newContent>(transformContent: Fun<content, newContent>): Fun<content[], newContent[]> =>
// //     Fun((inputArray) => inputArray.map(transformContent));
// type Countainer<A> = { content: A, counter: number };
// const c_i: Countainer<number> = ({ content: 10, counter: 0});
// const c_s: Countainer<string> = ({ content: "Howdy!", counter: 0});
// const c_ss: Countainer<string[]> = ({ content: ["Howdy", "!"], counter: 0});
// const map_countainer = 
//   <A, B>(transformContent: Fun<A, B>): Fun<Countainer<A>, Countainer<B>> => 
//     Fun(countainer => ({...countainer, content: transformContent(countainer.content) }));
// let incrCountainer = map_countainer(incr);
// let isCountainerEven = map_countainer(isEven);
// const my_f = incrCountainer.then(isCountainerEven);
// // let tick: Fun<Countainer<number>, Countainer<number>> = Fun((c) => ({
// //   ...c,
// //   counter: c.counter + 1
// // }))
// // let tick = <A>(): Fun<Countainer<A>, Countainer<A>> => Fun((c) => ({...c, counter: c.counter + 1}));
// let tick = <A>(c: Countainer<A>) => ({...c, counter: c.counter + 1});
// let my_g = incrCountainer.then(isCountainerEven).then(Fun(tick));
// type Option<A> = { kind: "none" } | { kind: "some"; value: A };
// const printF = (x: Option<number>): string => x.kind == "some" ? `the value is ${x.value}` : "there is no value";
// let none: <A>() => Option<A> = () => ({ kind: "none" });
// let some: <A>(x: A) => Option<A> = (x) => ({ kind: "some", value: x });
// let mapOption = <A,B>(f: Fun<A,B>): Fun<Option<A>, Option<B>> => 
//   Fun((x) => x.kind == "none" ? none<B>() : some<B>(f(x.value)));
// let pipeline: Fun<Option<number>, Option<boolean>> = mapOption(
//   incr.then(double.then(gtz))
// )
// type Id<A> = A;
// let madID = <a,b>(f: Fun<a,b>): Fun<Id<a>, Id<b>> => f;
// type CountainerMaybe<a> = Countainer<Option<a>>;
// let mapCountainerMaybe = <a,b>(f: Fun<a,b>): Fun<CountainerMaybe<a>, CountainerMaybe<b>> => 
//   map_countainer<Option<a>, Option<b>>(mapOption<a,b>(f));
//# sourceMappingURL=week-2c.js.map