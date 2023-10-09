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
  primary: "#CAF0F8",
  secondary: "#0077b6",
  textPrimary: "#161629",
  textSecondary: "#023E8A",
  ...sharedColors,
};

export default Colors;
