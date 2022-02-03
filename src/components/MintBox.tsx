//@ts-nocheck

import React, { useContext } from "react";

import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import ChooseQuantity, { QuantityContext } from "@components/ChooseQuantity";

import ConnectWallet from "@components/ConnectWallet";
import FreeMint from "@components/FreeMint";
import MultiButton from "@components/MultiButtons";

import useWeb3 from "@hooks/useWeb3";

const MintBox = styled((props) => {
  const { maxQuantity } = useContext(QuantityContext);

  return (
    <Paper {...props}>
      <Typography className="description" sx={{ mb: 2 }}>
        <b>Derpy Apes</b> is a collection of <b>7,777</b> illustrated apes with a signature facial expression. Derp around on the blockchain with us. First <b>777</b> mints will be <b>FREE</b>.
      </Typography>
      {/* <Typography>
        First <b>800 FREE</b>{" "}
        <span className="details">(max. 1 NFT / tx.)</span>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Then <b>0.039 Ξ each</b>{" "}
        <span className="details">(max. {maxQuantity} NFT / tx.)</span>
      </Typography> */}
      <Paper className="mint-info" elevation={1} sx={{ mb: 1.5 }}>
        <Typography className="key">NFT Minted</Typography>
        <Typography className="value">
          {0}/{7777}
        </Typography>
      </Paper>
      <Paper className="mint-info" elevation={1} sx={{ mb: 2.5 }}>
        <Typography className="key">Price</Typography>
        <Typography className="value">
          0.024 ETH <wbr /> or 12 LOOKS
        </Typography>
      </Paper>
      {/* <Typography className="total-minted">
        My total NFT minted (0 / {maxQuantity})
      </Typography> */}
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
    color: ${({theme}) => theme.palette.primary.main}
  }

  .total-minted {
    text-align: center;
    color: ${({ theme }) => theme.palette.secondary.light};
  }
`;

export default MintBox;
