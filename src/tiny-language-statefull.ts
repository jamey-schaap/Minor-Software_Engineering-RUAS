import { Map } from "immutable";
import { Statefull, getState, setState, unitStatefull } from "./statefull";
import { Fun } from "./lib";

export type Memory = Map<string, number>;

export const getVariable = (variable: string): Statefull<Memory, number> =>
  getState<Memory>().thenBind(
    Fun((memory: Memory) =>
      unitStatefull<Memory, number>()(memory.get(variable)!)
    )
  );

export const setVariable = (
  variable: string,
  value: number
): Statefull<Memory, void> =>
  getState<Memory>().thenBind(
    Fun((memory: Memory) => setState<Memory>(memory.set(variable, value)))
  );

export const _while = (
  condition: Statefull<Memory, boolean>,
  body: Statefull<Memory, void>
): Statefull<Memory, void> =>
  condition.thenBind(
    Fun((c: boolean) => {
      if (c) {
        return body.thenBind(Fun((_) => _while(condition, body)));
      }
      return unitStatefull<Memory, void>()(undefined);
    })
  );

export const program = setVariable("x", 1)
  .thenBind(Fun((_) => getVariable("x")))
  .thenBind(Fun((currentValue: number) => setVariable("x", currentValue + 3)));

export const programWithLoop = setVariable("x", 3).thenBind(
  Fun((_) =>
    _while(
      getVariable("x").thenBind(
        Fun((value: number) => unitStatefull<Memory, boolean>()(value > 0))
      ),
      getVariable("x").thenBind(
        Fun((value: number) => setVariable("x", value - 1))
      )
    )
  )
);

const result = program(Map());
