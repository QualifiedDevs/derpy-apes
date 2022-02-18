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
            There are a total of 7,777 derpy apes available to mint
          </FAQItem>
          <FAQItem
            summary={"What is the mint price?"}
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            0.024 $ETH
          </FAQItem>
          <FAQItem
            summary={"When will my NFT be revealed?"}
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
          >
            All derpy apes will be revealed instantly
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
