import { unitCoroutine } from "./coroutine";
import { _while } from "./tiny-language-coroutine";

const test = _while(
  unitCoroutine<State, Error, void>
)