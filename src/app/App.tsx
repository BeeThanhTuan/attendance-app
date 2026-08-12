import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./router";
import "@/lib/leaflet";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />

      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={2500}
      />
    </>
  );
}