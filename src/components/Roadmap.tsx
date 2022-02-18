import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import Image from "next/image";
import roadmap from "@public/roadmap.jpg";

const Roadmap = styled((props) => {
  return (
    <Box {...props}>
      <Typography variant="h3" sx={{mb: 3}}>Roadmap</Typography>
      <Container component="a" href="https://twitter.com/derpyapes" maxWidth="md" className="image-wrapper" disableGutters sx={{px: 4, mb: 15}}>
        <Image src={roadmap} layout="responsive" />
      </Container>
    </Box>
  );
})`
  width: 100%;

  h3 {
    text-transform: uppercase;
    text-align: center;
  }

  .image-wrapper {
    display: block;
    position: relative;

    * {
      border-radius: 10px;
    }

    transition: transform 0.2s ease;

    :hover {
      transform: scale(1.025, 1.025);
    }
  }
`;

export default Roadmap;
