//@ts-nocheck

import { styled, useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";

import Image from "next/image";

const MockupsGif = styled(({ images, ...props }) => {
  return (
    <Box {...props}>
      <GalleryImage src={images[0]}/>
    </Box>
  );
})``;

const GalleryImage = styled(({ src, ...props }) => {
  return (
    <Box {...props}>
      <Image src={src} layout="fill" objectFit="cover" />
    </Box>
  );
})`
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  span {
    border-radius: 10px;
  }
`;

const Gallery = styled(({ images, ...props }) => {
  const galleryImages = images.map((imagePathname: string) => (
    <GalleryImage src={imagePathname} />
  ));
  return <Box {...props}>{galleryImages}</Box>;
})`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.8rem;
`;

const MockupsGallery = ({ images, ...props }) => {
  // Decide which to render based on size of container

  const theme = useTheme();
  const isSmallViewport = useMediaQuery(theme.breakpoints.down("sm"));

  return isSmallViewport ? <MockupsGif images={images}/> : <Gallery images={images} />;
};

export default MockupsGallery;
