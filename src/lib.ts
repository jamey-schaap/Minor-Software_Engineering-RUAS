export type Fun<T1, T2> = {
  (_: T1): T2;
  then: <T3>(g: Fun<T2, T3>) => Fun<T1, T3>;
  repeat: (times: number) => Fun<T1, T1>;
  repeatUntil: (condition: Fun<T1, boolean>) => Fun<T1, T1>;
};

export const Fun = function <T1, T2>(f: (_: T1) => T2): Fun<T1, T2> {
  const wrapper = f as Fun<T1, T2>;

  wrapper.then = function <T3>(this: Fun<T1, T2>, g: Fun<T2, T3>): Fun<T1, T3> {
    return Fun((x) => g(this(x)));
  };

  wrapper.repeat = function (this: Fun<T1, T1>, times: number): Fun<T1, T1> {
    return times > 0 ? this.then(this.repeat(times - 1)) : Fun((x) => x);
  };

  wrapper.repeatUntil = function (
    this: Fun<T1, T1>,
    condition: Fun<T1, boolean>
  ): Fun<T1, T1> {
    return Fun((x) =>
      condition(x) ? x : this.then(this.repeatUntil(condition))(x)
    );
  };

  return wrapper;
};

//////////////////////////////////////////
//                  Id                  //
//////////////////////////////////////////
export type Id<T> = T;
export const Id = <T>(): Fun<T, Id<T>> => Fun((x) => x);
export const mapId = <T1, T2>(f: Fun<T1, T2>): Fun<Id<T1>, Id<T2>> =>
  f.then(Id());
export const joinId = <T>(): Fun<Id<Id<T>>, Id<T>> => Id<T>();
export const unitId = <T>(): Fun<T, Id<T>> => Id<T>();
export const bindId = <T1, T2>(i: Id<T1>, f: Fun<T1, Id<T2>>): Id<T2> =>
  f.then(Id())(i);

//////////////////////////////////////////
//              Countainer              //
//////////////////////////////////////////
export type Countainer<T> = { content: T; counter: number };
export const Countainer = <T>(content: T): Countainer<T> => ({
  content: content,
  counter: 0,
});

export const mapCountainer = <T1, T2>(
  contentTransformation: Fun<T1, T2>
): Fun<Countainer<T1>, Countainer<T2>> =>
  Fun((c) => ({ ...c, content: contentTransformation(c.content) }));
export const joinCountainer = <T>(): Fun<
  Countainer<Countainer<T>>,
  Countainer<T>
> =>
  Fun((c) => ({
    content: c.content.content,
    counter: c.counter + c.content.counter,
  }));
export const unitCountainer = <T>(): Fun<T, Countainer<T>> =>
  Fun((val) => Countainer(val));
export const bindCountainer = <T1, T2>(
  c: Countainer<T1>,
  f: Fun<T1, Countainer<T2>>
): Countainer<T2> =>
  mapCountainer<T1, Countainer<T2>>(f).then(joinCountainer())(c);

/////////////////////////////////////////
//                Array                //
/////////////////////////////////////////
export type Many<T> = Array<T>;
export const Many = <T>(): Fun<T, Many<T>> => Fun((val) => [val]);
export const mapMany = <T1, T2>(f: Fun<T1, T2>): Fun<Many<T1>, Many<T2>> =>
  Fun((inputArray) => inputArray.map(f));
export const joinMany = <T>(): Fun<Many<Many<T>>, Many<T>> =>
  Fun((nestedValue) => {
    let result: Array<T> = [];
    for (const value of nestedValue) {
      result = result.concat(value);
    }
    return result;
  });
export const unitMany = <T>(): Fun<T, Many<T>> => Many();
export const bindMany = <T1, T2>(m: Many<T1>, f: Fun<T1, Many<T2>>): Many<T2> =>
  mapMany<T1, Many<T2>>(f).then(joinMany())(m);

//////////////////////////////////////////
//                Option                //
//////////////////////////////////////////
export interface OptionMethods<T1> {
  bind: <T2>(this: Option<T1>, f: Fun<T1, Option<T2>>) => Option<T2>;
}

export type Option<T> = (
  | {
      kind: "none";
    }
  | {
      kind: "some";
      value: T;
    }
) &
  OptionMethods<T>;

const optionMethods = <T1>(): OptionMethods<T1> => ({
  bind: function <T2>(this: Option<T1>, f: Fun<T1, Option<T2>>): Option<T2> {
    return mapOption<T1, Option<T2>>(f).then(joinOption())(this);
  },
});

export const none = <T>(): Fun<void, Option<T>> =>
  Fun((_) => ({ ...optionMethods(), kind: "none" }));
export const some = <T>(): Fun<T, Option<T>> =>
  Fun((v) => ({ ...optionMethods(), kind: "some", value: v }));

export const mapOption = <T1, T2>(
  f: Fun<T1, T2>
): Fun<Option<T1>, Option<T2>> =>
  Fun((opt) =>
    opt.kind == "none" ? none<T2>()() : f.then(some<T2>())(opt.value)
  );

export const zeroOption = <T>(): Fun<void, Option<T>> => none<T>();
export const unitOption = <T>(): Fun<T, Option<T>> => some<T>();

export const joinOption = <T>(): Fun<Option<Option<T>>, Option<T>> =>
  Fun((nestedOption) =>
    nestedOption.kind == "none" ? none<T>()() : nestedOption.value
  );

export const bindOption = <T1, T2>(
  opt: Option<T1>,
  f: Fun<T1, Option<T2>>
): Option<T2> => mapOption<T1, Option<T2>>(f).then(joinOption())(opt);

//////////////////////////////////////////
//                 List                 //
//////////////////////////////////////////
export type List<T> =
  | {
      kind: "cons";
      head: T;
      tail: List<T>;
    }
  | {
      kind: "empty";
    };

export const List = <T>([x, ...xs]: Array<T>): List<T> =>
  x === undefined && xs.length === 0
    ? { kind: "empty" }
    : { kind: "cons", head: x, tail: List(xs) };

export const mapList = <T1, T2>(f: Fun<T1, T2>): Fun<List<T1>, List<T2>> =>
  Fun((l) =>
    l.kind === "empty" ? l : { ...l, head: f(l.head), tail: mapList(f)(l.tail) }
  );

export const unitList = <T>(): Fun<T, List<T>> =>
  Fun((value) => ({ kind: "cons", head: value, tail: List([]) }));

export const concatenate = <T>(l1: List<T>, l2: List<T>): List<T> =>
  l1.kind == "empty"
    ? l2
    : {
        kind: "cons",
        head: l1.head,
        tail: concatenate(l1.tail, l2),
      };

export const joinList = <T>(): Fun<List<List<T>>, List<T>> =>
  Fun((l) =>
    l.kind == "empty" ? l : concatenate(l.head, joinList<T>()(l.tail))
  );

export const bindList = <T1, T2>(l: List<T1>, f: Fun<T1, List<T2>>): List<T2> =>
  mapList<T1, List<T2>>(f).then(joinList())(l);

//////////////////////////////////////////
//                 Pair                 //
//////////////////////////////////////////
export interface Pair<T1, T2> {
  fst: T1;
  snd: T2;
}

export const Pair = <T1, T2>(x: T1, y: T2): Pair<T1, T2> => ({
  fst: x,
  snd: y,
});

export const mapPair = <L1, R1, L2, R2>(
  f: Fun<L1, L2>,
  g: Fun<R1, R2>
): Fun<Pair<L1, R1>, Pair<L2, R2>> => Fun((p) => Pair(f(p.fst), g(p.snd)));

//////////////////////////////////////////
//                Either                //
//////////////////////////////////////////
export interface EitherMethods<L, R> {
  then: <R2>(this: Either<L, R>, f: Fun<R, Either<L, R2>>) => Either<L, R2>;
}

// const eitherMethods = <L, R>(): EitherMethods<L, R> => ({
//   then: function <R2>(
//     this: Either<L, R>,
//     f: Fun<R, Either<L, R2>>
//   ): Either<L, R2> {
//     return mapEither(Id<L>(), f).then(joinEither())(this);
//   },
// });

// export type Either<L, R> = (
//   | {
//       kind: "Left";
//       value: L;
//     }
//   | {
//       kind: "Right";
//       value: R;
//     }
// ) &
//   EitherMethods<L, R>;

export type Either<L, R> =
  | {
      kind: "Left";
      value: L;
    }
  | {
      kind: "Right";
      value: R;
    };

export const inl = <L, R>(): Fun<L, Either<L, R>> =>
  // Fun((v) => ({ ...eitherMethods(), kind: "Left", value: v }));
  Fun((v) => ({ kind: "Left", value: v }));
export const inr = <L, R>(): Fun<R, Either<L, R>> =>
  // Fun((v) => ({ ...eitherMethods(), kind: "Right", value: v }));
  Fun((v) => ({ kind: "Right", value: v }));

export const mapEither = <L1, R1, L2, R2>(
  f: Fun<L1, L2>,
  g: Fun<R1, R2>
): Fun<Either<L1, R1>, Either<L2, R2>> =>
  Fun((eith) =>
    eith.kind == "Left"
      ? f.then(inl<L2, R2>())(eith.value)
      : g.then(inr<L2, R2>())(eith.value)
  );

export const unitEitherLeft = <L, R>(): Fun<L, Either<L, R>> => inl();
export const unitEitherRight = <L, R>(): Fun<R, Either<L, R>> => inr();

export const joinEither = <L, R>(): Fun<
  Either<L, Either<L, R>>,
  Either<L, R>
> =>
  Fun((nestedEither) =>
    nestedEither.kind == "Left"
      ? inl<L, R>()(nestedEither.value)
      : nestedEither.value
  );

export const bindEither = <L, R1, R2>(
  eith: Either<L, R1>,
  f: Fun<R1, Either<L, R2>>
): Either<L, R2> => mapEither(Id<L>(), f).then(joinEither())(eith);

///////////////////////////////////////////
//               BiFunctor               //
///////////////////////////////////////////
export type BiFunctor<L, R> =
  | (
      | {
          kind: "Left";
          value: L;
        }
      | {
          kind: "Right";
          value: R;
        }
    ) & {
      bmap: <L2, R2>(f: Fun<L, L2>, g: Fun<R, R2>) => BiFunctor<L2, R2>;
      lmap: <L2>(f: Fun<L, L2>) => BiFunctor<L2, R>;
      rmap: <R2>(f: Fun<R, R2>) => BiFunctor<L, R2>;
      // bjoin?/bflatten?
      // ljoin?/lflatten?
      // rjoin?/rflatten?
      // bthen?
      // lthen: <R2>(f: Fun<R, Either<L, R2>>) => BiFunctor<L, R2>;
      // rthen: <L2>(f: Fun<L, Either<L2, R>>) => BiFunctor<L2, R>;
    };

export const leftBiFunctor = <L, R>(): Fun<L, BiFunctor<L, R>> =>
  Fun((v) => ({
    kind: "Left",
    value: v,
    bmap: <L2, R2>(f: Fun<L, L2>, g: Fun<R, R2>) =>
      f.then(leftBiFunctor<L2, R2>())(v),
    lmap: <L2>(f: Fun<L, L2>) => f.then(leftBiFunctor<L2, R>())(v),
    rmap: <R2>(_: Fun<R, R2>) => leftBiFunctor<L, R2>()(v),
  }));

export const rightBiFunctor = <L, R>(): Fun<R, BiFunctor<L, R>> =>
  Fun((v) => ({
    kind: "Right",
    value: v,
    bmap: <L2, R2>(f: Fun<L, L2>, g: Fun<R, R2>) =>
      g.then(rightBiFunctor<L2, R2>())(v),
    lmap: <L2>(_: Fun<L, L2>) => rightBiFunctor<L2, R>()(v),
    rmap: <R2>(f: Fun<R, R2>) => f.then(rightBiFunctor<L, R2>())(v),
  }));

////////////////////////////////////////////
//           Type-safe Functors           //
////////////////////////////////////////////
export type Functors<T> = {
  Id: Id<T>;
  Array: Many<T>;
  List: List<T>;
  Option: Option<T>;
  Countainer: Countainer<T>;
};

export type Functor<F extends keyof Functors<any>> = F;
export const Functor = <F extends keyof Functors<any>>(f: F) => f;

export type ThenF<F extends keyof Functors<any>, G> = { Before: F; After: G };
export const ThenF = <F extends keyof Functors<any>, G>(f: F, g: G) => ({
  Before: f,
  After: g,
});

export type ApplyF<F, a> = F extends keyof Functors<any>
  ? Functors<a>[F]
  : F extends ThenF<infer G, infer H>
  ? ApplyF<G, ApplyF<H, a>>
  : "Cannot apply because F is neither primitive or composed";

export type Mapping<F> = <a, b>(
  f: Fun<a, b>
) => Fun<ApplyF<F, a>, ApplyF<F, b>>;
export type Mappings = {
  [F in keyof Functors<any>]: Mapping<F>;
};

export const mappings: Mappings = {
  Id: mapId,
  Array: mapMany,
  List: mapList,
  Option: mapOption,
  Countainer: mapCountainer,
};

export const map = <F>(F: F): Mapping<F> =>
  typeof F == "string" && F in mappings
    ? (mappings as any)[F]
    : "After" in (F as any) && "Before" in (F as any)
    ? <a, b>(f: Fun<a, b>) =>
        map((F as any)["Before"])(map((F as any)["After"])(f))
    : null!;

const LLCO = ThenF(
  "List",
  ThenF("List", ThenF("Countainer", Functor("Option")))
);
const LLO = ThenF("List", ThenF("List", Functor("Option")));
const COL = ThenF("Countainer", ThenF("Option", Functor("List")));

map(ThenF("Array", ThenF("Array", Functor("Option"))))<number, number>(
  Fun((_) => _ * 2)
)(<Many<Many<Option<number>>>>[
  [none()(), some()(1)],
  [none()(), some()(2)],
  [none()()],
]);

export interface Monads<T> {
  Id: Id<T>;
  Array: Many<T>;
  List: List<T>;
  Option: Option<T>;
  Countainer: Countainer<T>;
}

export type ThenM<M extends keyof Monads<any>, G> = { Before: M; After: G };
export const ThenM = <M extends keyof Monads<any>, G>(f: M, g: G) => ({
  Before: f,
  After: g,
});

export type ApplyM<M, a> = M extends keyof Monads<any>
  ? Monads<a>[M]
  : M extends ThenM<infer G, infer H>
  ? ApplyM<G, ApplyM<H, a>>
  : "Cannot apply because F is neither primitive or composed";

export type Unit<M> = <a>() => Fun<a, ApplyM<M, a>>;
export type Units = {
  [M in keyof Monads<any>]: Unit<M>;
};
export const units: Units = {
  Id: unitId,
  Array: unitMany,
  List: unitList,
  Option: unitOption,
  Countainer: unitCountainer,
};

export type Join<M> = <a>() => Fun<ApplyF<M, ApplyF<M, a>>, ApplyF<M, a>>;
export type Joins = {
  [M in keyof Monads<any>]: Join<M>;
};
export const joins: Joins = {
  Id: joinId,
  Array: joinMany,
  List: joinList,
  Option: joinOption,
  Countainer: joinCountainer,
};

export const bind =
  <M extends keyof Monads<any>>(M: M) =>
  <a, b>(x: Monads<a>[M], k: Fun<a, Monads<b>[M]>): Monads<b>[M] =>
    (joins as any)[M]((mappings as any)[M](k)(x));
