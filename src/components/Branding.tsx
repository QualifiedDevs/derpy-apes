import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import Image from "next/image";

const LogoLong = styled((props) => {
  return (
    <Box {...props}>
      <Image
        src="/logo.png"
        layout="fill"
        objectFit="contain"
        objectPosition="center"
      />
    </Box>
  );
})`
  position: relative;
  width: 400px;
  aspect-ratio: 4;
`;

export { LogoLong };