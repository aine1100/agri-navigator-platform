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
import { Checkbox } from "@/components/ui/checkbox";
import UserTypeSelection from "./UserTypeSelection";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onChange",
  });

  const watchedFields = form.watch();
  console.log("Current form values:", watchedFields);
  console.log("Form validation state:", {
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields
  });

  const onSubmit = async (data: SignupFormValues) => {
    console.log("Attempting form submission with data:", data);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/farmerRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Raw response:", await response.text().catch(e => `Error reading response: ${e}`));

      // If registration was successful, proceed even if JSON parsing fails
      if (response.ok) {
        console.log("Registration successful");
        toast({
          title: "Account created!",
          description: "Welcome to Farm Management System. You are registered as a farmer.",
        });
        setShowTypeSelection(true);
      } else {
        const errorMessage = "Registration failed. Please try again.";
        console.error("Registration failed:", response.status, response.statusText);
        toast({
          title: "Signup failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelection = (type: "farmer" | "admin") => {
    toast({
      title: "Account created!",
      description: `Welcome to Farm Management System. You are registered as a ${type}.`,
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
      title="Create an account"
      description="Sign up to start managing your farm"
      footer={
        <div className="text-center text-sm w-full">
          Already have an account?{" "}
          <Link to="/login" className="text-farm-forest hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form 
          onSubmit={(e) => {
            console.log("Raw form submit event triggered");
            form.handleSubmit(onSubmit)(e);
          }} 
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded border">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I accept the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-farm-forest hover:bg-farm-forest/90" 
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignupForm;