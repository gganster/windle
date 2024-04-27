
export const checkGuess = (currentGuess, solution) => {
  
  return currentGuess.split('').map((c, i) => {
    if (c === solution[i]) {
      return {char: c, color: "green"};
    } else if (solution.includes(c)) {
      return {char: c, color: "yellow"};
    } else {
      return {char: c, color: "grey"};
    }
  });
}//{char: "c", color: "red"} * 5[]