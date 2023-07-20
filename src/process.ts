import { Either, Fun, Pair, inl, inr } from "./lib";

export type Process<State, Error, a> = Fun<
  State,
  Either<Error, Pair<a, State>>
> & {
  thenBind: <b>(
    f: Fun<a, Process<State, Error, b>>
  ) => Process<State, Error, b>;
};

export const Process = function <State, Error, a>(
  f: Fun<State, Either<Error, Pair<a, State>>>
): Process<State, Error, a> {
  const processWrapper = f as Process<State, Error, a>;

  processWrapper.thenBind = function <b>(
    this: Process<State, Error, a>,
    f: Fun<a, Process<State, Error, b>>
  ): Process<State, Error, b> {
    return bindProcess(this, f);
  };

  return processWrapper;
};

export const unitProcess = <State, Error, a>(): Fun<
  a,
  Process<State, Error, a>
> =>
  Fun((value) =>
    Process(
      Fun((state) => inr<Error, Pair<a, State>>()({ fst: value, snd: state }))
    )
  );

export const _catch = <State, Error, a>(): Fun<
  Error,
  Process<State, Error, a>
> =>
  Fun((error) => Process(Fun((state) => inl<Error, Pair<a, State>>()(error))));

export const mapProcess = <State, Error, a, b>(
  f: Fun<a, b>
): Fun<Process<State, Error, a>, Process<State, Error, b>> =>
  Fun((process) =>
    Process(
      Fun((state) => {
        const result = process(state);
        return result.kind == "Left"
          ? inl<Error, Pair<b, State>>()(result.value)
          : inr<Error, Pair<b, State>>()({
              fst: f(result.value.fst),
              snd: result.value.snd,
            });
      })
    )
  );

export const joinProcess = <State, Error, a>(): Fun<
  Process<State, Error, Process<State, Error, a>>,
  Process<State, Error, a>
> =>
  Fun((nestedProcess) =>
    Process(
      Fun((state): Either<Error, Pair<a, State>> => {
        const nestedProcessResult = nestedProcess(state);

        if (nestedProcessResult.kind == "Left") {
          return inl<Error, Pair<a, State>>()(nestedProcessResult.value);
        }

        const innerProcessResult = nestedProcessResult.value.fst(
          nestedProcessResult.value.snd
        );
        return innerProcessResult;
      })
    )
  );

export const bindProcess = <State, Error, a, b>(
  process: Process<State, Error, a>,
  f: Fun<a, Process<State, Error, b>>
): Process<State, Error, b> =>
  mapProcess<State, Error, a, Process<State, Error, b>>(f).then(joinProcess())(
    process
  );

export const getState = <State, Error>(): Process<State, Error, State> =>
  Process(
    Fun((state) => inr<Error, Pair<State, State>>()({ fst: state, snd: state }))
  );

export const setState = <State, Error>(
  state: State
): Process<State, Error, void> =>
  Process(
    Fun((_) => inr<Error, Pair<void, State>>()({ fst: undefined, snd: state }))
  );
