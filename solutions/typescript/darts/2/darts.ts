export const score = (x: number, y: number) => {
  const square_distance = x ** 2 + y ** 2
  if (square_distance > 100)
    return 0;
  if (square_distance > 25)
    return 1;
  if (square_distance > 1)
    return 5;
  return 10;
}
