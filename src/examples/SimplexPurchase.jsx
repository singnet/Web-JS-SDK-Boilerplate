import React, { useEffect } from 'react';

const SimplexPurchase = () => {
  useEffect(() => {
    // ID for the simplex form script
    const simplexFormScriptId = 'simplex-form-script';
    // ID for the simplex checkout script
    const simplexCheckoutScriptId = 'simplex-checkout-script';

    // Load Simplex Form Script
    const loadSimplexFormScript = () => {
      if (!document.getElementById(simplexFormScriptId)) {
        const script = document.createElement('script');
        script.id = simplexFormScriptId;
        script.src = 'https://iframe.simplex-affiliates.com/form.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.simplex) {
            window.simplex.createForm();
          }
        };
      }
    };

    // Load Simplex Checkout Script
    const loadSimplexCheckoutScript = () => {
      if (!document.getElementById(simplexCheckoutScriptId)) {
        const script = document.createElement('script');
        script.id = simplexCheckoutScriptId;
        script.src = 'https://checkout.simplexcc.com/splx.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Load both scripts
    loadSimplexFormScript();
    loadSimplexCheckoutScript();

    return () => {
      // Remove the scripts when the component unmounts
      const formScriptToRemove = document.getElementById(simplexFormScriptId);
      if (formScriptToRemove) {
        formScriptToRemove.remove();
      }

      const checkoutScriptToRemove = document.getElementById(simplexCheckoutScriptId);
      if (checkoutScriptToRemove) {
        checkoutScriptToRemove.remove();
      }
    };
  }, []);

  return <div id="simplex-form"></div>;
};

export default SimplexPurchase;
