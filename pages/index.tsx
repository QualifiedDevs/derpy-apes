//@ts-nocheck

import fs from "fs";

import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import { LogoFull } from "@components/Branding";

import MockupsGallery from "@components/MockupsGallery";
import MintBox from "@components/MintBox";
import Team from "@components/Team";
import FAQ from "@components/FAQ";
import Footer from "@components/Footer";

//@ts-ignore
const index = styled(({ manifest, mockupImages, ...props }) => {
  console.log(mockupImages);

  return (
    <Box {...props}>
      {/* @ts-ignore */}
      <Container id="hook">
        <LogoFull className="logo" sx={{ mb: 1 }} />
        <Box className="content">
          <MockupsGallery images={mockupImages} />
          <MintBox />
        </Box>
      </Container>
      <Team team={manifest.team} />
      <FAQ />
      <Footer
        socials={manifest.socials}
        marketplaces={manifest.marketplaces}
        contract={manifest.contractAddress}
      />
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
    justify-content: center;
    margin: 2rem 0;
  }

  #hook {


    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 1em;
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