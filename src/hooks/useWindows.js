import React, {useState, useEffect} from "react";

const numRows = 6;
const numCols = 5;
const length = 100;

export default function useWindows({
  onKeyPress,
}  = {}) {
  const [windows, setWindows] = useState([]);

  useEffect(() => {
    function handle(e) {
      onKeyPress(e);
    }
    window.document.addEventListener("keydown", handle);
    return () => window.document.removeEventListener("keydown", handle);
  }, [onKeyPress])

  const openWindows = () => {
    const openedWindows = [];

    for (let row = 0; row < numRows; row++) {
      const winRow = [];
      for (let col = 0; col < numCols; col++) {
        const left = col * length * 1.6;
        const top = row * length * 1.6;
        const newWindow = window.open(
          'about:blank', 
          `_blank`, 
          `personalbar=no,popup=yes,address=no,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=no,width=${length},height=${length},top=${top},left=${left}`
        );
        _configureNewWindow(newWindow);
        winRow.push(newWindow);
      }
      openedWindows.push(winRow);
    }
    setWindows(openedWindows);
  };

  const _configureNewWindow = (win) => {
    win.document.body.style = "margin: 0; padding: 0;"
    win.document.body.innerHTML = `
      <div id="root" style="background-color: white; color: black; display: flex; justify-content: center; align-items: center; position: absolute; top:0; left:0; right:0; bottom:0; ; font-size: 2em; transition: all 1s;">
      </div>
    `;
    win.document.addEventListener("keydown", (e) => {
      onKeyPress(e);
    });
  }

  const displayState = () => {
    console.log(windows);
  }

  const closeAllWindows = () => {
    windows.forEach(win => {
      win.forEach(w => {
        if (!w.closed) {
          w.close();
        }
      });
    });
    setWindows([]);
  };

  const setWindowState = (row, col, color, letter) => {
    const win = windows[row][col];
    if (win && !win.closed) {
      win.document.getElementById('root').style.backgroundColor = 
        color === "green" ? "#6baa65" :
        color === "yellow" ? "#cab459" :
        color === "grey" ? "#777c7f" : color;
      if (color === "white") {
        win.document.getElementById('root').style.color = "black";
      } else {
        win.document.getElementById('root').style.color = "white";
      }
      win.document.getElementById('root').innerText = letter;
    }
  }

  return {
    openWindows,
    closeAllWindows,
    displayState,
    setWindowState
  };
}