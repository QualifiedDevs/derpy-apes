import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import Image from "next/image";

const Avatar = styled(({ src, ...props }) => {
  console.log(src);

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
  width: 200px;
  height: 200px;

  span {
    border-radius: 10px;
  }
`;

const Member = styled(({ name, role, avatar, bio, socials, ...props }) => {
  return (
    <Box {...props}>
      <Avatar src={avatar} className="avatar" sx={{mb: 1.5}}/>
      <Typography className="name">{name}</Typography>
      <Typography className="role">{role}</Typography>
    </Box>
  );
})`
  text-align: center;

  .name {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.5em;
  }

  .role {
    color: ${({theme}) => theme.palette.secondary.light}
  }
`;

const Team = styled(({ team, ...props }) => {
  const members = Object.keys(team).map((memberId) => {
    const memberInfo = team[memberId];
    return <Member key={memberId} {...memberInfo} />;
  });

  return (
    <Box {...props}>
      <Typography variant="h3" className="heading" sx={{mb: 5}}>
        Meet the Team
      </Typography>
      <Box className="team-members">{members}</Box>
    </Box>
  );
})`
  padding: 5rem 0;

  .heading {
    text-align: center;
    text-transform: uppercase;
  }

  .team-members {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 1rem;
  }
`;

export default Team;
