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
import { ConstructionOutlined } from "@mui/icons-material";

const MintBox = styled((props) => {
  const { maxQuantity } = useContext(QuantityContext);

  const { connected, presaleWhitelistAuth, maxSupply, totalSupply, maxPerTxn } = useWeb3();

  return (
    <Paper {...props}>
      <Typography className="description" sx={{ mb: 2 }}>
        <b>Anatomy Science Ape Club</b> is a collection of 8,000 anatomical
        mortal apes dissected through the organs. Explore what your ape is
        really made of inside out.
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
        <Typography className="value">{totalSupply || "... "}/{maxSupply || " ..."}</Typography>
      </Paper>
      <Paper className="mint-info" elevation={1} sx={{ mb: 2.5 }}>
        <Typography className="key">Price</Typography>
        <Typography className="value">0.039 Ξ</Typography>
      </Paper>
      {connected ? (
        presaleWhitelistAuth ? (
          <Box className="connected-content">
            <ChooseQuantity
              className="choose-quantity"
              sx={{ mt: "auto", mb: 1.5 }}
            />
            <MultiButton
              variant="contained"
              className="multi-button"
              sx={{ mb: 2 }}
            />
          </Box>
        ) : (
          <Paper className="presale-authorization" sx={{mb: 2}}>
            {presaleWhitelistAuth === undefined
              ? "Loading..."
              : "Whitelist Denied"}
          </Paper>
        )
      ) : (
        <ConnectWallet variant="contained" className="connect-button" sx={{mb: 2}}/>
      )}
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
    }
  }

  .choose-quantity {
  }

  .connect-button {
    padding: 1.25em;
  }

  .connected-content {
  }

  .presale-authorization {
    background: ${({ theme }) => theme.palette.primary.dark};
    padding: 1.5em;
    text-align: center;
    font-size: 1em;
    font-weight: semi-bold;
    text-transform: uppercase;
    color: #ffffff;
  }

  .total-minted {
    text-align: center;
    color: ${({ theme }) => theme.palette.secondary.light};
  }
`;

export default MintBox;
