import { Button } from "@chakra-ui/react";

interface Props {
  buttonText: string;
  onButtonClick: () => void;
  colorScheme?: string;
  color?: string;
  size?: string;
  fontSize?: string;
  isCopied?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HoverEffectButton: React.FC<Props> = ({
  buttonText,
  onButtonClick,
  colorScheme,
  color,
  size,
  fontSize,
  isCopied,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Button
      onClick={onButtonClick}
      colorScheme={colorScheme}
      color={color}
      size={size}
      fontSize={fontSize}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {isCopied ? "Copied!" : buttonText}
    </Button>
  );
};

export default HoverEffectButton;
