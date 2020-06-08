export function getSum(array: any) {
  let sum = 0;
  array.forEach((item: number) => {
    sum += item;
  });
  return sum;
};