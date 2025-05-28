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
        path: "/dashboard",
        loader: async () => {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error || !user) {
            throw new Response("Not found", { status: 404 });
          }

          const { data: author, error: authorError } = await supabase
            .from("authors")
            .select()
            .eq("id", user.id)
            .single();

          if (authorError || !author) {
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
