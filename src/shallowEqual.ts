export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  let keysA = Object.keys(a);
  let keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let key of keysA) {
    if (
      !Object.hasOwn(b, key) ||
      !Object.is(a[key as keyof typeof a], b[key as keyof typeof b])
    ) {
      return false;
    }
  }

  return true;
}
