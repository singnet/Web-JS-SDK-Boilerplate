import { Button } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { ReactComponent as SingularityNetIcon } from "resources/assets/images/singularity-net.svg";
import { OnrampWebSDK } from '@onramp.money/onramp-web-sdk';
import { useAccount } from "wagmi";
import styles from "./TokenPurchase.styles";

const TokenPurchase = () => {
  const { classes } = styles();
  const { address } = useAccount();
  const onrampInstance = useRef(null);


  useEffect(() => {
    if (!address) return;
    onrampInstance.current = new OnrampWebSDK({
      appId: 1, // replace this with the appID you got during onboarding process
      walletAddress: address, // replace with user's wallet address
      flowType: 1, // 1 -> onramp || 2 -> offramp || 3 -> Merchant checkout
      fiatType: 3, // 1 -> INR || 2 -> TRY || 3 -> AED || 4 -> MXN || 5-> VND || 6 -> NGN etc. visit Fiat Currencies page to view full list of supported fiat currencies
      paymentMethod: 1, // 1 -> Instant transafer(UPI) || 2 -> Bank transfer(IMPS/FAST)
      coinCode: "AGIX", // replace with the coin code you want to buy
    });
    onrampInstance.current.show();

  }, [address])

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
    </div>
  );
};

export default TokenPurchase;
