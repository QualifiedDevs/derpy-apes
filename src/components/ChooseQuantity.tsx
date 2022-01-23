//@ts-nocheck

import React, { createContext, useContext, useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton, TextField } from "@mui/material";

import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

// Max quantity varies depending on context...
// I can set it whenever they connect a wallet.
// -1 can represent no permissions? or null.

//? Default values if context if no QuantityProvider is found, or if its values resolve to null?
export const QuantityContext = createContext({
  quantity: 1,
  setQuantity: (quantity: number) => {},
  maxQuantity: 20,
  setMaxQuantity: (quantity: number) => {},
});

const IncrementButton = styled((props) => {
  const { quantity, setQuantity, maxQuantity } = useContext(QuantityContext);
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
  const { quantity, setQuantity } = useContext(QuantityContext);
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
  const { quantity, setQuantity, maxQuantity } = useContext(QuantityContext);

  useEffect(() => {}, []);

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
            if (value === "")
                return setQuantity(1)
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

export const QuantityProvider = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(25);

  return (
    <QuantityContext.Provider
      value={{ quantity, setQuantity, maxQuantity, setMaxQuantity }}
      {...props}
    />
  );
};

export default ChooseQuantity;