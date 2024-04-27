import { createContext, useContext, useEffect, useState } from "react";
import * as PT from "prop-types";
import { checkGuess as helpCheckGuess } from "../helper/windle";
import useWindows from "../hooks/useWindows";
import WORDS from "../WORDS";
import sleep from "../helper/sleep";

const WindleContext = createContext();
const defaultState = {
  //global
  pwaInitialized: true,//TODO
  windowsInitialized: false,

  //wordle
  wordleState: "waiting",// "waiting" | "playing" | "won" | "lost"
  solution: 'arbre',
  currentGuess: "", //[0-5char]
  guesses: [], //max 6: [char: 'c', color: 'green' | 'yellow' | 'grey']
  history: [], //all previous guesses, can be calculated from guesses
};
  
export function WindleProvider({ children }) {
  const [ctx, setCtx] = useState(defaultState);
  
  /*--------------------- EVENT MANAGER ------------------------*/
  
  const _keyPressDispatcher = (e) => {
    if (e.key === "Enter") return checkGuess();
    if (e.key === "Backspace") return delChar();
    if (e.keyCode < 65 || e.keyCode > 90) return;

    console.log(String.fromCharCode(e.keyCode).toLowerCase());
    addChar(String.fromCharCode(e.keyCode).toLowerCase());
  }
  const addChar = (c) => {
    if (ctx.currentGuess.length < 5 && ctx.guesses.length < 6)
      setCtx({...ctx, currentGuess: ctx.currentGuess + c});
  }
  const delChar = () => {
    if (ctx.currentGuess.length > 0) {
      const newGuess = ctx.currentGuess.slice(0, -1);
      setCtx({...ctx, currentGuess: newGuess});
    }
  }
  const checkGuess = () => {
    if (ctx.currentGuess.length !== 5) return console.log("invalid guess");

    const res = helpCheckGuess(ctx.currentGuess, ctx.solution);
    const newState = res.filter(r => r.color === "green").length === 5 ? "won" : 
                     ctx.history.length === 5 ? "lost" 
                     : "playing";

    setCtx({
      ...ctx,
      guesses: [...ctx.guesses, res],
      history: [...ctx.history, ctx.currentGuess],
      currentGuess: "",
      wordleState: newState
    });

    if (newState === "won") wonAnimation();
    if (newState === "lost") loseAnimation();
  }

  /*-------------------- RENDER MANAGER -------------------------*/
  const { openWindows, closeAllWindows, setWindowState} = useWindows({onKeyPress: _keyPressDispatcher});

  const wonAnimation = async () => {
    //display "you won" in the center of the screen
    await sleep(500);
  
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        setWindowState(
          i, 
          j, 
          "green",
          i === 1 && j === 1 ? "Y" : 
          i === 1 && j === 2 ? "O" :
          i === 1 && j === 3 ? "U" :
          i === 2 && j === 1 ? "W" :
          i === 2 && j === 2 ? "O" :
          i === 2 && j === 3 ? "N" :
          " "
        );
        await sleep(200);
      }
    }
  }

  const loseAnimation = async () => {
    //display "you won" in the center of the screen
    await sleep(500);
  
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        setWindowState(
          i, 
          j, 
          "red",
          i === 1 && j === 1 ? "Y" : 
          i === 1 && j === 2 ? "O" :
          i === 1 && j === 3 ? "U" :
          i === 2 && j === 1 ? "L" :
          i === 2 && j === 2 ? "O" :
          i === 2 && j === 3 ? "S" :
          i === 2 && j === 4 ? "E" :
          " "
        );
        await sleep(200);
      }
    }
  }

  useEffect(() => {
    if (!ctx.pwaInitialized || !ctx.windowsInitialized || ctx.wordleState === "waiting") return;

    ctx.guesses.forEach((guess, i) => {
      guess.forEach((c, j) => {
        setWindowState(i, j, c.color, c.char);
      })
    })
    //if necessary, print current guess
    if (ctx.guesses.length < 6 && ctx.currentGuess.length >= 0) {
      for (let i = 0; i < 6; i++) {
        setWindowState(ctx.guesses.length, i, "white", " ");
      }
      ctx.currentGuess.split("").forEach((c, i) => {
        setWindowState(ctx.guesses.length, i, "white", c);
      })
    }
  }, [ctx.pwaInitialized, ctx.windowsInitialized, ctx.wordleState, ctx.guesses, ctx.currentGuess, setWindowState ])

  /*--------------------- GAME MANAGER ------------------------*/

  const initGame = () => {
    openWindows();
    setCtx({
      ...ctx,
      windowsInitialized: true,
      wordleState: "playing",
      solution: WORDS[Math.floor(Math.random() * WORDS.length)],
      //solution: "ville",
      currentGuess: "",
      guesses: [],
      history: []
    });
    console.log("Solution is:", ctx.solution);
  }
  const endGame = () => {
    closeAllWindows();
    setCtx({
      ...ctx,
      windowsInitialized: false,
      wordleState: "waiting",
      currentGuess: "",
      guesses: [],
      history: []
    });
  }

  return (
    <WindleContext.Provider value={{
      ctx,
      initGame,
      endGame,
    }}>
      {children}
    </WindleContext.Provider>
  );
}

WindleProvider.propTypes = {
  children: PT.node.isRequired,
};

export default WindleContext;