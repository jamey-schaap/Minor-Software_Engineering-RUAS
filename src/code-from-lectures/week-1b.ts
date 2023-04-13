// // yarn tsc -> yarn start
// // yarn tsc --watch -> yarn start

// export interface Fun<a, b> {
//     (_: a): b;
//     then: <c>(g: Fun<b, c>) => Fun<a, c>;
//     repeat: (times: number) => Fun<a, a>;
//     repeatUntil: (condition: Fun<a, boolean>) => Fun<a, a>;
//   }
  
//   const Fun = function <a, b>(f: (_: a) => b): Fun<a, b> {
//     const functionWrapper = f as Fun<a, b>;
//     functionWrapper.then = 
//       function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
//         return Fun<a, c>((x) => g(this(x)));
//       };
//     functionWrapper.then = (g) => Fun(x => g(f(x)));
  
//     functionWrapper.repeat =
//       function(this: Fun<a, a>, times: number): Fun<a,a>{ 
//         if (times > 0){
//           return this.then(this.repeat(times - 1))
//         }
//         return Fun<a, a>(x => x)
//       }
  
//     functionWrapper.repeatUntil =
//       function(this: Fun<a, a>, condition: Fun<a, boolean>): Fun<a,a> {
//         return Fun<a,a>(
//           x => 
//             !condition(x) ? 
//               this.then(this.repeatUntil(condition))(x) :
//               x 
//         )
//       }
//     return functionWrapper;
//   };
  
//   const incr = Fun<number, number>((x) => x + 1);
//   const isPositive = Fun<number, boolean>((x) => x >= 0);
  
//   const sqrt = Fun<number, number>(Math.sqrt);
//   const abs = Fun<number, number>(Math.abs);
  
//   const safeSqrt = abs.then(sqrt);
  
//   const conditional =
//     function<a,b>(condition: Fun<a, boolean>, _then: Fun<a,b>, _else: Fun<a,b>) {
//       return Fun<a,b>(x => condition(x) ? _then(x) : _else(x))
//     }
  
//   const result = incr.repeatUntil(isPositive)
//   console.log(result(-5));
  
  