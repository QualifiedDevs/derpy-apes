//@ts-nocheck

import React, { useState, useMemo, useEffect, useRef } from "react";

import { styled, useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";

import Image from "next/image";

import img1 from "@public/mockups/1.png";
import img2 from "@public/mockups/2.png";
import img3 from "@public/mockups/3.png";
import img4 from "@public/mockups/4.png";

const images = [img1, img2, img3, img4];

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

const MockupsGif = styled(({ images, delay, ...props }) => {
  const galleryImages = useMemo(() =>
    images.map((image) => <GalleryImage src={image} />)
  );

  const active = useRef(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveImage(active.current);
      active.current = (active.current + 1) % 4;
    }, delay);
    return () => clearInterval(intervalId);
  }, []);

  return <Box {...props}>{galleryImages[activeImage]}</Box>;
})``;

const Gallery = styled(({ images, ...props }) => {
  const galleryImages = images.map((imagePathname: string) => (
    <GalleryImage src={imagePathname} key={imagePathname} />
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

  return isSmallViewport ? (
    <MockupsGif images={images} delay={1000} />
  ) : (
    <Gallery images={images} />
  );
};

export default MockupsGallery;
