import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, Link } from "react-router-dom";

const ConfirmResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({ token, newPassword });
      const res = await fetch(`https://hingabackend-production.up.railway.app/api/auth/v2/reset-password/confirm?${params.toString()}`, {
        method: "POST",
      });
      const data = await res.text();
      if (res.ok) {
        toast({ title: "Success", description: data });
        setSuccess(true);
      } else {
        toast({ title: "Error", description: data, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleReset} className="w-full max-w-md bg-white p-8 rounded shadow space-y-6">
        <h2 className="text-2xl font-bold text-center">Set New Password</h2>
        <p className="text-gray-500 text-center">Enter your new password below.</p>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading || !token}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
        {!token && <div className="text-red-500 text-center">Invalid or missing token.</div>}
        {success && (
          <div className="text-green-600 text-center">
            Password reset successful! <Link to="/login" className="text-farm-forest hover:underline">Go to Login</Link>
          </div>
        )}
        <div className="flex justify-between text-sm mt-2">
          <Link to="/login" className="text-farm-forest hover:underline">Back to Login</Link>
          <Link to="/reset-password" className="text-blue-500 hover:underline">Request new link</Link>
        </div>
      </form>
    </div>
  );
};

export default ConfirmResetPassword;
