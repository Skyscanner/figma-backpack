export const kebabToCamelCase = (str: string): string =>
  str.replace(/-([a-z])/g, (_match, char) => char.toUpperCase());
