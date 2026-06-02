import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import {LayoutProvider} from "@/contexts/LayoutContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LayoutProvider>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </LayoutProvider>
    </StrictMode>
);
