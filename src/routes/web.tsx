import { lazy } from "react";
import { RouteObject } from "react-router";

export const webRoutes: RouteObject[] = [
  {
    path: "/",
    Component: lazy(() => import("./web/layout")),
    children: [
      {
        index: true,
        Component: lazy(() => import("./web/Home")),
      },
      {
        path: "/blogs/:id",
        Component: lazy(() => import("./web/blog")),
      },
      {
        path: "/:navPage",
        lazy: async () => {
          const { default: Component } = await import("./web/nav-page");
          return {
            Component,
            loader: async ({ params }) => {
              const pageName = params.navPage;
              if (!pageName) throw new Response("Not found", { status: 404 });

              const page = await import(
                `../components/web/nav-content/${pageName}.mdx`
              );
              return { page: page.default };
            },
          };
        },
      },
    ],
  },
];
