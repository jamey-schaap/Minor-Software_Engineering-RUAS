import { Map } from "immutable";
import {
  Coroutine,
  _throw,
  concurrent,
  getState,
  parallel,
  runCoroutine,
  setState,
  unitCoroutine,
  wait,
} from "./coroutine";
import { Fun } from "./lib";

type Value =
  | {
      kind: "string";
      value: string;
    }
  | {
      kind: "number";
      value: number;
    };

type Memory = Map<string, Value>;

interface InterruptibleState {
  deltaTime: number;
  memory: Memory;
}

export const getVariable = (
  variable: string
): Coroutine<InterruptibleState, string, Value> =>
  getState<InterruptibleState, string>().thenBind(
    Fun((state: InterruptibleState) => {
      const value = state.memory.get(variable);
      if (value) {
        return unitCoroutine<InterruptibleState, string, Value>()(value);
      }
      return _throw<InterruptibleState, string, Value>()(
        `Undefined variable ${variable}`
      );
    })
  );

export const setVariable = (
  variable: string,
  value: Value
): Coroutine<InterruptibleState, string, void> =>
  getState<InterruptibleState, string>().thenBind(
    Fun((state: InterruptibleState) => {
      const valueInMemory = state.memory.get(variable);

      if (valueInMemory && value.kind !== valueInMemory.kind) {
        return _throw<InterruptibleState, string, void>()(
          `Variable ${variable} has type ${valueInMemory.kind} but ${value.kind} was given`
        );
      }

      return setState<InterruptibleState, string>({
        ...state,
        memory: state.memory.set(variable, value),
      });
    })
  );

export const updateVariable = (
  variable: string,
  updater: Fun<Value, Coroutine<InterruptibleState, string, Value>>
): Coroutine<InterruptibleState, string, void> =>
  getVariable(variable)
    .thenBind(Fun((value) => updater(value)))
    .thenBind(Fun((value) => setVariable(variable, value)));

export const _while = (
  condition: Coroutine<InterruptibleState, string, boolean>,
  body: Coroutine<InterruptibleState, string, void>
): Coroutine<InterruptibleState, string, void> =>
  condition.thenBind(
    Fun((check) => {
      if (check) {
        return body.thenBind(Fun(() => _while(condition, body)));
      }
      return unitCoroutine<InterruptibleState, string, void>()();
    })
  );

const program1 = setVariable("x", { kind: "number", value: 1 })
  .thenBind(Fun((_) => wait(1)))
  .thenBind(
    Fun((_) => {
      console.log("Done waiting - program 1");
      return setVariable("x", { kind: "number", value: 5 });
    })
  );

const program2 = setVariable("y", { kind: "number", value: 3 })
  .thenBind(Fun((_) => wait(5)))
  .thenBind(
    Fun((_) => {
      console.log("Done waiting - program 2");
      return setVariable("y", { kind: "number", value: 1 });
    })
  );

const initialState: InterruptibleState = {
  deltaTime: 0,
  memory: Map(),
};

const res = runCoroutine(
  initialState,
  concurrent(program1, program2)
    .thenBind(Fun((_) => getState()))
    .thenBind(
      Fun((state) => {
        const val1 = state.memory.get("x");
        const val2 = state.memory.get("y");
        console.log(
          `state ${val1?.kind === "number" ? val1.value : "uh?!"} ${
            val2?.kind === "number" ? val2.value : "uh?!"
          }`
        );
        return unitCoroutine<InterruptibleState, string, void>()();
      })
    )
);

console.log(res);
