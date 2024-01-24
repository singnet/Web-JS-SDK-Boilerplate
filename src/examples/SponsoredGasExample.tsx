import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useNetwork
} from "wagmi";
import contractAbi from "../resources/contracts/polygon-mumbai/0x34bE7f35132E97915633BC1fc020364EA5134863.json";
import { Button, Anchor, Flex, createStyles } from '@mantine/core';
import { Page } from '../Page'
import  '../global.css';

const useStyles = createStyles((theme, _params) => {
  return {
      title: {
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: -1,
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
          marginBottom: theme.spacing.xs,
          fontFamily: `alias`,

          '@media (max-width: 520px)': {
              fontSize: 28,
          },
      },

      button: {
          fontFamily: 'alias',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.md,
            color: theme.black,
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            marginBottom: `${theme.spacing.xs}px`,
            borderRadius: theme.radius.md,
            backgroundColor: "#7F1BA4",
            fontWeight: 500,
            border: '1px solid black',

            '&:hover': {
                backgroundColor: theme.white,
                color: "#7F1BA4",
            },
        },


        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.black,
                color:  "#DAF978",
              
            },
        },

      highlight: {
          color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
      },
      description: {
          textAlign: 'center',
          whiteSpace: 'pre-line',
          '@media (max-width: 520px)': {
              fontSize: theme.fontSizes.md,
          },
      },
  };
});
const description = `You cna configure gas sponsorship for Singularity AI services. Below is a gas sponsorship example for AI service NFT (tokenised)

Try minting some NFTs below, without paying gas!`


export function SponsoredGasExample() {
  const { classes, cx } = useStyles();
  const { address } = useAccount();
  const { chain } = useNetwork()

  const [balanceChanging, setBalanceChanging] = useState(false)


  const { config } = usePrepareContractWrite({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "mint",
    args: [address],
  });
  const { write: mint } = useContractWrite(config);

  const { data: balance = 0, refetch } = useContractRead({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (balance) {
      setBalanceChanging(false)
    }
  }, [balance])

  const interval = useRef<any>()

  const handleClick = useCallback(() => {
    if (mint) {
      setBalanceChanging(true)
      mint()
      interval.current = setInterval(() => {
        refetch()
      }, 1000)
      setTimeout(() => {
        if (interval.current) {
          clearInterval(interval.current)
        }
      }, 100000)
    }
  }, [mint, refetch])

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [balance, interval]);

  return (
    <Page title={"Pay Gas for AI Service"} description={description}>
      <Flex align={'center'} justify={'center'} direction={'column'} gap={'1rem'} style={{ flex: 1 }}>
        <strong style={{ fontSize: '1.5rem' }}>NFT Count</strong>
        <div style={{ fontSize: "2rem", fontWeight: 'medium', width: 100, height: 100, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '10px solid #7F1BA4' }}>{`${balance ?? 0}`}</div>
        <Button
          loading={balanceChanging}
          size={'lg'}
          onClick={handleClick}
          className={classes.button}
        >
          Gas-free Mint
        </Button>
        {chain?.blockExplorers?.default.url && <Anchor href={`${chain?.blockExplorers?.default.url}/address/${address}#tokentxnsErc721`} target="_blank">Block Explorer</Anchor>}
      </Flex>
    </Page>
  );
}
