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
import UserTypeSelection from "./UserTypeSelection";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode:"onChange"
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    console.log("Attempting form submission with data:", data);
    try {
      const response = await fetch("http://localhost:8080/api/auth/farmerLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (response.ok) {
        // Extract token from response
        const tokenMatch = responseText.match(/Token: (.+)$/);
        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          // Store token in localStorage
          localStorage.setItem("token", token);
          
          console.log("Login successful");
          toast({
            title: "Login successful!",
            description: "Welcome back to Farm Management System.",
          });
          setShowTypeSelection(true);
        } else {
          throw new Error("Token not found in response");
        }
      } else {
        const errorMessage = responseText || "Login failed. Please try again.";
        console.error("Login failed:", response.status, response.statusText);
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
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

  const handleUserTypeSelection = (type: "farmer" | "admin") => {
    toast({
      title: "Login successful",
      description: `Welcome back to your ${type === "farmer" ? "farm" : "admin"} dashboard!`,
    });
    
    if (type === "admin") {
      navigate("/admin");
    } else {
      navigate("/farmer");
    }
  };

  if (showTypeSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-farm-wheat/30 to-background p-4">
        <UserTypeSelection onSelect={handleUserTypeSelection} />
      </div>
    );
  }

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
          <Button type="submit" className="w-full bg-farm-forest hover:bg-farm-forest/90" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default LoginForm;
