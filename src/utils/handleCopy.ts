// @ts-ignore

const handleCopy = (data, setCopied) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  export default handleCopy;