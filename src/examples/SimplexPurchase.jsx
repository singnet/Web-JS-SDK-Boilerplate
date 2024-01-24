import React, { useEffect } from 'react';

const SimplexPurchase = () => {
  useEffect(() => {
    const simplexScriptId = 'simplex-script';

    // Check if the script already exists, if so, do not add it again
    if (!document.getElementById(simplexScriptId)) {
      // Create the script only if it does not exist
      const script = document.createElement('script');
      script.id = simplexScriptId; // Assign a unique ID to the script
      script.src = 'https://iframe.sandbox.test-simplexcc.com/form.js';
      script.async = true;
      document.body.appendChild(script);

      // Initialize the Simplex form after the script is loaded
      script.onload = () => {
        if (window.simplex) {
          window.simplex.createForm();
        }
      };
    }

    return () => {
      // Remove the script when the component unmounts
      const scriptToRemove = document.getElementById(simplexScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return <div id="simplex-form"></div>;
};

export default SimplexPurchase;
