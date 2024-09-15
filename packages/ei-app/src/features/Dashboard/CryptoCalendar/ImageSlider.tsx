import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";

type ImageSliderProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  imageUrls: string[];
  period?: number;
};

const SliderContainer = styled("div")({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
});

const SliderImage = styled("img")<{
  isActive: boolean;
}>(({ isActive }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: isActive ? 1 : 0,
  transition: "opacity 0.5s ease-in-out",
}));

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls, period, ...props }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
    }, period || 1000);

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  return (
    <SliderContainer {...props}>
      {imageUrls.map((url, index) => (
        <SliderImage
          key={index}
          src={url}
          alt={`Slide ${index}`}
          isActive={index === currentImageIndex}
          {...props}
        />
      ))}
    </SliderContainer>
  );
};

export default ImageSlider;
