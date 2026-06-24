import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { availableCrops } from "./constants";
import FarmContext from "./farm-context";
import { Crop, FieldsState } from "./types";

type FieldCrop = Crop & { time: number; state: FieldsState };

const EMPTY_PLOT: FieldCrop = {
  name: "",
  icon: "",
  time: -1,
  state: FieldsState.NONE,
};

const Fields = () => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [plotIndex, setPlotIndex] = useState(-1);
  const [fields, setFields] = useState<FieldCrop[]>(
    new Array(4).fill(0).map(() => ({ ...EMPTY_PLOT })),
  );

  const { warehouse, setWarehouse } = useContext(FarmContext);

  const intervalRef = useRef<number | null>(null);

  const selectCrop = (index: number) => {
    setShowCropDialog(true);
    setPlotIndex(index);
  };

  const closeDialog = () => {
    setShowCropDialog(false);
    setPlotIndex(-1);
  };

  const plantCrop = (cropIndex: number) => {
    const crop = availableCrops[cropIndex];
    setFields((prev) => {
      const newFields = [...prev];
      newFields[plotIndex] = { ...crop, state: FieldsState.PLANTED };
      return newFields;
    });
    closeDialog();
  };

  const harvestCrop = (cropIndex: number) => {
    const crop = fields[cropIndex];
    if (crop.state !== FieldsState.READY) return;
    setFields((prev) => {
      const newFields = [...prev];
      newFields[cropIndex] = { ...EMPTY_PLOT };
      return newFields;
    });

    setWarehouse((prev) => {
      const newWarehouse = { ...prev };
      const existing = newWarehouse[crop.name];
      if (existing) {
        newWarehouse[crop.name] = {
          ...existing,
          quantity: existing.quantity + 1,
        };
      } else {
        newWarehouse[crop.name] = {
          name: crop.name,
          icon: crop.icon,
          quantity: 1,
        };
      }

      return newWarehouse;
    });
  };

  useEffect(() => {
    if (
      fields.every(
        (f) =>
          f.time <= 0 &&
          (f.state === FieldsState.READY || f.state === FieldsState.NONE),
      )
    ) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setFields((prev) => {
          return prev.map((f) => {
            if (f.time === 0) {
              return { ...f, time: 0, state: FieldsState.READY };
            }
            return { ...f, time: f.time - 1 };
          });
        });
      }, 1000);
    }
  }, [fields]);

  return (
    <div className="flex flex-col w-full h-full gap-10">
      <div className="grid grid-cols-4 gap-0 place-items-center grid-flow-col-dense">
        {fields.map((field, i) => {
          if (field.name === "") {
            return (
              <button
                key={`crop-${i}`}
                onClick={() => selectCrop(i)}
                className="w-20 h-20 bg-amber-950"></button>
            );
          }
          return (
            <button
              key={`crop-${i}`}
              onClick={() => harvestCrop(i)}
              className={`w-20 h-20 ${field.state === FieldsState.READY ? "bg-blue-500" : "bg-green-500"}`}>
              {field.icon} {field.time}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 bg-yellow-500 p-4">
        <p className="text-center font-bold text-white text-lg self-center">
          Warehouse
        </p>
        <div className="flex gap-2">
          {Object.keys(warehouse).map((warehouseItem) => {
            const item = warehouse[warehouseItem];
            return (
              <div className="border-2 text-3xl p-2 font-bold text-white">
                {item.icon} {item.quantity}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="flex gap-2 flex-col fixed bottom-0 border-4 transition-transform duration-150 rounded-xl w-11/12 p-4 items-center justify-center"
        style={{
          height: "200px",
          transform: `translateY(${showCropDialog ? "20px" : "1000px"})`,
        }}>
        {availableCrops.map((aCrop, i) => {
          return (
            <button
              key={`available-${i}`}
              className="w-3/4 p-4 bg-green-100 rounded-xl font-bold"
              onClick={() => plantCrop(i)}>
              {aCrop.icon} {aCrop.name}
            </button>
          );
        })}
        <button
          className="p-4 w-1/2 bg-red-400 font-bold text-white rounded-xl"
          onClick={closeDialog}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Fields;
