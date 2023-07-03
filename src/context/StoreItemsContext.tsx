import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { StoreItemProps } from "../components/StoreItem";

type StoreItemsProviderProps = {
  children: ReactNode;
};

type StoreItemsContext = {
  storeItems: StoreItemProps[];
};

const StoreItemsContext = createContext<StoreItemsContext>(
  {} as StoreItemsContext
);

export function useStoreItems() {
  return useContext(StoreItemsContext);
}

export function StoreItemsProvider({ children }: StoreItemsProviderProps) {
  const [storeItems, setStoreItems] = useState<StoreItemProps[]>([]);

  const fetchItemData = () => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setStoreItems(data);
      })
      .catch((err) => console.log("Error: ", err));
  };

  useEffect(() => {
    fetchItemData();
  }, []);

  return (
    <StoreItemsContext.Provider value={{ storeItems }}>
      {children}
    </StoreItemsContext.Provider>
  );
}
