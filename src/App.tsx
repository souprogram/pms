import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createClient } from "./lib/supabase/client";
import { DashboardLayout } from "./routes/app/dashboard/layout";
import { DashboardPage } from "./routes/app/dashboard/page";
import { AppLayout } from "./routes/app/layout";
import { LoginPage } from "./routes/app/login";
import { SignUpPage } from "./routes/app/sign-up";
import { BlogPage } from "./routes/web/blog";
import { HomePage } from "./routes/web/Home";
import { WebLayout } from "./routes/web/layout";
import { NavPage } from "./routes/web/nav-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/blogs/:id",
        element: <BlogPage />,
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
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        loader: async () => {
          const client = createClient();
          const { error } = await client.auth.getUser();

          if (error) {
            location.href = "/login";
          }
        },
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
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
