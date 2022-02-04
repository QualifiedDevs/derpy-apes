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

  svg {
    fill: white;
  }

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
      <Container maxWidth="md">
        <Typography variant="h3" className="heading">
          FAQ
        </Typography>
        <Box component="ul" className="faq-box">
          <FAQItem
            summary={"What is the total supply?"}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            There will be a total of 7,777 derpy apes available to mint
          </FAQItem>
          <FAQItem
            summary={"What is the mint price?"}
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            0.024 $ETH or the equivalent in $LOOKS
          </FAQItem>
          <FAQItem
            summary={"Free mint?"}
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
              The first <b>777</b> derpy apes will be <b>FREE</b> (max 1 per wallet). In order
              to qualify for the free mint, you must hold a NFT from at least one
              of these collections (will be validated by our smart contract):
              <br />
              <br />

            <ul>
              <li>alienfrens</li>
              <li>cryptomories</li>
              <li>3dfrankenpunks</li>
              <li>deadfellaz</li>
              <li>pudgy penguins</li>
              <li>bayc</li>
              <li>mayc</li>
              <li>coolcats</li>
              <li>doodles</li>
              <li>fanggang</li>
              <li>sketchyapebc</li>
              <li>cryptobatz</li>
              <li>chameleon nft</li>
              <li>fishyfam</li>
              <li>0xapes</li>
              <li>night owl</li>
              <li></li>
              <li></li>

              <li></li>

              <li></li>

              <li></li>

              <li></li>

              <li></li>

              <li></li>

              <li></li>

              <li></li>

            </ul>
          </FAQItem>
          <FAQItem
            summary={"Can I mint using $LOOKS?"}
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            Yes
          </FAQItem>
          <FAQItem
            summary={"When will my NFT be revealed?"}
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
          >
            All derpy apes will be revealed 24 hours after minting is complete
          </FAQItem>
          <FAQItem
            summary={"Is there a roadmap set in place?"}
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
          >
            Yes, you can learn more about our project's vision by joining our
            discord
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
  .faq-box {
    list-style-type: none;
    padding: 0;

  }
`;

export default FAQ;
