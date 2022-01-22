import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";

//  import dynamic from "next/dynamic";

// Make this part dynamic later! probably from wherever I parse for socials the first time.
import discord from "@src/vector-graphics/socials/discord";
import twitter from "@src/vector-graphics/socials/twitter";

const socialIcons = {
  discord,
  twitter,
};

//@ts-ignore
const SocialButton = styled(({ social, link, ...props }) => {
  //@ts-ignore
  const Icon = socialIcons[social];

  return (
    <IconButton component="a" href={link} color="primary" {...props}>
      <Icon />
    </IconButton>
  );
})``;

//@ts-ignore
const SocialsMenu = styled(({ socials, ...props }) => {
  const socialButtons = Object.keys(socials).map((socialName: string, index: number) => {
    const link = socials[socialName];
        {/* @ts-ignore */}
    return <SocialButton social={socialName} link={link} key={index} />;
  });
  return <Box component="nav" {...props}>{socialButtons}</Box>;
})``;

export default SocialsMenu;