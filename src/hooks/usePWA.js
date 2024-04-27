import { useEffect, useState } from "react";

const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const checkPWA = () => {
      //check if the browser is PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsPWA(isStandalone);
    }
    const id = setInterval(() => {
      checkPWA();
    }, 1000)
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function beforeinstallprompt(e) {
      e.preventDefault();
      setInstallPrompt(e);
      const promptEvent = e;
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
      });
    }

    window.addEventListener('beforeinstallprompt', beforeinstallprompt);
    return () => window.removeEventListener('beforeinstallprompt', beforeinstallprompt);
  }, [])

  const installPWA = async () => {
    if (!installPrompt) return;

    const res = await installPrompt.prompt();
    if (res.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
  }

  return { installPWA, isPWA };
}

export default usePWA;