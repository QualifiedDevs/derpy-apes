//@ts-nocheck
import { ethers } from "ethers";
import { useAtom } from "jotai";

import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import ChooseQuantity from "@components/ChooseQuantity";

import ConnectWallet from "@components/ConnectWallet";
import MintButton from "@components/MintButton";

import { useWeb3 } from "@src/global/web3";

import {
  costResultAtom,
  totalSupplyResultAtom,
  maxSupplyResultAtom,
} from "@src/global/mintContract";

const MintBox = styled((props) => {
  const { signer } = useWeb3();

  const [maxSupplyResult] = useAtom(maxSupplyResultAtom);
  const [totalSupplyResult] = useAtom(totalSupplyResultAtom);
  const [costResult] = useAtom(costResultAtom);

  return (
    <Paper {...props}>
      <Typography className="description" sx={{ mb: 4 }}>
        <b>Derpy Apes</b> is a collection of <b>7,777</b> illustrated apes with
        a signature facial expression. Derp around on the blockchain with us.
        First <b>777</b> mints will be <b>FREE</b>.
      </Typography>
      <Paper className="mint-info" elevation={1} sx={{ mb: 1.5 }}>
        <Typography className="key">NFT Minted</Typography>
        <Typography className="value">
          {totalSupplyResult.data || "..."} / {maxSupplyResult.data || 7777}
        </Typography>
      </Paper>
      <Paper className="mint-info" elevation={1} sx={{ mb: 3 }}>
        <Typography className="key">Price</Typography>
        <Typography className="value">
          {costResult.data ? ethers.utils.formatEther(costResult.data) : 0.024}{" "}
          ETH
        </Typography>
      </Paper>
      {signer ? (
        <>
          <ChooseQuantity sx={{ mb: 3 }} />
          <MintButton variant="contained" sx={{ py: 2.5 }} />
        </>
      ) : (
        <ConnectWallet variant="contained" sx={{ py: 2.5 }} />
      )}
    </Paper>
  );
})`
  background: ${({ theme }) => theme.palette.secondary.dark};
  padding: 2em;
  display: flex;
  flex-direction: column;

  .details {
    color: ${({ theme }) => theme.palette.secondary.light};
  }

  .mint-info {
    background: ${({ theme }) => theme.palette.secondary.main};
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .value {
      font-size: 1.2em;
      font-weight: bold;
      width: fit-content;
      text-align: right;

      margin-left: 1.5em;
    }
  }

  .choose-quantity {
  }

  .connect-button {
    padding: 1.25em;
  }

  .presale-authorization {
    background: ${({ theme }) => theme.palette.primary.dark};
    padding: 1.5em;
    text-align: center;
    font-size: 1em;
    font-weight: semi-bold;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.primary.main};
  }

  .total-minted {
    text-align: center;
    color: ${({ theme }) => theme.palette.secondary.light};
  }
`;

export default MintBox;
