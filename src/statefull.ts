import { Fun, Pair } from "./lib";

// Statement
export type Statefull<State, a> = Fun<State, Pair<a, State>> & {
  thenBind: <b>(f: Fun<a, Statefull<State, b>>) => Statefull<State, b>;
};

export const Statefull = function <State, a>(
  f: Fun<State, Pair<a, State>>
): Statefull<State, a> {
  const statefullWrapper = f as Statefull<State, a>;
  statefullWrapper.thenBind = function <b>(
    this: Statefull<State, a>,
    f: Fun<a, Statefull<State, b>>
  ): Statefull<State, b> {
    return bindStatefull(this, f);
  };
  return statefullWrapper;
};

export const unitStatefull = <State, a>(): Fun<a, Statefull<State, a>> =>
  Fun((value) => Statefull(Fun((state) => ({ fst: value, snd: state }))));

export const mapStatefull = <State, a, b>(
  f: Fun<a, b>
): Fun<Statefull<State, a>, Statefull<State, b>> =>
  Fun((statefull) =>
    Statefull(
      Fun((state) => {
        const { fst: result, snd: newState } = statefull(state);
        return { fst: f(result), snd: newState };
      })
    )
  );

export const joinStatefull = <State, a>(): Fun<
  Statefull<State, Statefull<State, a>>,
  Statefull<State, a>
> =>
  Fun((nestedStatefull) =>
    Statefull(
      Fun((state) => {
        const { fst: innerStatefull, snd: currentState } =
          nestedStatefull(state);

        return innerStatefull(currentState);
      })
    )
  );

export const bindStatefull = <State, a, b>(
  statefull: Statefull<State, a>,
  f: Fun<a, Statefull<State, b>>
): Statefull<State, b> =>
  mapStatefull<State, a, Statefull<State, b>>(f).then(joinStatefull())(
    statefull
  );

export const getState = <State>(): Statefull<State, State> =>
  Statefull(
    Fun((state) => ({
      fst: state,
      snd: state,
    }))
  );

export const setState = <State>(newState: State): Statefull<State, undefined> =>
  Statefull(
    Fun((_) => ({
      fst: undefined,
      snd: newState,
    }))
  );
