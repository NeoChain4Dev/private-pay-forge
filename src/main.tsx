import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Index from "./pages/Index.tsx";
import { CreateGig } from "./pages/CreateGig.tsx";
import { Projects } from "./pages/Projects.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-gig" element={<CreateGig />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
);
