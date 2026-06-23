import { useState } from "preact/hooks";
import { availableCrops } from "./constants";
import { Crop } from "./types";

const Fields = () => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [plotIndex, setPlotIndex] = useState(-1);
  const [fields, setFields] = useState<Crop[]>(
    new Array(4).fill(0).map(() => ({
      name: "",
      icon: "",
      time: -1,
    })),
  );

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
      newFields[plotIndex] = crop;
      return newFields;
    });
    closeDialog();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-4 gap-0 place-items-center grid-flow-col-dense">
        {fields.map((field, i) => {
          if (field.name === "") {
            return (
              <button
                key={`crop-${i}`}
                onClick={() => selectCrop(i)}
                className="w-20 h-20 bg-amber-950"
              ></button>
            );
          }
          return (
            <button key={`crop-${i}`} className="w-20 h-20 bg-green-500">
              {field.icon}
            </button>
          );
        })}
      </div>
      <div
        className="flex gap-2 flex-col fixed bottom-0 border-4 transition-transform duration-150 rounded-xl w-11/12 p-4 items-center justify-center"
        style={{
          height: "200px",
          transform: `translateY(${showCropDialog ? "20px" : "1000px"})`,
        }}
      >
        {availableCrops.map((aCrop, i) => {
          return (
            <button
              key={`available-${i}`}
              className="w-3/4 p-4 bg-green-100 rounded-xl font-bold"
              onClick={() => plantCrop(i)}
            >
              {aCrop.icon} {aCrop.name}
            </button>
          );
        })}
        <button
          className="p-4 w-1/2 bg-red-400 font-bold text-white rounded-xl"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Fields;
