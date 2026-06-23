import { FarmContextProvider } from "./farm-context";
import Fields from "./fields";

export function App() {
  return (
    <FarmContextProvider>
      <main className="flex flex-col w-full h-full p-4">
        <Fields />
      </main>
    </FarmContextProvider>
  );
}
