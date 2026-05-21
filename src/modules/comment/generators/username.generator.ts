const USERNAME_PREFIXES = [
  "user",
  "kak",
  "checkout",
  "cod",
  "promo",
  "deal",
  "live",
  "murah",
];

const USERNAME_SUFFIXES = [
  "hunter",
  "queen",
  "king",
  "rush",
  "star",
  "crew",
  "zone",
  "vibes",
  "mania",
  "alert",
  "murah",
];

function pickRandomValue(values: readonly string[]): string {
  return values[Math.floor(Math.random() * values.length)];
}

export function generateFakeUsername(): string {
  const pattern = Math.floor(Math.random() * 4);

  switch (pattern) {
    case 0:
      return `user${Math.floor(100 + Math.random() * 900)}`;
    case 1:
      return `${pickRandomValue(USERNAME_PREFIXES)}_${pickRandomValue(
        USERNAME_SUFFIXES,
      )}`;
    case 2:
      return `${pickRandomValue(USERNAME_PREFIXES)}${pickRandomValue(
        USERNAME_SUFFIXES,
      )}`;
    default:
      return `${pickRandomValue(USERNAME_SUFFIXES)}${Math.floor(
        10 + Math.random() * 90,
      )}`;
  }
}
