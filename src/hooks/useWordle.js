import { useState } from 'react';

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]); // Crée un tableau de 6 éléments vides
  const [history, setHistory] = useState([]); // Stocke tous les essais précédents
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({}); // { a: 'grey', b: 'green', ... }

  // Ajouter un caractère au mot actuel
  const addChar = (char) => {
    if (currentGuess.length < 5 && turn < 6) {
      setCurrentGuess(currentGuess + char);
    }
  };

  // Supprimer le dernier caractère du mot actuel
  const delChar = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  // Vérifier le mot actuel
  const checkGuess = () => {
    if (currentGuess.length !== 5) {
      alert('Le mot doit contenir exactement 5 lettres.');
      return;
    }
    if (history.includes(currentGuess)) {
      alert('Vous avez déjà essayé ce mot.');
      return;
    }

    // Création d'un tableau de résultats pour chaque lettre
    const comparisonResult = currentGuess.split('').map((char, i) => {
      if (char === solution[i]) {
        return 'green';
      } else if (solution.includes(char)) {
        return 'yellow';
      } else {
        return 'grey';
      }
    });
    console.log(comparisonResult);

    // Mise à jour de l'état du jeu
    setGuesses(guesses.map((g, index) => (index === turn ? currentGuess : g)));
    setHistory([...history, currentGuess]);
    setUsedKeys(prev => ({
      ...prev,
      ...currentGuess.split('').reduce((acc, char, i) => {
        const color = comparisonResult[i];
        return {
          ...acc,
          [char]: prev[char] ? (prev[char] === 'green' ? 'green' : color) : color
        };
      }, {})
    }));
    console.log(history);

    if (currentGuess === solution) {
      setIsCorrect(true);
    }

    setTurn(turn + 1);
    setCurrentGuess('');
  };

  return {
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    addChar,
    delChar,
    checkGuess,
  };
};

export default useWordle;
