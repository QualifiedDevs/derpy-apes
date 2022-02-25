import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import manifest from "@src/manifest.json";
const mainMenu = manifest.mainMenu

const Header = styled((props) => {
  return <Box {...props}></Box>;
})``;

export default Header;
