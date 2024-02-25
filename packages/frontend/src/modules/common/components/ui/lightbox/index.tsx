import { Image } from '@chakra-ui/react';
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface LightBoxImageProps {
  fileUrl: string;
}

export default function LightBoxImage({ fileUrl }: LightBoxImageProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={0}
        carousel={{
          finite: false,
          preload: 0
        }}
        slides={[{ src: fileUrl }]}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 250 }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null
        }}
      />

      <Image src={fileUrl} onClick={() => setOpen(true)} />
    </>
  );
}
