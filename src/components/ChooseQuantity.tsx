//@ts-nocheck

import React, { createContext, useContext, useState, useEffect } from "react";
import { atom, useAtom } from "jotai";

import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton, TextField } from "@mui/material";

import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";

import { maxPerTxnResultAtom } from "@src/global/mintContract";

const maxQuantityAtom = atom((get) => get(maxPerTxnResultAtom).data || 100);
const quantityAtom = atom(1);

export function useQuantity() {
  //TODO: Change back to OG!
  const [maxQuantity] = [7777];
  const [quantity, setQuantity] = useAtom(quantityAtom);

  return { quantity, setQuantity, maxQuantity };
}

const IncrementButton = styled((props) => {
  const { quantity, setQuantity, maxQuantity } = useQuantity();
  return (
    <IconButton
      color="primary"
      onClick={() => quantity < maxQuantity && setQuantity(quantity + 1)}
      {...props}
    >
      <Add />
    </IconButton>
  );
})`
  aspect-ratio: 1;
  svg {
    fill: white;
  }
`;

const DecrementButton = styled((props) => {
  const { quantity, setQuantity } = useQuantity();
  return (
    <IconButton
      color="primary"
      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      {...props}
    >
      <Remove />
    </IconButton>
  );
})`
  aspect-ratio: 1;
  svg {
    fill: white;
  }
`;

const ChooseQuantity = styled((props) => {
  const { quantity, setQuantity, maxQuantity } = useQuantity();

  return (
    <Box {...props}>
      <Typography className="details">
        Amount to mint ({maxQuantity} max.)
      </Typography>
      <Box className="selection-ui">
        <DecrementButton />
        <TextField
          className="display"
          value={quantity}
          onChange={(e) => {
            let value = e.target.value;
            if (value === "") return setQuantity(1);
            value = parseInt(value);
            if (isNaN(value)) return;
            setQuantity(Math.max(Math.min(value, maxQuantity), 1));
          }}
          required
          placeholder="mint amount"
        >
          {quantity}
        </TextField>
        <IncrementButton />
      </Box>
    </Box>
  );
})`
  .details {
    text-align: center;
  }

  .MuiTextField-root * {
    text-align: center;
  }

  .selection-ui {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 0.8rem;
    margin: 0.6em 0;
    align-items: center;
  }
`;

export default ChooseQuantity;