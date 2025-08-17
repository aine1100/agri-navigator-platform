import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://hingabackend-production.up.railway.app/api/auth/v2/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.text();
      if (res.ok) {
        toast({ title: "Success", description: data });
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
      <form onSubmit={handleRequest} className="w-full max-w-md bg-white p-8 rounded shadow space-y-6">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-gray-500 text-center">Enter your email to receive a password reset link.</p>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/login" className="text-farm-forest hover:underline">Back to Login</Link>
          {/* For demo/testing only: link to confirm page */}
          <Link to="/reset-password/confirm" className="text-blue-500 hover:underline">Have a token?</Link>
        </div>
      </form>
    </div>
  );
};

export default RequestResetPassword;
