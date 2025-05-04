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
  role: z.enum(["FARMER", "BUYER"], { required_error: "Please select your role" }),
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
      role: "FARMER",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const loginData = {
        email: data.email,
        password: data.password,
        role: data.role,
        firstName: null,
        lastName: null,
        phone: null,
        address: null,
        resetToken: null
      };

      const response = await fetch("http://localhost:8080/api/auth/v2/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (response.ok) {
        const tokenMatch = responseText.match(/Token: (.+)$/);
        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          localStorage.setItem("token", token);
          
          toast({
            title: "Login successful!",
            description: "Welcome back to Farm Management System.",
          });
          
          // Redirect based on role
          if (data.role === "BUYER") {
            navigate("/buyer");
          } else {
            navigate("/farmer");
          }
        } else {
          throw new Error("Token not found in response");
        }
      } else {
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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FARMER">Farmer</SelectItem>
                    <SelectItem value="BUYER">Buyer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-farm-forest hover:underline text-sm">
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
