import { Button, createStyles } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { ReactComponent as SingularityNetIcon } from "../resources/assets/images/singularity-net.svg";
import { OnrampWebSDK } from '@onramp.money/onramp-web-sdk';
import { useAccount } from "wagmi";

let simplexLoaded = false;

const useStyles = createStyles((theme, _params) => {
  return {
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 400px",
      gap: "1rem",
      height: "calc(100vh - 6rem)",
      img: {
        width: '100%'
      }
    },
    buyToken: {
      background: 'var(--color-gray)',
      borderRadius: 'var(--border-radius)',
      padding: '1rem',
    },
    heading: {
      display: "flex",
      alignItems: "center",
      gap: '0.7rem',
      fontWeight: 400,
      margin: '0',
      marginBottom: '2rem'
    },
    thumbnail: {
      display: "inline-flex",
      alignItems: "flex-start",
      borderRadius: "10px",
      overflow: "hidden"
    }
  }
});

const SimplexPurchase = () => {
  const { classes, cx } = useStyles();
  const { address } = useAccount();
  const onrampInstance = useRef(null);


  useEffect(() => {
    if(!address) return;
    onrampInstance.current = new OnrampWebSDK({
      appId: 1, // replace this with the appID you got during onboarding process
      walletAddress: address, // replace with user's wallet address
      flowType: 1, // 1 -> onramp || 2 -> offramp || 3 -> Merchant checkout
      fiatType: 3, // 1 -> INR || 2 -> TRY || 3 -> AED || 4 -> MXN || 5-> VND || 6 -> NGN etc. visit Fiat Currencies page to view full list of supported fiat currencies
      paymentMethod: 1, // 1 -> Instant transafer(UPI) || 2 -> Bank transfer(IMPS/FAST)
      coinCode: "AGIX", // replace with the coin code you want to buy
    });
    onrampInstance.current.show();
    
  },[])

  // useEffect(() => {
  //   if(simplexLoaded) return;
  //   simplexLoaded = true;
  //   const simplexScriptId = "simplex-script";
  //   const simplexFormId = "simplex-form";

  //   // Clear any existing content in the simplex-form div
  //   const simplexFormDiv = document.getElementById(simplexFormId);
  //   if (simplexFormDiv) {
  //     simplexFormDiv.innerHTML = "";
  //   }

  //   // Check if the script already exists
  //   if (!document.getElementById(simplexScriptId)) {
  //     // Create the script only if it does not exist
  //     const script = document.createElement("script");
  //     script.id = simplexScriptId;
  //     script.src = "https://iframe.sandbox.test-simplexcc.com/form.js";
  //     script.async = true;
  //     document.body.appendChild(script);

  //     // Initialize the Simplex form after the script is loaded
  //     script.onload = () => {
  //       if (window.simplex) {
  //         window.simplex.createForm();
  //       }
  //     };
  //   } else {
  //     // If the script is already loaded, directly call createForm
  //     if (window.simplex && !simplexLoaded) {
  //       window.simplex.createForm();
  //     }
  //   }

  //   return () => {
  //     // Optional: Cleanup if needed when the component unmounts
  //     simplexLoaded = false;
  //     window.simplex = undefined;
  //   };
  // }, []);

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.buyToken}>
          <h3 className={classes.heading}><SingularityNetIcon /> Buy AGIX Token</h3>
          <Button
            variant="filled"
            color="rgba(127, 27, 164, 1)"
            className="btn-primary btn-medium"
            onClick={() => {
              onrampInstance?.current?.show();
            }}
          >
            Buy Now
          </Button>
          <div id="simplex-form"></div>
        </div>
        <div>
          <a
            className={classes.thumbnail}
            href="https://blog.singularitynet.io/what-is-agix-singularitynets-native-token-explained-d82e37e0d76a"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/snet-thumbnail.jpg" alt="" />
          </a>
        </div>
      </div>
      <style id="simplex-css">
        {`
        body {
          background: #161618 !important;
        }
        #simplex-iframe-form {
          background: #161618;
          border-radius: 10px;
        }
        .simplex-continue-button {
          background-color: rgba(67,176,42,0.77) !important;
        }
        .form-group.crypto {
          margin: 0;
        }
        .form-control {
          border-radius: 10px !important;
          border: 1px solid rgba(41, 41, 47, 0.70) !important;
          background: #232427 !important;
        }
        .simplex-dd-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          width: 100%;
          max-width: 100%;
        }
        .dropdown-btn {
          background: #232427;
          border: 0;
          border-radius: 10px;
          margin: 0;
          height: 45px;
          margin-left: 1rem;
          color: #fff;
          font-size: 0.8rem;
        }
        .simplex-address-container {
          width: 102%;
          max-width: unset;
        }
        .simplex-address-container > div {
          margin: 0;
        }
        .simplex-address-container > div > div > div {
          padding-right: 0;
        }
        .crypto-address {
          margin-left: 0;
          width: 100%;
          max-width: 100%;
          flex: 0 0 100%;
        }
        .address-disclaimer {
          padding-left: 0;
          color: #fff;
          opacity: 0.4;
          font-weight: 400;
        }
        .d-flex.flex-row.sm-padding-top > div {
          padding-left: 0;
          margin-top: 1rem;
        }
        .wallet-url-container{
          display: none;
        }
        .simplex-continue-button {
          background-color: #7f1ba4 !important;
          border-radius: 10px !important;
          height: 3rem;
          color: #fff;
          min-width: 171px;
          border: 0;
        }
        .simplex-continue-button:hover {
          background-color: #fff !important;
          color: #7f1ba4;
        }
        .autocomplete-results {
          border: 1px solid #232427;
          background-color: #232427;
          color: #8f8c8c;
        }
        .autocomplete-results li:hover {
          background-color: #161618;
          color: #fff;
        }
        .custom-button {
          box-shadow: none !important;
        }
        `}
      </style>
    </div>
  );
};

export default SimplexPurchase;
