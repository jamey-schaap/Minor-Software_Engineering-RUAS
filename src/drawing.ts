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
  waitUntil,
} from "./coroutine";
import { Fun } from "./lib";

export type Entity = {
  x: number;
  y: number;
  symbol: string;
};

export type DrawingState = {
  deltaTime: number;
  entities: Map<number, Entity>;
};

export const drawScene = (entities: Map<number, Entity>): string => {
  let scene = "";

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 10; x++) {
      const maybeEntity = entities.find(
        (entity) => entity.x === x && entity.y === y
      );

      if (maybeEntity) {
        scene += maybeEntity.symbol;
      } else {
        scene += "_";
      }
    }
    scene += "\n";
  }
  return scene;
};

const getEntity = (id: number): Coroutine<DrawingState, string, Entity> =>
  getState<DrawingState, string>().thenBind(
    Fun((state) => {
      const entity = state.entities.get(id);
      if (entity) {
        return unitCoroutine<DrawingState, string, Entity>()(entity);
      }
      return _throw<DrawingState, string, Entity>()(
        `Entity with id ${id} doest not exist.`
      );
    })
  );

const updateEntityPosition = (
  id: number,
  x: number,
  y: number
): Coroutine<DrawingState, string, Entity> =>
  getEntity(id).thenBind(
    Fun((entity) =>
      getState<DrawingState, string>().thenBind(
        Fun((state) => {
          const updatedEntity = { ...entity, x: x, y: y };
          return setState<DrawingState, string>({
            ...state,
            entities: state.entities.set(id, updatedEntity),
          }).thenBind(
            Fun(() =>
              unitCoroutine<DrawingState, string, Entity>()(updatedEntity)
            )
          );
        })
      )
    )
  );

const drawFrame: Coroutine<DrawingState, string, void> = getState<
  DrawingState,
  string
>().thenBind(
  Fun((state) => {
    const currentScene = drawScene(state.entities);
    console.log(currentScene);
    return unitCoroutine<DrawingState, string, void>()();
  })
);

const draw: Coroutine<DrawingState, string, void> = drawFrame
  .thenBind(Fun(() => wait(0.5)))
  .thenBind(Fun(() => draw));

const initialState: DrawingState = {
  deltaTime: 0,
  entities: Map([
    [0, { x: 0, y: 0, symbol: "*" }],
    [1, { x: 0, y: 1, symbol: "#" }],
    [2, { x: 0, y: 2, symbol: "$" }],
  ]),
};

const moveStar: Coroutine<DrawingState, string, void> = getEntity(0)
  .thenBind(Fun((entity) => updateEntityPosition(0, entity.x + 1, entity.y)))
  .thenBind(
    Fun((entity) =>
      entity.x >= 5
        ? unitCoroutine<DrawingState, string, void>()()
        : wait<DrawingState, string>(1).thenBind(Fun(() => moveStar))
    )
  );

const moveSharp: Coroutine<DrawingState, string, void> = getEntity(1)
  .thenBind(Fun((entity) => updateEntityPosition(1, entity.x + 1, entity.y)))
  .thenBind(
    Fun((entity) =>
      entity.x >= 5
        ? unitCoroutine<DrawingState, string, void>()()
        : wait<DrawingState, string>(3).thenBind(Fun(() => moveSharp))
    )
  );

const moveDollar: Coroutine<DrawingState, string, void> = waitUntil(
  getEntity(0).thenBind(
    Fun((star) =>
      getEntity(1).thenBind(
        Fun((sharp) =>
          unitCoroutine<DrawingState, string, boolean>()(
            star.x === 5 || sharp.x === 5
          )
        )
      )
    )
  )
)
  .thenBind(Fun(() => updateEntityPosition(2, 5, 2)))
  .thenBind(Fun((_) => unitCoroutine<DrawingState, string, void>()()));

const res = runCoroutine(
  initialState,
  concurrent(
    draw,
    moveDollar.parallel(concurrent(moveStar, moveSharp))
  ).thenBind(Fun(() => drawFrame))
);
