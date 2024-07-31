/**
 *
 * type OnMessage<T> = (message: T) => void;
 * type AddTimeout<T> = (chatName: string, timeoutMs: number) => OnMessage<T>;
 * type RemoveTimeout = (chatName: string) => void;
 * type SummaryFn<T> = (data: Record<string, T>) => void;
 *
 * function solution<T>(
 *  sendNotification: SummaryFn<T>
 * ): [AddTimeout<T>, RemoveTimeout<T>] {
 *  // your code here
 * }
 */

function solution(callback) {}

module.exports = solution;
