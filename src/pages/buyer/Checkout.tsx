import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CartItem {
  id: number;
  livestock: {
    livestockId: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const checkoutFormSchema = z.object({
 
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  sector: z.string().min(1, "Sector is required"),
  cell: z.string().min(1, "Cell is required"),
  village: z.string().min(1, "Village is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartId = searchParams.get("cartId");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
     
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      let url = cartId
        ? `http://localhost:8080/api/cart/${cartId}`
        : `http://localhost:8080/api/cart`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      if (cartId) {
        setCartItems([data]);
      } else {
        setCartItems(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (cartId) {
        // Single cart order
        const item = cartItems.find(item => item.id === Number(cartId));
        if (!item) {
          toast({ title: "Error", description: "No cart item selected.", variant: "destructive" });
          return;
        }
        const response = await fetch("http://localhost:8080/api/orders/create-from-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            carts: [{ id: item.id }],
          
            deliveryAddress: {
              province: data.province,
              district: data.district,
              sector: data.sector,
              cell: data.cell,
              village: data.village,
            },
          }),
        });
        if (!response.ok) throw new Error("Failed to create order");
      } else {
        // Multiple cart order
        const cartIds = cartItems.map(item => item.id);
        if (!cartIds.length) {
          toast({ title: "Error", description: "No cart items in cart.", variant: "destructive" });
          return;
        }
        const response = await fetch("http://localhost:8080/api/orders/create-from-carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cartIds,
          
            deliveryAddress: {
              province: data.province,
              district: data.district,
              sector: data.sector,
              cell: data.cell,
              village: data.village,
            },
          }),
        });
        if (!response.ok) throw new Error("Failed to create order");
      }

      toast({
        title: "Success",
        description: "Order placed successfully",
      });
      navigate("/buyer/orders");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Button variant="outline" onClick={() => navigate("/buyer/cart")}>
          Back to Cart
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg text-gray-500">Your cart is empty</p>
            <Button
              className="mt-4"
              onClick={() => navigate("/buyer/dashboard")}
            >
              Browse Livestock
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
                <CardDescription>
                  Please provide your delivery address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your district" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sector</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your sector" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cell"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cell</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your cell" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="village"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Village</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your village" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Place Order
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.livestock.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">${item.totalPrice}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout; 