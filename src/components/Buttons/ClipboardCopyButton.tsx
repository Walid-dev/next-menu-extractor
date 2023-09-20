import React, { useState } from "react";

// Define the prop type
interface ClipboardCopyButtonProps {
  data: any; // You might want to be more specific with this type if possible
  buttonText?: string; // Optional button text
}

const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = ({ data, buttonText = "Copy to Clipboard" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return <button onClick={handleCopy}>{copied ? "Copied!" : buttonText}</button>;
};

export default ClipboardCopyButton;
