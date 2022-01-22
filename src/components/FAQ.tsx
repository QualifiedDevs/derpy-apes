//@ts-nocheck

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "@src/theme";

const FAQItem = styled(({ summary, children, ...props }) => {
  return (
    <Accordion component="li" {...props}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color="white" />}
        aria-controls="panel1a-content"
      >
        <Typography variant="h3" className="summary">
          {summary}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{children}</Typography>
      </AccordionDetails>
    </Accordion>
  );
})`
  background: ${({ theme }) => theme.palette.secondary.main};

  border-radius: 12px !important;

  margin-bottom: 0.8em;

  .summary {
    font-size: 1.125em;
    font-weight: bold;
    text-transform: uppercase;
  }
  p {
    font-size: 1rem;
    b {
        text-transform: uppercase;
    }
    span {
      margin: 0.5em 0 1em;
      display: inline-block;
    }
  }
`;

const FAQ = styled((props) => {
  const [expanded, setExpanded] = useState<boolean | string>(false);
  const handleChange =
    (panel: string) =>
    (event: React.SyntheticEvent<Element, Event>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box {...props}>
      <Container maxWidth="md" >
        <Typography variant="h3" className="heading">
          FAQ
        </Typography>
        <Box component="ul">
          <FAQItem
            summary={"How Many Anatomy Apes Are There in Total?"}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            A total of 8,000 Anatomy Apes are available, with the combination of
            around 130+ traits across the collection.
          </FAQItem>
          <FAQItem
            summary={"How Much is Mint?"}
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            First 800 apes mints are FREE (max. 1 / wallet)! Then the remaining
            apes will cost 0.039 Ξ. The total amount of mints you can make is 20
            per wallet (for both FREE / paid mints).
          </FAQItem>
          <FAQItem
            summary={"Any Affiliation With BAYC?"}
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <span>
              No, we are not in any way affiliated with BAYC nor MAYC. But we
              are heavily inspired by them, and wanted to introduce high quality
              derivative artworks based on it.
            </span>
            <br />
            <span>
              We deconstructed the traits from BAYC apes and created a
              completely different & unique combination of ape and added our
              anatomical element.
            </span>
          </FAQItem>
          <FAQItem
            summary={"Wen Reveal?"}
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            Minted Anatomy Apes will be revealed immediately.
          </FAQItem>
          <FAQItem
            summary={"Future Roadmap?"}
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
          >
            <b>Marketing Strategies</b>
            <br />
            <span>
              Implementing post-marketing strategies to make the Anatomy Science
              universe well known by engaging a broader audience to help
              maintain the floor price of the collection.
            </span>
            <br />
            <b>Future Collabs & Giveaways</b>
            <br />
            <span>
              Exclusive future giveaways and collaboration opportunities for
              Anatomy Ape hodlers.
            </span>
            <br />
            <b>Privilege for Future Collections</b>
            <br />
            <span>
              The essence of the roadmap is to make the Anatomy Science universe
              bigger, and everyone who takes part in our journey will enjoy the
              privilege.
            </span>
            <br />
            <b>Community Voice</b>
            <br />
            <span>
              All ASAC holders will have a voice to help shape the future of the
              Anatomy Science universe!
            </span>
            <br />
            !WAGGA
          </FAQItem>
        </Box>
      </Container>
    </Box>
  );
})`
  background: ${({ theme }) => theme.palette.secondary.dark};
  padding: 4rem 0;
  width: 100%;

  .heading {
    text-align: center;
    margin-bottom: 1em;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
`;

export default FAQ;
