import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Blog } from "./routes/web/blog";
import { Home } from "./routes/web/Home";
import { WebLayout } from "./routes/web/layout";
import { NavPage } from "./routes/web/nav-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/blogs/:id",
        element: <Blog />,
      },
      {
        path: "/:navPage",
        loader: async ({ params }) => {
          const pageName = params.navPage;
          if (!pageName) {
            throw new Response("Not found", { status: 404 });
          }

          const page = await import(
            `./components/web/nav-content/${params.navPage}.mdx`
          );
          if (!page) {
            throw new Response("Not found", { status: 404 });
          }

          return { page: page.default };
        },
        errorElement: <div>Something went wrong</div>,
        element: <NavPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
