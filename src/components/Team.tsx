//@ts-nocheck

import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import Image from "next/image";

const Avatar = styled(({ src, ...props }) => {

  return (
    <Box {...props}>
      <Image
        src={`/team-avatars/${src}`}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </Box>
  );
})`
  position: relative;
  aspect-ratio: 1;

  span {
    border-radius: 10px;
  }
`;

const Member = styled(({ name, role, avatar, bio, socials, ...props }) => {
  return (
    <Box component="a" href={socials.twitter} {...props}>
      <Avatar src={avatar} className="avatar" sx={{ mb: 1.5 }} />
      <Typography className="name">{name}</Typography>
      <Typography className="role">{role}</Typography>
    </Box>
  );
})`
  text-align: center;

  text-decoration: none;
  color: ${({theme}) => theme.palette.text.primary};

  transition: color .15s ease;

  :hover {
      color: #1DA1F2;
  }

  .name {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.5em;
  }

  .role {
    color: ${({ theme }) => theme.palette.secondary.light};
  }
`;

const Team = styled(({ team, ...props }) => {
  const members = Object.keys(team).map((memberId) => {
    const memberInfo = team[memberId];
    return <Member key={memberId} {...memberInfo} />;
  });

  return (
    <Box {...props}>
      <Typography variant="h3" className="heading" sx={{ mb: 5 }}>
        Meet the Team
      </Typography>
      <Container className="team-members">{members}</Container>
    </Box>
  );
})`
  padding: 5rem 0;
  width: 100%;

  .heading {
    text-align: center;
    text-transform: uppercase;
  }

  .team-members {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, .8fr));
    grid-column-gap: 1rem;
    grid-row-gap: 1.5rem;
    justify-content: center;
  }
`;

export default Team;