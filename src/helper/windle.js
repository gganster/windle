
const _countLetters = (words) => {
  return words.split('').reduce((acc, letter) => {
    acc[letter] = acc[letter] ? acc[letter] + 1 : 1;
    return acc;
  }, {});
}

export const checkGuess = (currentGuess, solution) => {
  let res = currentGuess.split("").map((c) => ({
    char: c,
    color: "grey",
  }));
  let lettersCount = _countLetters(solution);

  //check green in first (right letter, right place)
  res = res.map((r, i) => {
    if (r.char === solution[i]) {
      lettersCount[r.char]--;
      return {...r, color: "green"};
    }
    return r;
  });

  //check yellow in second (right letter, wrong place), if not green
  res = res.map((r) => {
    if (r.color === "red" && lettersCount[r.char] > 0) {
      lettersCount[r.char]--;
      return {...r, color: "yellow"};
    }
    return r;
  });


  return res;
}//{char: "c", color: "#000"} * 5[]