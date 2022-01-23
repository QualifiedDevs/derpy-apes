import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

import { getMintAuth } from "@utils";

const DebugAuthorization = styled((props) => {

  return <Button {...props} onClick={() => getMintAuth("0x1cd7840181b4142C336F3E69d1E58d3f38330D9C")} >
      Get Mint Auth
  </Button>;
})``;

export default DebugAuthorization;