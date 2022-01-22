//@ts-nocheck

import { styled } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

import ChooseQuantity from "@components/ChooseQuantity";
import MultiButton from "./MultiButton";

const MintBox = styled((props) => {
  return (
    <Paper {...props}>
      <Typography className="description" sx={{mb: 2}}>
        <b>Anatomy Science Ape Club</b> is a collection of 8,000 anatomical
        mortal apes dissected through the organs. Explore what your ape is
        really made of inside out.
      </Typography>
      <Typography >
        First <b>800 FREE</b>{" "}
        <span className="details">(max. 1 NFT / tx.)</span>
      </Typography>
      <Typography sx={{mb: 2}}>
        Then <b>0.039 Ξ each</b>{" "}
        <span className="details">(max. 20 NFT / tx.)</span>
      </Typography>
      <Paper className="mint-info" elevation={1} sx={{mb: 1.5}}>
        <Typography className="key">NFT Minted</Typography>
        <Typography className="value">8,000/8,000</Typography>
      </Paper>
      <Paper className="mint-info" elevation={1} sx={{mb: 2.5}}>
        <Typography className="key">Price</Typography>
        <Typography className="value">0.039 Ξ</Typography>
      </Paper>
      <ChooseQuantity className="choose-quantity" sx={{mt: "auto", mb: 1.5}}/>
      <MultiButton variant="contained" className="multi-button" sx={{mb: 2}} />
      <Typography className="total-minted">
        My total NFT minted (0 / 20)
      </Typography>
    </Paper>
  );
})`
  background: ${({ theme }) => theme.palette.secondary.dark};
  padding: 2em;
  display: flex;
  flex-direction: column;

  .mint-info {
    background: ${({ theme }) => theme.palette.secondary.main};
    padding: 1em;
    display: flex;
    justify-content: space-between;
  }

  .choose-quantity {
  }

  .multi-button {
    width: 100%;
    padding: 1rem;
  }

  .total-minted {
    text-align: center;
  }
`;

export default MintBox;
