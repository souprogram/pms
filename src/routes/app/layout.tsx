import { Outlet } from "react-router";
import { Toaster } from "../../components/ui/sonner";

export default function AppLayout() {
  return (
    <div className="font-poppins">
      <Outlet />
      <Toaster />
    </div>
  );
}
