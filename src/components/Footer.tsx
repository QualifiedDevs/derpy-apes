//@ts-nocheck

import { styled } from "@mui/material/styles";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";

import Link from "@components/Link";

import discord from "@src/vector-graphics/socials/discord";
import twitter from "@src/vector-graphics/socials/twitter";
import opensea from "@src/vector-graphics/marketplaces/opensea";

import contractMetadata from "@src/artifacts/mintContract/metadata"

const navIcons = {
  discord,
  twitter,
  opensea,
};

const NavIconButton = styled(({ icon, link, ...props }) => {
  return (
    <Box component="a" {...props}>
      <li>
        <IconButton color="secondary">{icon}</IconButton>
      </li>
    </Box>
  );
})``;

const getNavButtons = (navItems) => {
  const buttons = Object.keys(navItems).map((navItemName) => {
    const Icon = navIcons[navItemName];
    const link = navItems[navItemName];
    return <NavIconButton href={link} icon={<Icon />} key={navItemName} />;
  });
  return buttons;
};

const ContractLookup = styled((props) => {
  return (
    <Button
      component="a"
      href={`https://etherscan.io/address/${contractMetadata.address}`}
      {...props}
    >
      {`${contractMetadata.address.slice(0,13)}...${contractMetadata.address.slice(-13)}`}
    </Button>
  );
})``;

//1st 14 last 13

// Need to get socials and opensea button. Same button for each

const Footer = styled(({ socials, marketplaces, contract, ...props }) => {
  const socialButtons = getNavButtons(socials);
  const marketplaceButtons = getNavButtons(marketplaces);

  return (
    <Box component="footer" {...props}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Derpy Apes Smart Contract
      </Typography>
      <ContractLookup
        variant="contained"
        contract={contract}
        color="secondary"
        className="contract-lookup"
      />
      <Box component="nav">
        <ul>
          {socialButtons}
          {marketplaceButtons}
        </ul>
      </Box>
      <Typography variant="h6">2022 Derpy Apes</Typography>
    </Box>
  );
})`
  padding: 2rem 0;

  h5,
  h6 {
    text-align: center;
    color: ${({ theme }) => theme.palette.secondary.light};
    font-size: 1em;
  }

  h6 {
    font-size: 0.9em;
  }

  .contract-lookup {
    font-size: 1em;
    padding: 0.7em;
  }

  nav {
    margin: 0.4em 0;
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      .MuiIconButton-root {

        padding: .4em;
        margin: 0 0.2em;

      }
    }
  }
`;

export default Footer;