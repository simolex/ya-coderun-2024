type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Tuple<L extends number, O extends string = `${L}`, Count extends unknown[] = []> =
    O extends `${infer F}${infer R}` ? (
        Tuple<L, R, N<Count>[keyof N & F]>
    ) : Count

type N<T extends unknown[] = []> = {
    '0': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
    '1': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown],
    '2': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown],
    '3': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown],
    '4': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown, unknown],
    '5': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown, unknown, unknown],
    '6': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown, unknown, unknown, unknown],
    '7': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown, unknown, unknown, unknown, unknown],
    '8': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown],
    '9': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown],
}

type Num<S extends string> = S extends `${infer N extends number}`
    ? number extends N
    ? never
    : N
    : never;

type RemoveLeadingZeros<T extends string> = T extends "0"
    ? T
    : T extends `${0}${infer Rest}`
    ? RemoveLeadingZeros<Rest>
    : T;

type SumTuple<Nums extends number[], O extends unknown[] = [], Index extends unknown[] = [], Count = Nums['length']> =
    Index['length'] extends Count
    ? O
    : SumTuple<Nums, [...O, ...Tuple<Nums[Index['length']]>], [...Index, unknown]>

type ParseInteger<
    S extends string,
    L extends string = "",
    Buffer extends string = "",
    Result extends number[] = []
    > = S extends `${L}${infer C}${any}`
    ? C extends ""
    ? SumTuple<Result>
    : C extends Digit
    ? ParseInteger<S, `${L}${C}`, `${Buffer}${C}`, Result>
    : Buffer extends ""
    ? ParseInteger<S, `${L}${C}`, "", [...Result]>
    : ParseInteger<S, `${L}${C}`, "", [...Result, Num<RemoveLeadingZeros<Buffer>>]>
    : Buffer extends ""
    ? SumTuple<Result>
    : SumTuple<[...Result, Num<RemoveLeadingZeros<Buffer>>]>;

type Prepare<T extends readonly (string | number)[]> = {
    -readonly [K in keyof T]: T[K] extends string
    ? ParseInteger<T[K]>
    : T[K] extends number
    ? Tuple<T[K]>
    : [];
};

type Counter<T extends unknown[], O extends unknown[] = [], Index extends unknown[] = [], Count = T['length']> =

    Index['length'] extends Count
    ? O['length']
    : T[Index['length']] extends unknown[]
    ? Counter<T, [...O, ...T[Index['length']]], [...Index, unknown]>
    : []

type Solution<T extends Readonly<Array<string | number>>> = Counter<Prepare<T>>

const arrayOfNumbers = [1, "2abc0", "3"] as const;

type a0 = Solution<typeof arrayOfNumbers>;
type a1 = Solution<typeof arrayOfNumbers>; // 6
type a2 = Solution<[1, 2, 3, 4, 5, 6]>; // 21
type a3 = Solution<[1]>; // 1
type a4 = Solution<["1", "2", "3"]>; // 6
type a5 = Solution<["1abc", 2, "3"]>; // 6
type a6 = Solution<[111, 222, 333]>; // 666
type a7 = Solution<[1, 1, 1, 1, 1, 1, 1, 1, 1, 1/* , ... */]>;