import { Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  color: string;
  speed?: number;
}

const TypewriterEffect: React.FC<TypewriterProps> = ({ text, color = "white", speed = 60 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(currentIndex));
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      // Cleanup on component unmount
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <Box w="100%" minH="50px" color={color}>
      {displayedText}
    </Box>
  );
};

export default TypewriterEffect;
