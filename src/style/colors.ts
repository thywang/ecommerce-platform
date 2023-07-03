export type ColorTheme = {
  primary: string;
  secondary: string;
  textSecondary: string;
  textPrimary: string;
};

const sharedColors = {
  black: "#000000",
  white: "#FFFFFF",
};

type SharedColors = typeof sharedColors;

export type TColors = ColorTheme & SharedColors;

const Colors = {
  primary: "#E6E6FA",
  secondary: "#8A2BE2",
  textPrimary: "#161629",
  textSecondary: "#663399",
  ...sharedColors,
};

export default Colors;
