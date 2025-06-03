import { lazy } from "react";
import { RouteObject } from "react-router";
import { supabase } from "../lib/supabase/client";

export const appRoutes: RouteObject[] = [
  {
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
        path: "/forgot-password",
        Component: lazy(() => import("./app/forgot-password")),
      },
      {
        path: "/update-password",
        Component: lazy(() => import("./app/update-password")),
      },
      {
        path: "/dashboard",
        loader: async () => {
          const { data: userData, error: userError } =
            await supabase.auth.getUser();

          if (userError) {
            throw new Response("Not found", { status: 404 });
          }

          const { error: authorError } = await supabase
            .from("authors")
            .select()
            .eq("id", userData.user.id)
            .single();

          if (authorError) {
            throw new Response("Not found", { status: 404 });
          }
        },
        Component: lazy(() => import("./app/dashboard/layout")),
        children: [
          {
            index: true,
            Component: lazy(() => import("./app/dashboard/page")),
          },
          {
            path: "new-blog",
            Component: lazy(() => import("./app/dashboard/new-blog")),
          },
          {
            path: "profile",
            Component: lazy(() => import("./app/dashboard/profile")),
          },
        ],
      },
    ],
  },
];
