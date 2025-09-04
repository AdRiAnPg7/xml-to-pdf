import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "./styles/tailwind.css";
import "./styles/globals.css";
import { App } from "./app/App";
import { HomePage } from "./pages/HomePage";
import { DesignerPage } from "./pages/DesignerPage";
import { PreviewPage } from "./pages/PreviewPage";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "designer", element: <DesignerPage /> },
      { path: "preview", element: <PreviewPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        primaryColor: "cyan",
        fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
      }}
      defaultColorScheme="light"
    >
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
