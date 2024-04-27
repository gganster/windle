import React, { useState, useEffect } from 'react';
import useWindleCtx from './hooks/useWindleCtx';
import usePWA from './hooks/usePWA';

function App() {
  const { ctx, initGame, endGame } = useWindleCtx();
  const { installPWA, isPWA } = usePWA();

  useEffect(() => console.log(ctx), [ctx]);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className='flex flex-row justify-center items-center border-b w-full h-32'>
        <div className="relative">
          <h1 className="text-4xl font-bold underline text-center">WINDLE</h1>
          <h3 className="-rotate-3 mt-3 bg-slate-900 text-white px-2 pt-1">The Next Gen multi-window Wordle</h3>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl mb-4">How to start ?</h3>

        {/* Install PWA */}
        <span>1 - Click <span onClick={installPWA} className="text-white bg-slate-900 pt-1 px-1 underline cursor-pointer">here</span> to install web app in PWA mode.</span>
        <span> Status : {isPWA ? <span className='font-semibold text-green-400'>ON</span>: <span className='font-semibold text-red-600'>OFF</span>}</span>

        <p className="mt-2">
          2 - Check you windows is in your main monitor (the new window API doesn&apos;t work with side monitors)
        </p>

        <p className="mt-2">
          3 - Click on the button below to start the game
        </p>

        <p className="mt-2">
          PS: if popups only one popup appears, add autorisations to app to launch multiple popups (asked in browser navbar)
        </p>

        {ctx.wordleState === "waiting" ?
          <div className='flex items-center flex-col mt-2'>
            <button onClick={initGame} className="bg-slate-900 text-white px-4 py-2 rounded-lg mt-2">Start Game</button>
            {!isPWA && <span className='text-red-600 ml-2 text-xs mt-2'>PWA is not installed, the app may no work</span>}
          </div>
        : 
          <div className='flex items-center flex-col mt-6'>
            <button onClick={endGame} className="bg-slate-900 text-white px-4 py-2 rounded-lg mt-2">End Game</button>
          </div>
        }

      </div>
    </div>
  );
}

export default App;
