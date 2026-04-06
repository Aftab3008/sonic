export function getFocus(
  fi: number,
  ti: number,
  p: number,
  index: number,
): number {
  "worklet";
  if (fi === ti) return index === fi ? 1 : 0;
  if (index === fi) return 1 - p;
  if (index === ti) return p;
  return 0;
}
