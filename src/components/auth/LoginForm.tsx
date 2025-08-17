import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const loginData = {
        email: data.email,
        password: data.password,
        firstName: null,
        lastName: null,
        phone: null,
        address: null,
        resetToken: null
      };

      const response = await fetch("https://hingabackend-production.up.railway.app/api/auth/v2/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        let userRole = null;
        let token = null;
        let json = null;
        try {
          json = await response.json();
          userRole = json.role;
          token = json.token;
        } catch {
          // fallback to old method if needed
        }

        if (!userRole && token) {
          try {
            const decoded: any = require("jwt-decode").jwtDecode(token);
            const role = decoded.role || decoded.userRole || decoded.authorities || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            userRole = Array.isArray(role) ? role[0] : role;
            if (typeof userRole === 'object' && userRole !== null) {
              userRole = userRole.authority || userRole.role || Object.values(userRole)[0];
            }
          } catch {}
        }

        if (token) {
          localStorage.setItem("token", token);
        }

        if (userRole === "BUYER") {
          navigate("/buyer");
        } else if (userRole === "FARMER") {
          navigate("/farmer");
        } else if (userRole === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        toast({
          title: "Login successful!",
          description: "Welcome back to Farm Management System.",
        });
      } else {
        const responseText = await response.text();
        throw new Error(responseText || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your dashboard"
      footer={
        <div className="text-center text-sm w-full">
          Don't have an account?{" "}
          <Link to="/signup" className="text-farm-forest hover:underline">
            Sign up
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="farmer@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Link to="/reset-password" className="text-farm-forest hover:underline text-sm">
              Forgot password?
            </Link>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-farm-forest hover:bg-farm-forest/90" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default LoginForm;
