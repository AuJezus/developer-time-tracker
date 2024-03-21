export function snakeToCamel(s) {
  return s.replace(/(_\w)/g, (k) => k[1].toUpperCase());
}

export function snakeToCamelObj(obj) {
  const converted = Object.entries(obj).reduce(
    (x, [k, v]) => (x[snakeToCamel(k)] = v) && x,
    {}
  );
  return converted;
}
