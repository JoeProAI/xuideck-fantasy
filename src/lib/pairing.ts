/** Circle method. Odd team out plays Desk Seven. */
export function pairings(memberIds: string[], week: number): [string, string][] {
  const ids = [...memberIds].sort();
  if (ids.length === 0) return [];
  if (ids.length === 1) return [[ids[0], "desk"]];
  const circle = [...ids];
  if (circle.length % 2 === 1) circle.push("desk");
  const n = circle.length;
  const rounds = n - 1;
  const rot = ((week % rounds) + rounds) % rounds;
  const fixed = circle[0];
  const rest = circle.slice(1);
  for (let i = 0; i < rot; i++) {
    const x = rest.shift();
    if (x) rest.push(x);
  }
  const ring = [fixed, ...rest];
  const pairs: [string, string][] = [];
  for (let i = 0; i < n / 2; i++) {
    pairs.push([ring[i], ring[n - 1 - i]]);
  }
  return pairs;
}

export function opponentOf(memberIds: string[], me: string, week: number): string {
  const pairs = pairings(memberIds, week);
  for (const [a, b] of pairs) {
    if (a === me) return b;
    if (b === me) return a;
  }
  return "desk";
}
