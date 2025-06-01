import { LogOut, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useUserProfile } from "../../hooks/use-profile";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UserModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const UserModal = ({ isOpen, onClose }: UserModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { profile, isLoading, logout, isLoggingOut } = useUserProfile();

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
        onClose?.();
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
      onClose?.();
    }
  };

  const handleLogout = async () => {
    logout(undefined, {
      onSuccess: () => {
        onClose?.();
      },
    });
  };

  return (
    <dialog
      ref={modalRef}
      className={cn(
        "backdrop:bg-foreground/50 m-auto w-full max-w-lg transition-opacity duration-100 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onMouseDown={handleBackdropClick}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tvoj profil</CardTitle>
          <CardDescription>Ovdje možeš ažurirati svoje podatke</CardDescription>

          <Button
            variant="outline"
            className="absolute right-0 top-0 m-6 p-2"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">Loading profile...</div>
          ) : (
            profile && <UserForm onSuccess={onClose} />
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2"
            variant="outline"
            disabled={isLoggingOut}
          >
            <LogOut size={16} />
            Odjavi se
          </Button>
        </CardFooter>
      </Card>
    </dialog>
  );
};

const UserForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { profile, updateProfile, isUpdating } = useUserProfile();

  const [formData, setFormData] = useState({
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    receiveNotifications: profile.is_subscribed || false,
  });

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
      onSuccess,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="firstName">Ime</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lastName">Prezime</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
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
        <label htmlFor="receiveNotifications" className="text-sm sm:text-base">
          Želim dobivati obavijesti na mail
        </label>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="submit" disabled={isUpdating} className="w-full">
          {isUpdating ? "Spremanje..." : "Potvrdi"}
        </Button>
      </div>
    </form>
  );
};
