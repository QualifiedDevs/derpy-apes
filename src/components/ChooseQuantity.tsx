import React, { createContext, useContext, useState } from "react";

import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton } from "@mui/material";

import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";

// Max quantity varies depending on context...
// I can set it whenever they connect a wallet.
// -1 can represent no permissions? or null.

//? Default values if context if no QuantityProvider is found, or if its values resolve to null?
export const QuantityContext = createContext({
  quantity: 1,
  setQuantity: (quantity: number) => {},
  maxQuantity: 0,
  setMaxQuantity: (quantity: number) => {},
});

const IncrementButton = styled((props) => {
  const { quantity, setQuantity } = useContext(QuantityContext);
  return (
    <IconButton
      onClick={() => quantity < 30 && setQuantity(quantity + 1)}
      {...props}
    >
      <Add />
    </IconButton>
  );
})``;

const DecrementButton = styled((props) => {
  const { quantity, setQuantity } = useContext(QuantityContext);
  return (
    <IconButton
      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      {...props}
    >
      <Remove />
    </IconButton>
  );
})``;

const ChooseQuantity = styled((props) => {
  const { quantity, maxQuantity } = useContext(QuantityContext);

  return (
    <Box {...props}>
      <Typography className="details">
        Amount to mint ({maxQuantity} max.)
      </Typography>
      <Box className="selection-ui">
        <DecrementButton />
        <Box className="display">{quantity}</Box>
        <IncrementButton />
      </Box>
    </Box>
  );
})`
  .details {
    text-align: center;
  }

  .selection-ui {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 0.8rem;
  }
`;

export const QuantityProvider = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(0);

  return (
    <QuantityContext.Provider
      value={{ quantity, setQuantity, maxQuantity, setMaxQuantity }}
      {...props}
    />
  );
};

export default ChooseQuantity;
