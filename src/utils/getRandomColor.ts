const colorSchemes: Array<string> = ["teal", "red", "pink", "cyan", "orange", "gray", "purple", "mobiColor", "green", "purple"];

let availableColors = [...colorSchemes];

const getRandomColor = (): string => {
  if (availableColors.length === 0) {
    availableColors = [...colorSchemes];
  }

  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const chosenColor = availableColors[randomIndex];

  // Remove the chosen color from the available colors.
  availableColors.splice(randomIndex, 1);

  return chosenColor;
};

export default getRandomColor;
