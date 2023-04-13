// import {
//   Fun,
//   List,
//   Option,
//   Countainer,
//   Id,
//   mapId,
//   mapList,
//   mapOption,
//   mapCountainer,
//   none,
//   some,
//   mapMany,
//   Unit,
// } from "./notes";

// // Repository type
// type Functors<T> = {
//   Id: Id<T>;
//   Array: Array<T>;
//   List: List<T>;
//   Option: Option<T>;
//   Countainer: Countainer<T>;
// };

// type Functor<F extends keyof Functors<Unit>> = F;
// const Functor = <F extends keyof Functors<Unit>>(f: F) => f;

// type Then<F extends keyof Functors<Unit>, G> = { Before: F; After: G };
// const Then = <F extends keyof Functors<Unit>, G>(f: F, g: G): Then<F, G> => ({
//   Before: f,
//   After: g,
// });

// // Apply<Functor, argument>
// type Apply<F, a> = F extends keyof Functors<Unit>
//   ? Functors<a>[F]
//   : F extends Then<infer G, infer H>
//   ? Apply<G, Apply<H, a>>
//   : "Cannot apply because F is neither primitive or composed";

// type Mapping<F> = <a, b>(f: Fun<a, b>) => Fun<Apply<F, a>, Apply<F, b>>;
// type Mappings = {
//   [F in keyof Functors<Unit>]: Mapping<F>;
// };

// const mappings: Mappings = {
//   Id: mapId,
//   Array: mapMany,
//   List: mapList,
//   Option: mapOption,
//   Countainer: mapCountainer,
// };

// const map = <F>(F: F): Mapping<F> =>
//   typeof F == "string" && F in mappings
//     ? (mappings as any)[F]
//     : "After" in (F as any) && "Before" in (F as any)
//     ? <a, b>(f: Fun<a, b>) =>
//         map((F as any)["Before"])(map((F as any)["After"])(f))
//     : null!;

// // Composed Functors
// const LLCO = Then("List", Then("List", Then("Countainer", Functor("Option"))));
// const LLO = Then("List", Then("List", Functor("Option")));
// const COL = Then("Countainer", Then("Option", Functor("List")));

// const m1 = map(LLCO);

// console.log(
//   map(Then("Array", Then("Array", Functor("Option"))))<number, number>(
//     Fun((_) => _ * 2)
//   )([
//     [none<number>()(null), some<number>()(1)],
//     [none<number>()(null), some<number>()(2)],
//     [none<number>()(null)],
//   ])
// );
