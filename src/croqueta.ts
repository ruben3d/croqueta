
export const VersionMajor: number = 0;
export const VersionMinor: number = 0;
export const VersionRev: number = 1;
export const VersionDev: boolean = true;
export const Version: string = "" + VersionMajor + "." + VersionMinor + "." + VersionRev + (VersionDev ? "-dev" : "");

export * from "./base/ArrayList"
export * from "./base/Assert"
export * from "./base/Cloneable"
export * from "./base/Context"
export * from "./base/Copyable"
export * from "./base/Exceptions"
export * from "./base/IterableCollection"
export * from "./base/Option"
export * from "./base/Try"
export * from "./container/Container"
export * from "./math/math"
export * from "./math/Matrix"
export * from "./math/Point"
export * from "./math/Ray"
export * from "./math/Vector"

console.log("croqueta " + Version);
