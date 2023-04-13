// type Fun<input, output> = {
//   (input: input): output;
//   whenDone: <finalOutput>(nextStep: Fun<output, finalOutput>) => Fun<input, finalOutput>;
// };

// const Fun = <input, output>(implementation: (input:input) => output): Fun<input, output> => {
//   const tmp = implementation as Fun<input, output>

//   tmp.whenDone = nextStep => Fun(x => nextStep(implementation(x)));
//   // tmp.whenDone = function<finalOutput>(nextStep: Fun<output, finalOutput>): Fun<input, finalOutput> {
//   //   return Fun(input => nextStep(implementation(input)))
//   // }
//   // tmp.whenDone = function<finalOutput>(this: Fun<input, output>, nextStep: Fun<output, finalOutput>): Fun<input, finalOutput> {
//   //   return Fun(input => nextStep(this(input)));
//   // }

//   return tmp
// }

// const id: <inputOutput>() => Fun<inputOutput, inputOutput> = () => Fun(_ => _)

// // function id <inputOutput(): Fun<inputOutput, inputOutput> {
// //   return Fun(_ => _);
// // }

// const incr: Fun<number, number> = Fun((input: number) => input + 1);
// const decr: Fun<number, number> = Fun((input: number) => input - 1);
// const double: Fun<number, number> = Fun((input: number) => input * 2);
// const gtz: Fun<number, boolean> = Fun((input: number) => input > 0);
// const not: Fun<boolean, boolean> = Fun((input: boolean) => !input);

// const p1 = incr.whenDone(double).whenDone(decr).whenDone(gtz)
// const p2 = decr.whenDone(decr).whenDone(double).whenDone(gtz)
// const p3 = p2.whenDone(not)

// // let p = id<number>()
// // if (???) {
// //   p = p.whenDone(incr)
// // } 
// // if (???) {
// //   p = p.whenDone(double)
// // } 
// // if (???) {
// //   p = p.whenDone(decr)
// // } 

// console.log(incr(10));
