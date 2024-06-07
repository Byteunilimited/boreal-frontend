import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./TextCarousel.css";

export const TextCarousel = () => {
  const textItems = [
    "Para mantener tu congelador en óptimas condiciones, es esencial descongelarlo regularmente y limpiar las superficies internas con una solución de agua y bicarbonato de sodio para eliminar olores y bacterias.",
    "Antes de cualquier mantenimiento, desconecta el congelador para evitar riesgos eléctricos, revisa el cable y el enchufe en busca de daños y mantén un ambiente seco alrededor del congelador.",
    "Los congeladores con sistema de autodescongelación deben tener el filtro de aire limpio o reemplazado cada tres meses para asegurar un funcionamiento óptimo.",
    "Limpia las bobinas del condensador con un cepillo suave o una aspiradora cada seis meses para evitar un aumento del consumo de energía y fallos en el motor.",
    "Revisa regularmente las juntas de la puerta del congelador para asegurarte de que están en buen estado y limpia con agua tibia y jabón, reemplázalas si no sellan correctamente."
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="carousel-container">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={4000} 
        infinite={true} 
      >
        {textItems.map((text, index) => (
          <div className="carousel-item" key={index}>
            {text}
          </div>
        ))}
      </Carousel>
    </div>
  );
};


