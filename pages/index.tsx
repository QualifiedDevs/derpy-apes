import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

import { LogoFull } from "@components/Branding";

import DiscordButton from "@components/DiscordButton";

//@ts-ignore
const index = styled(({manifest, ...props}) => {
  return (
    <Box {...props}>
      
      {/* @ts-ignore */}
      <LogoFull className="logo" sx={{mb: 1}} />
      <Typography sx={{mb: 4}} >Blockchain development as a service, and much much more.</Typography>
      {/* @ts-ignore */}
      <DiscordButton link={manifest.socials.discord} />
    </Box>
  );
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  .logo {
    font-size: 4rem;
  }
`;

export default index;