import React, { useEffect } from 'react';

const SimplexPurchase = ({defaultAmount}) => {
  useEffect(() => {
    // Construct the Simplex URL with parameters
    const simplexURL = 'https://iframe.simplex-affiliates.com/form.js';
    const params = new URLSearchParams({
      crypto: 'AGIX',
      fiat: 'EUR',
      amount: defaultAmount || '200', // Default amount if not provided
    });

    const simplexScriptId = 'simplex-script';

    // Check if script already exists and remove it
    const existingScript = document.getElementById(simplexScriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Load Simplex iFrame script with parameters
    const script = document.createElement('script');
    script.src = `${simplexURL}?${params.toString()}`;
    console.log("Script url for simplex integration: "+ script.src);
    script.async = true;
    document.body.appendChild(script);

    // Initialize the Simplex form after the script is loaded
    script.onload = () => {
      if (window.simplex) {
        window.simplex.createForm();
      }
    };

    return () => {
     // Remove the script when the component unmounts
     const scriptToRemove = document.getElementById(simplexScriptId);
     if (scriptToRemove) {
       scriptToRemove.remove();
     }
   };
  }, [defaultAmount]);

  return <div id="simplex-form"></div>;
};

export default SimplexPurchase;
