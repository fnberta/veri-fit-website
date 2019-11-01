export type UnionKeys<T> = T extends any ? keyof T : never;

export type UnionPick<T, K extends UnionKeys<T>> = T extends any ? Pick<T, Extract<K, keyof T>> : never;
