export const toEnum = <T extends { [key: string]: string }>(
  enumObj: T,
  key: string,
): T[keyof T] | undefined => {
  // Try matching against keys first (case-insensitive)
  const matchedKey = Object.keys(enumObj).find(
    (tempKey) => tempKey.toLowerCase() === key.toLowerCase(),
  );
  if (matchedKey) return enumObj[matchedKey as keyof T];

  // If no match, try matching against values (case-insensitive)
  const matchedValue = Object.values(enumObj).find(
    (tmpValue) => tmpValue.toLowerCase() === key.toLowerCase(),
  );
  if (matchedValue) return matchedValue as T[keyof T];

  return undefined; // not found
};
