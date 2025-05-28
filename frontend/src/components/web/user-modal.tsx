import { useQueryClient } from "@tanstack/react-query";
import { LogOut, XIcon } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useProfile } from "../../hooks/use-profile";
import { supabase } from "../../lib/supabase/client";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal = ({ isOpen, onClose }: UserModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    receiveNotifications: false,
  });

  // Load profile data into form when available
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        receiveNotifications: profile.is_subscribed || false,
      });
    }
  }, [profile]);

  useEffect(() => {
    const modal = modalRef.current;

    if (isOpen) {
      modal?.showModal();
      // Allow DOM to update before showing the modal
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // Wait for the fade-out transition to complete before closing
      const timer = setTimeout(() => {
        if (modal?.open) {
          modal.close();
        }
      }, 100); // Same as the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Listen for the dialog's close event (triggered by Escape key)
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleDialogClose = () => {
      // Only call onClose if the modal is actually open in our state
      // This prevents the double-click issue
      if (isOpen) {
        onClose();
      }
    };

    modal.addEventListener("cancel", handleDialogClose);
    return () => {
      modal.removeEventListener("cancel", handleDialogClose);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the dialog element (backdrop)
    // and not on any of its children
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <dialog
      ref={modalRef}
      className={cn(
        "backdrop:bg-foreground/50 bg-background m-auto rounded-md p-6 w-full max-w-md",
        "transition-opacity duration-100 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onMouseDown={handleBackdropClick}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tvoj profil</h2>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={onClose}
            className="h-8 w-8"
          >
            <XIcon size="18" />
          </Button>
        </div>

        {isLoading ? (
          <div className="py-4 text-center">Loading profile...</div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm sm:text-base">
                  Ime
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full px-3 py-2 border"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm sm:text-base">
                  Prezime
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full px-3 py-2 border"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="receiveNotifications"
                  name="receiveNotifications"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.receiveNotifications}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="receiveNotifications"
                  className="text-sm sm:text-base"
                >
                  Želim dobivati obavijesti na mail
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating ? "Spremanje..." : "Potvrdi"}
                </Button>
              </div>
            </form>

            <div className="border-t pt-4">
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Odjavi se
              </Button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};
