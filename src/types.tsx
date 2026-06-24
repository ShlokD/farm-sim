export type Crop = {
  name: string;
  icon: string;
};

export type WarehouseItem = Record<string, Crop & { quantity: number }>;

export enum FieldsState {
  NONE,
  PLANTED,
  READY,
}
