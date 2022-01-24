import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

import { useWeb3 } from "./Web3Connection";

const FreeMint = styled((props) => {

  const { freeMintAllowed, setFreeMintAllowed } = useWeb3();

  //Check for freeMintAllowed

  return <Button disabled={!freeMintAllowed} {...props}>
      {freeMintAllowed? "Mint One Free" : "No Access"}
  </Button>;
})``;

export default FreeMint;