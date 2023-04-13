"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = exports.joins = exports.units = exports.ThenM = exports.map = exports.mappings = exports.ThenF = exports.Functor = exports.rightBiFunctor = exports.leftBiFunctor = exports.bindEither = exports.joinEither = exports.unitEitherRight = exports.unitEitherLeft = exports.mapEither = exports.inr = exports.inl = exports.mapPair = exports.Pair = exports.bindList = exports.joinList = exports.concatenate = exports.unitList = exports.mapList = exports.List = exports.bindOption = exports.joinOption = exports.unitOption = exports.zeroOption = exports.mapOption = exports.some = exports.none = exports.bindMany = exports.unitMany = exports.joinMany = exports.mapMany = exports.Many = exports.bindCountainer = exports.unitCountainer = exports.joinCountainer = exports.mapCountainer = exports.Countainer = exports.bindId = exports.unitId = exports.joinId = exports.mapId = exports.Id = exports.Fun = void 0;
const Fun = function (f) {
    const wrapper = f;
    wrapper.then = function (g) {
        return (0, exports.Fun)((x) => g(this(x)));
    };
    wrapper.repeat = function (times) {
        return times > 0 ? this.then(this.repeat(times - 1)) : (0, exports.Fun)((x) => x);
    };
    wrapper.repeatUntil = function (condition) {
        return (0, exports.Fun)((x) => condition(x) ? x : this.then(this.repeatUntil(condition))(x));
    };
    return wrapper;
};
exports.Fun = Fun;
const Id = () => (0, exports.Fun)((x) => x);
exports.Id = Id;
const mapId = (f) => f.then((0, exports.Id)());
exports.mapId = mapId;
const joinId = () => (0, exports.Id)();
exports.joinId = joinId;
const unitId = () => (0, exports.Id)();
exports.unitId = unitId;
const bindId = (i, f) => f.then((0, exports.Id)())(i);
exports.bindId = bindId;
const Countainer = (content) => ({
    content: content,
    counter: 0,
});
exports.Countainer = Countainer;
const mapCountainer = (contentTransformation) => (0, exports.Fun)((c) => (Object.assign(Object.assign({}, c), { content: contentTransformation(c.content) })));
exports.mapCountainer = mapCountainer;
const joinCountainer = () => (0, exports.Fun)((c) => ({
    content: c.content.content,
    counter: c.counter + c.content.counter,
}));
exports.joinCountainer = joinCountainer;
const unitCountainer = () => (0, exports.Fun)((val) => (0, exports.Countainer)(val));
exports.unitCountainer = unitCountainer;
const bindCountainer = (c, f) => (0, exports.mapCountainer)(f).then((0, exports.joinCountainer)())(c);
exports.bindCountainer = bindCountainer;
const Many = () => (0, exports.Fun)((val) => [val]);
exports.Many = Many;
const mapMany = (f) => (0, exports.Fun)((inputArray) => inputArray.map(f));
exports.mapMany = mapMany;
const joinMany = () => (0, exports.Fun)((nestedValue) => {
    let result = [];
    for (const value of nestedValue) {
        result = result.concat(value);
    }
    return result;
});
exports.joinMany = joinMany;
const unitMany = () => (0, exports.Many)();
exports.unitMany = unitMany;
const bindMany = (m, f) => (0, exports.mapMany)(f).then((0, exports.joinMany)())(m);
exports.bindMany = bindMany;
const optionMethods = () => ({
    bind: function (f) {
        return (0, exports.mapOption)(f).then((0, exports.joinOption)())(this);
    },
});
const none = () => (0, exports.Fun)((_) => (Object.assign(Object.assign({}, optionMethods()), { kind: "none" })));
exports.none = none;
const some = () => (0, exports.Fun)((v) => (Object.assign(Object.assign({}, optionMethods()), { kind: "some", value: v })));
exports.some = some;
const mapOption = (f) => (0, exports.Fun)((opt) => opt.kind == "none" ? (0, exports.none)()() : f.then((0, exports.some)())(opt.value));
exports.mapOption = mapOption;
const zeroOption = () => (0, exports.none)();
exports.zeroOption = zeroOption;
const unitOption = () => (0, exports.some)();
exports.unitOption = unitOption;
const joinOption = () => (0, exports.Fun)((nestedOption) => nestedOption.kind == "none" ? (0, exports.none)()() : nestedOption.value);
exports.joinOption = joinOption;
const bindOption = (opt, f) => (0, exports.mapOption)(f).then((0, exports.joinOption)())(opt);
exports.bindOption = bindOption;
const List = ([x, ...xs]) => x === undefined && xs.length === 0
    ? { kind: "empty" }
    : { kind: "cons", head: x, tail: (0, exports.List)(xs) };
exports.List = List;
const mapList = (f) => (0, exports.Fun)((l) => l.kind === "empty" ? l : Object.assign(Object.assign({}, l), { head: f(l.head), tail: (0, exports.mapList)(f)(l.tail) }));
exports.mapList = mapList;
const unitList = () => (0, exports.Fun)((value) => ({ kind: "cons", head: value, tail: (0, exports.List)([]) }));
exports.unitList = unitList;
const concatenate = (l1, l2) => l1.kind == "empty"
    ? l2
    : {
        kind: "cons",
        head: l1.head,
        tail: (0, exports.concatenate)(l1.tail, l2),
    };
exports.concatenate = concatenate;
const joinList = () => (0, exports.Fun)((l) => l.kind == "empty" ? l : (0, exports.concatenate)(l.head, (0, exports.joinList)()(l.tail)));
exports.joinList = joinList;
const bindList = (l, f) => (0, exports.mapList)(f).then((0, exports.joinList)())(l);
exports.bindList = bindList;
const Pair = (x, y) => ({
    fst: x,
    snd: y,
});
exports.Pair = Pair;
const mapPair = (f, g) => (0, exports.Fun)((p) => (0, exports.Pair)(f(p.fst), g(p.snd)));
exports.mapPair = mapPair;
const eitherMethods = () => ({
    then: function (f) {
        return (0, exports.mapEither)((0, exports.Id)(), f).then((0, exports.joinEither)())(this);
    },
    print: function () {
        return `${this.value}`;
    },
});
const inl = () => (0, exports.Fun)((v) => (Object.assign(Object.assign({}, eitherMethods()), { kind: "Left", value: v })));
exports.inl = inl;
const inr = () => (0, exports.Fun)((v) => (Object.assign(Object.assign({}, eitherMethods()), { kind: "Right", value: v })));
exports.inr = inr;
const mapEither = (f, g) => (0, exports.Fun)((eith) => eith.kind == "Left"
    ? f.then((0, exports.inl)())(eith.value)
    : g.then((0, exports.inr)())(eith.value));
exports.mapEither = mapEither;
const unitEitherLeft = () => (0, exports.inl)();
exports.unitEitherLeft = unitEitherLeft;
const unitEitherRight = () => (0, exports.inr)();
exports.unitEitherRight = unitEitherRight;
const joinEither = () => (0, exports.Fun)((nestedEither) => nestedEither.kind == "Left"
    ? (0, exports.inl)()(nestedEither.value)
    : nestedEither.value);
exports.joinEither = joinEither;
const bindEither = (eith, f) => (0, exports.mapEither)((0, exports.Id)(), f).then((0, exports.joinEither)())(eith);
exports.bindEither = bindEither;
const leftBiFunctor = () => (0, exports.Fun)((v) => ({
    kind: "Left",
    value: v,
    bmap: (f, g) => f.then((0, exports.leftBiFunctor)())(v),
    lmap: (f) => f.then((0, exports.leftBiFunctor)())(v),
    rmap: (_) => (0, exports.leftBiFunctor)()(v),
}));
exports.leftBiFunctor = leftBiFunctor;
const rightBiFunctor = () => (0, exports.Fun)((v) => ({
    kind: "Right",
    value: v,
    bmap: (f, g) => g.then((0, exports.rightBiFunctor)())(v),
    lmap: (_) => (0, exports.rightBiFunctor)()(v),
    rmap: (f) => f.then((0, exports.rightBiFunctor)())(v),
}));
exports.rightBiFunctor = rightBiFunctor;
const Functor = (f) => f;
exports.Functor = Functor;
const ThenF = (f, g) => ({
    Before: f,
    After: g,
});
exports.ThenF = ThenF;
exports.mappings = {
    Id: exports.mapId,
    Array: exports.mapMany,
    List: exports.mapList,
    Option: exports.mapOption,
    Countainer: exports.mapCountainer,
};
const map = (F) => typeof F == "string" && F in exports.mappings
    ? exports.mappings[F]
    : "After" in F && "Before" in F
        ? (f) => (0, exports.map)(F["Before"])((0, exports.map)(F["After"])(f))
        : null;
exports.map = map;
const LLCO = (0, exports.ThenF)("List", (0, exports.ThenF)("List", (0, exports.ThenF)("Countainer", (0, exports.Functor)("Option"))));
const LLO = (0, exports.ThenF)("List", (0, exports.ThenF)("List", (0, exports.Functor)("Option")));
const COL = (0, exports.ThenF)("Countainer", (0, exports.ThenF)("Option", (0, exports.Functor)("List")));
(0, exports.map)((0, exports.ThenF)("Array", (0, exports.ThenF)("Array", (0, exports.Functor)("Option"))))((0, exports.Fun)((_) => _ * 2))([
    [(0, exports.none)()(), (0, exports.some)()(1)],
    [(0, exports.none)()(), (0, exports.some)()(2)],
    [(0, exports.none)()()],
]);
const ThenM = (f, g) => ({
    Before: f,
    After: g,
});
exports.ThenM = ThenM;
exports.units = {
    Id: exports.unitId,
    Array: exports.unitMany,
    List: exports.unitList,
    Option: exports.unitOption,
    Countainer: exports.unitCountainer,
};
exports.joins = {
    Id: exports.joinId,
    Array: exports.joinMany,
    List: exports.joinList,
    Option: exports.joinOption,
    Countainer: exports.joinCountainer,
};
const bind = (M) => (x, k) => exports.joins[M](exports.mappings[M](k)(x));
exports.bind = bind;
//# sourceMappingURL=lib.js.map