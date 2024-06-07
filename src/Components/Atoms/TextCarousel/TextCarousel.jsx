import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const TextCarousel = () => {
  const textItems = [
    "Texto 1",
    "Texto 2",
    "Texto 3",
    "Texto 4",
    "Texto 5",
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel responsive={responsive}>
      {textItems.map((text, index) => (
        <div key={index}>{text}</div>
      ))}
    </Carousel>
  );
};


