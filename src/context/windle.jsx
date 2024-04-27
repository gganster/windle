import { createContext, useContext, useEffect, useState } from "react";
import * as PT from "prop-types";
import { checkGuess as helpCheckGuess } from "../helper/windle";
import useWindows from "../hooks/useWindows";
import WORDS from "../WORDS";

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
    if (ctx.guesses.length === 6) return console.log("no more guesses");

    const res = helpCheckGuess(ctx.currentGuess, ctx.solution);

    setCtx({
      ...ctx,
      guesses: [...ctx.guesses, res],
      history: [...ctx.history, ctx.currentGuess],
      currentGuess: "",
      wordleState: res.filter(r => r.color === "green").length === 5 ? "won" : ctx.guesses.length === 6 ? "lost" : "playing"
    });
  }

  /*-------------------- RENDER MANAGER -------------------------*/
  const { openWindows, closeAllWindows, setWindowState} = useWindows({onKeyPress: _keyPressDispatcher});

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
        console.log("setting", i, ctx.currentGuess.length, "white", " ");
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
      //solution: WORDS[Math.floor(Math.random() * WORDS.length)],
      solution: "belle",
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