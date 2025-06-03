import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { appRoutes } from "./routes/app";
import { webRoutes } from "./routes/web";

const queryClient = new QueryClient();

const router = createBrowserRouter([...webRoutes, ...appRoutes]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
