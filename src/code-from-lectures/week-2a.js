"use strict";
// // ############################## Week 1 ##############################
// type Fun<input, output> = {
//   (input: input): output;
//   then: <finalOutput>(nextStep: Fun<output, finalOutput>) => Fun<input, finalOutput>;
// };
// const Fun = <input, output>(implementation: (input:input) => output): Fun<input, output> => {
//   const tmp = implementation as Fun<input, output>
//   tmp.then = nextStep => Fun(x => nextStep(implementation(x)));
//   return tmp
// }
// const id: <inputOutput>() => Fun<inputOutput, inputOutput> = () => Fun(_ => _)
// const incr: Fun<number, number> = Fun((input: number) => input + 1);
// const decr: Fun<number, number> = Fun((input: number) => input - 1);
// const double: Fun<number, number> = Fun((input: number) => input * 2);
// const gtz: Fun<number, boolean> = Fun((input: number) => input > 0);
// const not: Fun<boolean, boolean> = Fun((input: boolean) => !input);
// const p0 = incr.then(double);
// const p1 = incr.then(double).then(decr).then(gtz);
// const p2 = decr.then(decr).then(double).then(gtz);
// const p3 = p2.then(not)
// console.log(incr(10));
// // ############################## Week 2 ############################## 
// type Countainer<content> = { content: content, counter: number };
// function Countainer<content> (content: content) : Countainer<content> {return {content: content, counter: 0}};
// // const incrCountainer = <content>(): Fun<Countainer<content>, Countainer<content>> => 
// //   Fun((countainer: Countainer<content>) =>
// //     ({...countainer, counter: countainer.counter + 1}))
// const incrCountainer = <content>(countainer: Countainer<content>) => ({...countainer, counter: countainer.counter + 1});
// // const decrCountainer = <content>(): Fun<Countainer<content>, Countainer<content>> => 
// //   Fun((countainer: Countainer<content>) =>
// //     ({...countainer, counter: countainer.counter - 1}))
// const decrountainer = <content>(countainer: Countainer<content>) => ({...countainer, counter: countainer.counter - 1});
// const mapCountainer = 
//   <content, newContent>(contentTransformation: Fun<content, newContent>):Fun<Countainer<content>, Countainer<newContent>> => 
//     Fun(countainer => ({...countainer, content: contentTransformation(countainer.content)}))
// const mapArray = 
//   <content, newContent>(contentTransformation: Fun<content, newContent>):Fun<Array<content>, Array<newContent>> => 
//     Fun((inputArray: Array<content>) => inputArray.map(contentTransformation))
// type Person = { name: string, surname: string, age: number}
// const setName = (newName: string) => Fun<Person, Person>(_ => ({..._, name: newName}));
// const setSurame = (newSurname: string) => Fun<Person, Person>(_ => ({..._, surname: newSurname}));
// const setAge = (newAge: number) => Fun<Person, Person>(_ => ({..._, age: newAge}));
// const incrAge = Fun<Person, Person>(_ => ({..._, age: _.age + 1}))
// let personCountainer = Countainer<Person>({ name: "jamey", surname:"schaap", age: 22 })
// // const f = mapCountainer(setName("Jack").then(incrAge)).then(incrCountainer().then(incrCountainer()))
// const f: Fun<Array<Countainer<Person>>, Array<Countainer<Person>>> = 
//   mapArray(
//     mapCountainer(
//       incrAge.then(setName("Jack"))
// //     ).then(incrCountainer())
//     ).then(Fun(incrCountainer))
//   ) 
//# sourceMappingURL=week-2a.js.map