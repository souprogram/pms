import { lazy } from "react";
import { createClient } from "../lib/supabase/client";
import { RouteObject } from "react-router";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    Component: lazy(() => import("./app/layout")),
    children: [
      {
        path: "/login",
        Component: lazy(() => import("./app/login")),
      },
      {
        path: "/sign-up",
        Component: lazy(() => import("./app/sign-up")),
      },
      {
        path: "/dashboard",
        Component: lazy(() => import("./app/dashboard/layout")),
        loader: async () => {
          const { error } = await createClient().auth.getUser();
          if (error) {
            throw new Response("Not found", { status: 404 });
          }
        },
        children: [
          {
            index: true,
            Component: lazy(() => import("./app/dashboard/page")),
          },
          {
            path: "new-blog",
            Component: lazy(() => import("./app/dashboard/new-blog")),
          },
        ],
      },
    ],
  },
];
