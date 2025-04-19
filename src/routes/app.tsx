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
          const client = createClient();
          const { error } = await client.auth.getUser();
          if (error) location.href = "/login";
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
