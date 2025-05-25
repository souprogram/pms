import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { webRoutes } from "./routes/web";
import { appRoutes } from "./routes/app";

const queryClient = new QueryClient();

const router = createBrowserRouter([...webRoutes, ...appRoutes]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
