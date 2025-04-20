import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { supabase } from "../../../lib/supabase/client";

export default function ProfileSetup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: saveProfile,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ fullName }: { fullName: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("profiles").upsert({
        user_id: user!.id,
        full_name: fullName,
        role: "author",
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;

    saveProfile({ fullName });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="John Doe"
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>

        {error && (
          <p className="text-red-500 text-sm mt-2">Failed to save profile</p>
        )}
      </form>
    </div>
  );
}
