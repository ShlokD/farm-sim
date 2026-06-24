import { ComponentChildren, createContext } from "preact";
import { SetStateAction } from "preact/compat";
import { Dispatch, useState } from "preact/hooks";
import { WarehouseItem } from "./types";

type FarmContextType = {
  warehouse: WarehouseItem;
  setWarehouse: Dispatch<SetStateAction<WarehouseItem>>;
};
const FarmContext = createContext<FarmContextType>({
  warehouse: {},
  setWarehouse: () => {},
});

export const FarmContextProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const [warehouse, setWarehouse] = useState<WarehouseItem>({});
  return (
    <FarmContext.Provider value={{ warehouse, setWarehouse }}>
      {children}
    </FarmContext.Provider>
  );
};

export default FarmContext;
