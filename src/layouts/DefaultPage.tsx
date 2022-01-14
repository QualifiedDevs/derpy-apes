import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import Header from "@components/Header";
import Footer from "@components/Footer";

//@ts-ignore
const DefaultPage = styled(({ children, ...props }) => {

  const { mainMenu, socials } = manifest;

  return (
    <Box {...props}>
        {/* @ts-ignore */}
      <Header menu={mainMenu} socials={socials} />
      <Box className="content">{React.cloneElement(children, {manifest})}</Box>
        {/* @ts-ignore */}
      <Footer manifest={manifest} />
    </Box>
  );
})`
  display: grid;
  grid-template-rows: auto 1fr auto;

  height: auto;

  height: 100vh;

  header {
  }

  .content {
    width: 100%;
  }
`;

const manifest = {
    socials: {
      twitter: "https://twitter.com/qualifieddevs",
      discord: "https://discord.gg/g7gt5BnR5A",
    },
    mainMenu: {
      "HAPE DROP": "/games/HAPE-DROP",
      About: "/about",
    },
    team: {
      minnow: {
        twitter: "CryptoMinnows",
        discord: "minnow#1884",
        roles: ["Co-Founder"],
      },
      Jax: {
        twitter: "LuckyUniverse2",
        discord: "Jax#0235",
        roles: ["Co-Founder"],
      },
      OrionStar: {
        twitter: "OrionDevStar",
        discord: "+OrionStar#8194",
        roles: ["Co-Founder"],
      },
      Dodge: {
        twitter: "DodgeInMedia",
        discord: "Dodge#2824",
        roles: ["Networking"],
      },
    },
  };

export default DefaultPage;