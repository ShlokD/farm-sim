export type Crop = {
  name: string;
  icon: string;
};

export type WarehouseItem = Crop & { quantity: number };
