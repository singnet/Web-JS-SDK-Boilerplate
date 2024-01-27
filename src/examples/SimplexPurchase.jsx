import React, { useEffect } from "react";

const SimplexPurchase = () => {
  useEffect(() => {
    const simplexScriptId = "simplex-script";
    const simplexFormId = "simplex-form";

    // Clear any existing content in the simplex-form div
    const simplexFormDiv = document.getElementById(simplexFormId);
    if (simplexFormDiv) {
      simplexFormDiv.innerHTML = "";
    }

    // Check if the script already exists
    if (!document.getElementById(simplexScriptId)) {
      // Create the script only if it does not exist
      const script = document.createElement("script");
      script.id = simplexScriptId;
      script.src = "https://iframe.sandbox.test-simplexcc.com/form.js";
      script.async = true;
      document.body.appendChild(script);

      // Initialize the Simplex form after the script is loaded
      script.onload = () => {
        if (window.simplex) {
          window.simplex.createForm();
        }
      };
    } else {
      // If the script is already loaded, directly call createForm
      if (window.simplex) {
        window.simplex.createForm();
      }
    }

    return () => {
      // Optional: Cleanup if needed when the component unmounts
    };
  }, []);

  return (
    <div>
      <div id="simplex-form"></div>
      <style id="simplex-css">
        {`.simplex-continue-button {
          background-color: rgba(67,176,42,0.77) !important;
        }`}
      </style>
    </div>
  );
};

export default SimplexPurchase;