import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

import { useWeb3 } from "@components/Web3Connection";

const ConnectButton = styled((props) => {

  const { clientAddress } = useWeb3();

  return <Button disabled={!!clientAddress} {...props} >
      {clientAddress? clientAddress : "Connect Wallet"}
  </Button>;
})``;

export default ConnectButton;