import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./routes/Home";
import { WebLayout } from "./routes/web/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* <Route element={<AppLayout />}></Route> */}

          <Route element={<WebLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
