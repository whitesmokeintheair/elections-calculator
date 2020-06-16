export function getSum(array: any) {
  let sum = 0;
  array.forEach((item: number) => {
    sum += Math.floor(item);
  });
  return sum;
};

function getDecimal(num: number) {
  var result;
  var initialNum = Math.abs(num);
  var roundedNum = Math.round(initialNum);

  if (roundedNum > initialNum) {
      result = roundedNum - initialNum - 1;
      result = Math.abs(result);
      result = +result.toFixed(10);
  }
  else {
      result = initialNum - roundedNum;
      result = +result.toFixed(10);
  }
  return result;
}

export function calculateOtherMandates (additionalMandatesWithMandatesSum: number[], additionalMandates: number[], mandates: number) {
  const all = getSum(additionalMandatesWithMandatesSum)
  
  const diff = mandates - all
  console.log(mandates, all, diff)

  for (let i = 0; i < diff; i++) {
    let maxVal = 0
    let maxIndex = -1;
    additionalMandates.forEach((val, i) => {
      const calcVal = getDecimal(val)
      if (maxVal < calcVal && maxIndex !== i) {
        maxVal = calcVal
        maxIndex = i
      }
    })
    console.log(maxVal, maxIndex)
    additionalMandates[maxIndex] = Math.floor(additionalMandates[maxIndex] + 1);
    additionalMandatesWithMandatesSum[maxIndex] = Math.floor(additionalMandatesWithMandatesSum[maxIndex] + 1);
  }
}