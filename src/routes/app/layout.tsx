import { Outlet } from "react-router";
import { Toaster } from "../../components/ui/sonner";

export default function AppLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
