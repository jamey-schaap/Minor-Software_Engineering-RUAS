import { Either, Fun, Pair, inl, inr } from "./lib";

/*
  x = 5
  wait 2
  while x > 0 {
    x = x - 1
    wait 1
  }

  EXECUTION:
    FRAME 1:
    x = 5
    State: { x : 5 }
    Continuation:
      wait 1.999998
      while x > 0 {
        x = x - 1
        wait 1
      }

  1. A coroutine returns either a result or not
  2. If it does not return a result, it can be because of an error or because it has stopped.
  3. If it stops, we need to remember the current state and the next part of the code to run.
*/

export type Coroutine<State, Error, a> = Fun<
  State,
  Either<NoRes<State, Error, a>, Pair<a, State>>
> & {
  thenBind: <b>(
    this: Coroutine<State, Error, a>,
    f: Fun<a, Coroutine<State, Error, b>>
  ) => Coroutine<State, Error, b>;
  parallel: <b>(
    this: Coroutine<State, Error, a>,
    coroutine: Coroutine<State, Error, b>
  ) => Coroutine<State, Error, Pair<a, b>>;
  concurrent: <b>(
    this: Coroutine<State, Error, a>,
    coroutine: Coroutine<State, Error, b>
  ) => Coroutine<State, Error, Either<a, b>>;
};

export const Coroutine = function <State, Error, a>(
  f: Fun<State, Either<NoRes<State, Error, a>, Pair<a, State>>>
): Coroutine<State, Error, a> {
  const coroutineWrapper = f as Coroutine<State, Error, a>;

  coroutineWrapper.thenBind = function <b>(
    this: Coroutine<State, Error, a>,
    f: Fun<a, Coroutine<State, Error, b>>
  ): Coroutine<State, Error, b> {
    return bindCoroutine(this, f);
  };

  coroutineWrapper.parallel = function <b>(
    this: Coroutine<State, Error, a>,
    coroutine: Coroutine<State, Error, b>
  ): Coroutine<State, Error, Pair<a, b>> {
    return parallel(this, coroutine);
  };

  coroutineWrapper.concurrent = function <b>(
    this: Coroutine<State, Error, a>,
    coroutine: Coroutine<State, Error, b>
  ): Coroutine<State, Error, Either<a, b>> {
    return concurrent(this, coroutine);
  };

  return coroutineWrapper;
};

type NoRes<State, Error, a> = Either<Error, Continuation<State, Error, a>>;
type Continuation<State, Error, a> = Pair<State, Coroutine<State, Error, a>>;

export const unitCoroutine = <State, Error, a>(): Fun<
  a,
  Coroutine<State, Error, a>
> =>
  Fun((value) =>
    Coroutine(
      Fun((state) =>
        inr<NoRes<State, Error, a>, Pair<a, State>>()({
          fst: value,
          snd: state,
        })
      )
    )
  );

export const _throw = <State, Error, a>(): Fun<
  Error,
  Coroutine<State, Error, a>
> =>
  Fun((error) =>
    Coroutine(
      Fun((state) =>
        inl<Error, Continuation<State, Error, a>>().then(
          inl<NoRes<State, Error, a>, Pair<a, State>>()
        )(error)
      )
    )
  );

export const suspend = <State, Error, a>(): Fun<
  Coroutine<State, Error, a>,
  Coroutine<State, Error, a>
> =>
  Fun(
    (next: Coroutine<State, Error, a>): Coroutine<State, Error, a> =>
      Coroutine(
        Fun((state: State) =>
          inr<Error, Continuation<State, Error, a>>().then(
            inl<NoRes<State, Error, a>, Pair<a, State>>()
          )({
            fst: state,
            snd: next,
          })
        )
      )
  );

export const mapCoroutine = <State, Error, a, b>(
  f: Fun<a, b>
): Fun<Coroutine<State, Error, a>, Coroutine<State, Error, b>> =>
  Fun((coroutine) =>
    Coroutine(
      Fun((state) => {
        const result = coroutine(state);

        // Result or not
        if (result.kind == "Left") {
          // Error or suspension
          if (result.value.kind == "Left") {
            // Error
            return inl<Error, Continuation<State, Error, b>>().then(
              inl<NoRes<State, Error, b>, Pair<b, State>>()
            )(result.value.value);
          }

          // Suspension
          const innerResult = result.value.value;
          return inr<Error, Continuation<State, Error, b>>().then(
            inl<NoRes<State, Error, b>, Pair<b, State>>()
          )({
            fst: innerResult.fst,
            snd: mapCoroutine<State, Error, a, b>(f)(innerResult.snd),
          });
        }

        // Result
        return inr<NoRes<State, Error, b>, Pair<b, State>>()({
          fst: f(result.value.fst),
          snd: result.value.snd,
        });
      })
    )
  );

export const joinCoroutine = <State, Error, a>(): Fun<
  Coroutine<State, Error, Coroutine<State, Error, a>>,
  Coroutine<State, Error, a>
> =>
  Fun((nestedCoroutine: Coroutine<State, Error, Coroutine<State, Error, a>>) =>
    Coroutine(
      Fun((state): Either<NoRes<State, Error, a>, Pair<a, State>> => {
        const nestedCoroutineResult = nestedCoroutine(state);

        // Result or Error
        if (nestedCoroutineResult.kind === "Left") {
          // Error or Suspension
          if (nestedCoroutineResult.value.kind === "Left") {
            // Error
            return inl<Error, Continuation<State, Error, a>>().then(
              inl<NoRes<State, Error, a>, Pair<a, State>>()
            )(nestedCoroutineResult.value.value);
          }
          // Suspension
          return inr<Error, Continuation<State, Error, a>>().then(
            inl<NoRes<State, Error, a>, Pair<a, State>>()
          )({
            fst: nestedCoroutineResult.value.value.fst,
            snd: joinCoroutine<State, Error, a>()(
              nestedCoroutineResult.value.value.snd
            ),
          });
        }
        // Result
        const { fst: currentCoroutine, snd: currentState } =
          nestedCoroutineResult.value;
        return currentCoroutine(currentState);
      })
    )
  );

export const bindCoroutine = <State, Error, a, b>(
  coroutine: Coroutine<State, Error, a>,
  f: Fun<a, Coroutine<State, Error, b>>
): Coroutine<State, Error, b> =>
  mapCoroutine<State, Error, a, Coroutine<State, Error, b>>(f).then(
    joinCoroutine()
  )(coroutine);

export const getState = <State, Error>(): Coroutine<State, Error, State> =>
  Coroutine(
    Fun((state: State) =>
      inr<NoRes<State, Error, State>, Pair<State, State>>()({
        fst: state,
        snd: state,
      })
    )
  );

export const setState = <State, Error>(
  newState: State
): Coroutine<State, Error, void> =>
  Coroutine(
    Fun((_) =>
      inr<NoRes<State, Error, void>, Pair<void, State>>()({
        fst: undefined,
        snd: newState,
      })
    )
  );

export const wait = <State extends { deltaTime: number }, Error>(
  duration: number
): Coroutine<State, Error, void> => {
  if (duration > 0) {
    return getState<State, Error>().thenBind(
      Fun((state: State) =>
        suspend<State, Error, void>()(wait(duration - state.deltaTime))
      )
    );
  }
  return unitCoroutine<State, Error, void>()();
};

export const waitUntil = <State, Error>(
  condition: Coroutine<State, Error, boolean>
): Coroutine<State, Error, void> =>
  condition.thenBind(
    Fun((check) => {
      if (check) {
        return unitCoroutine<State, Error, void>()();
      }
      return suspend<State, Error, void>()(waitUntil<State, Error>(condition));
    })
  );

export const parallel = <State, Error, a, b>(
  coroutine1: Coroutine<State, Error, a>,
  coroutine2: Coroutine<State, Error, b>
): Coroutine<State, Error, Pair<a, b>> =>
  Coroutine(
    Fun(
      (
        state
      ): Either<NoRes<State, Error, Pair<a, b>>, Pair<Pair<a, b>, State>> => {
        const execution1 = coroutine1(state);

        // 1st coroutine throws
        if (execution1.kind === "Left" && execution1.value.kind === "Left") {
          return _throw<State, Error, Pair<a, b>>()(execution1.value.value)(
            state
          );
        }

        // 1st coroutine returns
        if (execution1.kind === "Right") {
          const execution2 = coroutine2(execution1.value.snd);

          // 2nd coroutine throws
          if (execution2.kind === "Left" && execution2.value.kind === "Left") {
            return _throw<State, Error, Pair<a, b>>()(execution2.value.value)(
              state
            );
          }

          // 2nd coroutine returns
          if (execution2.kind === "Right") {
            return unitCoroutine<State, Error, Pair<a, b>>()({
              fst: execution1.value.fst,
              snd: execution2.value.fst,
            })(execution2.value.snd);
          }

          // 2nd coroutine suspends
          if (execution2.kind === "Left" && execution2.value.kind === "Right") {
            return suspend<State, Error, Pair<a, b>>()(
              parallel<State, Error, a, b>(
                unitCoroutine<State, Error, a>()(execution1.value.fst),
                execution2.value.value.snd
              )
            )(execution2.value.value.fst);
          }
        }

        // 1st coroutine suspends
        if (execution1.kind === "Left" && execution1.value.kind === "Right") {
          const execution2 = coroutine2(execution1.value.value.fst);

          // 2nd coroutine throws
          if (execution2.kind === "Left" && execution2.value.kind === "Left") {
            return _throw<State, Error, Pair<a, b>>()(execution2.value.value)(
              state
            );
          }

          // 2nd coroutine returns
          if (execution2.kind === "Right") {
            return suspend<State, Error, Pair<a, b>>()(
              parallel<State, Error, a, b>(
                execution1.value.value.snd,
                unitCoroutine<State, Error, b>()(execution2.value.fst)
              )
            )(execution2.value.snd);
          }

          // 2nd coroutine suspends
          if (execution2.kind === "Left" && execution2.value.kind === "Right") {
            return suspend<State, Error, Pair<a, b>>()(
              parallel<State, Error, a, b>(
                execution1.value.value.snd,
                execution2.value.value.snd
              )
            )(execution2.value.value.fst);
          }
        }

        return undefined!;
      }
    )
  );

export const concurrent = <State, Error, a, b>(
  coroutine1: Coroutine<State, Error, a>,
  coroutine2: Coroutine<State, Error, b>
): Coroutine<State, Error, Either<a, b>> =>
  Coroutine(
    Fun(
      (
        state
      ): Either<
        NoRes<State, Error, Either<a, b>>,
        Pair<Either<a, b>, State>
      > => {
        const execution1 = coroutine1(state);

        // 1st coroutine throws
        if (execution1.kind === "Left" && execution1.value.kind === "Left") {
          return _throw<State, Error, Either<a, b>>()(execution1.value.value)(
            state
          );
        }

        // 1st coroutine returns
        if (execution1.kind === "Right") {
          return unitCoroutine<State, Error, Either<a, b>>()(
            inl<a, b>()(execution1.value.fst)
          )(execution1.value.snd);
        }

        // 1st coroutine suspends
        if (execution1.kind === "Left" && execution1.value.kind === "Right") {
          const execution2 = coroutine2(execution1.value.value.fst);

          // 2nd coroutine throws
          if (execution2.kind === "Left" && execution2.value.kind === "Left") {
            return _throw<State, Error, Either<a, b>>()(execution2.value.value)(
              state
            );
          }

          // 2nd coroutine returns
          if (execution2.kind === "Right") {
            return unitCoroutine<State, Error, Either<a, b>>()(
              inr<a, b>()(execution2.value.fst)
            )(execution2.value.snd);
          }

          // 2nd coroutine suspends
          if (execution2.kind === "Left" && execution2.value.kind === "Right") {
            return suspend<State, Error, Either<a, b>>()(
              concurrent(execution1.value.value.snd, execution2.value.value.snd)
            )(execution2.value.value.fst);
          }
        }

        return undefined!;
      }
    )
  );

export const runCoroutine = <State extends { deltaTime: number }, Error, a>(
  initialState: State,
  coroutine: Coroutine<State, Error, a>
): Pair<a, State> | Error => {
  let currentFrame = {
    state: initialState,
    next: coroutine,
    currentTime: new Date(),
  };

  while (true) {
    const now = new Date();
    const deltaTime =
      (now.getTime() - currentFrame.currentTime.getTime()) / 1000;
    currentFrame.currentTime = now;
    const next = getState<State, Error>()
      .thenBind(
        Fun((state: State) =>
          setState<State, Error>({ ...state, deltaTime: deltaTime })
        )
      )
      .thenBind(Fun((_) => currentFrame.next));

    const result = next(currentFrame.state);
    if (result.kind === "Left") {
      if (result.value.kind === "Left") {
        return result.value.value;
      }
      currentFrame.state = result.value.value.fst;
      currentFrame.next = result.value.value.snd;
    } else {
      return result.value;
    }
  }
};
