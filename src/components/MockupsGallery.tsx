import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import Image from "next/image";

const GalleryImage = styled(({ src, ...props }) => {
  return (
    <Box {...props}>
      <Image src={src} layout="fill" objectFit="cover" />
    </Box>
  );
})`
  position: relative;
  width: 250px;
  height: 250px;

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
  grid-template-columns: 1fr 1fr;
  grid-gap: .8rem;
`;

const MockupsGallery = ({ images, ...props }) => {
  // Decide which to render based on size of container

  return (
    <>
      <Gallery images={images} />
    </>
  );
};

export default MockupsGallery;
