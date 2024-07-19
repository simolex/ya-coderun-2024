type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Data = string | number;

type ParseInteger<
    S extends string,
    L extends string = "",
    Buffer extends string = "",
    Result extends number[] = []
> = S extends `${L}${infer C}${any}`
    ? C extends ""
        ? Result
        : C extends Digit
        ? ParseInteger<S, `${L}${C}`, `${Buffer}${C}`, Result>
        : Buffer extends ""
        ? ParseInteger<S, `${L}${C}`, "", [...Result]>
        : ParseInteger<S, `${L}${C}`, "", [...Result, Num<RemoveLeadingZeros<Buffer>>]>
    : Buffer extends ""
    ? Result
    : [...Result, Num<RemoveLeadingZeros<Buffer>>];

type TrimStart<S extends string, Start extends string> = S extends `${Start}${infer End}`
    ? End
    : "";

type Num<S extends string> = S extends number
    ? S
    : S extends `${infer N extends number}`
    ? number extends N
        ? never
        : N
    : never;

type Tuple<N, T extends any[] = []> = T["length"] extends N ? T : Tuple<N, [0, ...T]>;

type Sum<A extends number, B extends number> = [...Tuple<A>, ...Tuple<B>]["length"] & number;

type su = Sum<333, 222>;

type RemoveLeadingZeros<T extends string> = T extends "0"
    ? T
    : T extends `${0}${infer Rest}`
    ? RemoveLeadingZeros<Rest>
    : T;
type q1 = RemoveLeadingZeros<"0001">;
type q2 = ParseInteger<"2abc000">;

type n = Num<q2>;
type s = ParseInteger<"00001">;

type Prepare<T extends readonly (string | number)[]> = {
    [K in keyof T]: T[K] extends string ? ParseInteger<T[K]> : T[K];
};

type Solution<T extends readonly (string | number)[]> = Solution_<Prepare<T>>;

type Solution_<
    T extends readonly (string | number)[],
    Vizited extends keyof T = never,
    Result extends number = 0
> = Exclude<keyof T, Vizited> extends infer I extends keyof T
    ? T[I] extends number
        ? Solution_<T, Vizited | I, Sum<Result, T[I]>>
        : Solution_<T, Vizited | I, Result> //Sum<Result, Solution<T[I]>>
    : Result;
// type Solution<T extends unknown, Result extends number = 0 > =
//   T extends [infer I, ...infer Rest]
//     ? I extends number
//       ? Solution<Rest, Sum<Result, I>>
//       : I extends string
//           ? Num< I > extends infer N

//             ? N extends number
//               ? Solution<Rest, Sum<Result, N>>
//               : Solution<Rest, Result >
//             :Solution<[...Rest, ...ParseInteger<I&string>]>
//       : Solution<Rest, Result >
//     : Result;

type eq = Prepare<["4", 1, 1, 2, "2", "3"]>;
type eq2 = Prepare<e>;

const arrayOfNumbers = [1, "2abc0", "3"] as const;

type e = typeof arrayOfNumbers;

type weq = Solution<typeof arrayOfNumbers>;
type weq0 = Solution<["4", 1, 1, 2, "2", "3"]>;
