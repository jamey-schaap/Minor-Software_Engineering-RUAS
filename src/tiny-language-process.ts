import { Map } from "immutable";
import { Process, _catch, getState, setState, unitProcess } from "./process";
import { Fun } from "./lib";

type Value =
  | {
      kind: "number";
      value: number;
    }
  | {
      kind: "string";
      value: string;
    };

export type Memory = Map<string, Value>;

export const getVariable = (variable: string): Process<Memory, string, Value> =>
  getState<Memory, string>().thenBind(
    Fun((memory) => {
      const value = memory.get(variable);
      if (value) {
        return unitProcess<Memory, string, Value>()(value);
      }

      return _catch<Memory, string, Value>()(`Undefined variable ${variable}`);
    })
  );

export const setVariable = (
  variable: string,
  value: Value
): Process<Memory, string, void> =>
  getState<Memory, string>().thenBind(
    Fun((memory) => {
      const valueInMemory = memory.get(variable);
      if (!valueInMemory) {
        return setState<Memory, string>(memory.set(variable, value));
      }
      if (valueInMemory.kind === value.kind) {
        return setState<Memory, string>(memory.set(variable, value));
      }
      return _catch<Memory, string, void>()(
        `Variable ${variable} has type ${valueInMemory.kind} but ${value.kind} was given`
      );
    })
  );

export const updateVariable = (
  variable: string,
  updater: Fun<Value, Process<Memory, string, Value>>
) =>
  getVariable(variable)
    .thenBind(Fun((currentValue) => updater(currentValue)))
    .thenBind(Fun((newValue) => setVariable(variable, newValue)));

export const _while = (
  condition: Process<Memory, string, boolean>,
  body: Process<Memory, string, void>
): Process<Memory, string, void> =>
  condition.thenBind(
    Fun((check) => {
      if (check) {
        return body.thenBind(Fun((_) => _while(condition, body)));
      }
      return unitProcess<Memory, string, void>()();
    })
  );

const program = setVariable("x", { kind: "number", value: 1 }).thenBind(
  Fun((_) =>
    updateVariable(
      "x",
      Fun((currentValue) =>
        currentValue.kind === "number"
          ? unitProcess<Memory, string, Value>()({
              kind: "number",
              value: currentValue.value + 3,
            })
          : _catch<Memory, string, Value>()(`Invalid expression type`)
      )
    )
  )
);

const programWithLoop = setVariable("x", { kind: "number", value: 5 }).thenBind(
  Fun((_) =>
    _while(
      getVariable("x").thenBind(
        Fun((value) =>
          value.kind === "number"
            ? unitProcess<Memory, string, boolean>()(value.value > 0)
            : _catch<Memory, string, boolean>()(`Invalid condition type`)
        )
      ),
      updateVariable(
        "x",
        Fun((value) =>
          value.kind === "number"
            ? unitProcess<Memory, string, Value>()({
                kind: "number",
                value: value.value + 1,
              })
            : _catch<Memory, string, Value>()("")
        )
      )
    )
  )
);
