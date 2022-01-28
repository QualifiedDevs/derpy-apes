//@ts-nocheck

import fs from "fs";

import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import { LogoLong } from "@components/Branding";

import MockupsGallery from "@components/MockupsGallery";
import MintBox from "@components/MintBox";
import Team from "@components/Team";
import FAQ from "@components/FAQ";
import Footer from "@components/Footer";

const index = styled(
  ({ manifest, contractABI, contractMetadata, mockupImages, ...props }) => {
    return (
      <Box {...props}>
        {/* @ts-ignore */}
        <Container id="hook">
          <LogoLong className="logo" sx={{ mb: 1 }} />
          <Box className="content">
            <MockupsGallery images={mockupImages} />
            <MintBox />
          </Box>
        </Container>
        {/* <DebugAuthorization variant="contained"/> */}
        <Team team={manifest.team} />
        <FAQ />
        <Footer
          socials={manifest.socials}
          marketplaces={manifest.marketplaces}
          contract={contractMetadata.address}
        />
      </Box>
    );
  }
)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  .logo {
    width: min(100%, 400px);
    justify-content: center;
    margin: 2rem auto;
  }

  #hook {
    .content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 1em;
      grid-row-gap: 3em;
      align-items: center;
    }
  }

  ${({ theme }) => theme.breakpoints.down("lg")} {
    #hook {
      .content {
        grid-template-columns: 600px;
        justify-content: center;
      }
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    #hook {
      .content {
        grid-template-columns: 1fr;
      }
    }
  }
`;

export async function getStaticProps() {
  const mockupsDir = "mockups";

  //readDirSync @public/mockups
  const mockupImages = fs.readdirSync(`./public/${mockupsDir}`);
  mockupImages.forEach(
    (fileName, index) => (mockupImages[index] = `/${mockupsDir}/${fileName}`)
  );

  return {
    props: { mockupImages },
  };
}

export default index;