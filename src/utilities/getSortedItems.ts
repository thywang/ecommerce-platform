import { StoreItemProps } from "../components/StoreItem";

export const getSortedItems = (items: StoreItemProps[], sortBy: string) => {
  switch (sortBy) {
    case "PRICE_LOW_TO_HIGH":
      return items.sort((a, b) => a.price - b.price);
    case "PRICE_HIGH_TO_LOW":
      return items.sort((a, b) => b.price - a.price);
    case "none":
      return items;
    default:
      console.error("something is wrong with getSortedItems...");
      return items;
  }
};
