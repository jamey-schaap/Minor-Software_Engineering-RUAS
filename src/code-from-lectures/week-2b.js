"use strict";
// type Person = { name: string; surname: string; age: number };
// const setName = (newName: string) =>
//   Fun<Person, Person>((_) => ({ ..._, name: newName }));
// const setSurname = (newSurname: string) =>
//   Fun<Person, Person>((_) => ({ ..._, surname: newSurname }));
// const setAge = (newAge: number) =>
//   Fun<Person, Person>((_) => ({ ..._, age: newAge }));
// const incrAge = Fun<Person, Person>((_) => ({ ..._, age: _.age + 1 }));
// let personCountainer = Countainer<Person>({
//   name: "John",
//   surname: "Ivanovich",
//   age: 22,
// });
// const f: Fun<
//   Countainer<Array<Countainer<Person>>>,
//   Countainer<Array<Countainer<Person>>>
// > =
//   // increment the age by one of each person inside each countainer
//   mapCountainer(
//     mapArray(
//       mapCountainer(incrAge.then(setName("Jack"))).then(Fun(incrCountainer))
//     )
//   ); 
// mapCountainer(  
//    
// only deals with the content inside Countainer  
//   .then(incrAge)  
// )  
// .then(Fun(incrCountainer)).then(Fun(incrCountainer))
//# sourceMappingURL=week-2b.js.map