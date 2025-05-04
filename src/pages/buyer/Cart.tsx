import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Trash2, Plus, Minus } from "lucide-react";

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

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      console.log(token)
      const decoded = jwtDecode(token);
      const response = await fetch(`http://localhost:8080/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      setCartItems(data);
      console.log(data)
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

  const updateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update cart");
      
      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (cartId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const decoded = jwtDecode(token);
      
      const response = await fetch(`http://localhost:8080/api/cart/${cartId}/${decoded.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove item");
      
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
      
      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const decoded = jwtDecode(token);
      
      const response = await fetch(`http://localhost:8080/api/cart/clear/${decoded.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to clear cart");
      
      toast({
        title: "Success",
        description: "Cart cleared",
      });
      
      setCartItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const proceedToCheckout = () => {
    navigate("/buyer/checkout");
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={() => navigate("/buyer/dashboard")}>
          Continue Shopping
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
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 relative">
                      <img
                        src={
                          item.imageUrls?.startsWith('http')
                            ? item.imageUrls
                            : `http://localhost:8080${item.imageUrls || '/placeholder.svg'}`
                        }
                        alt={item.type}
                        className="object-cover rounded-md w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-livestock.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.type}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ${item.totalPrice}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" onClick={proceedToCheckout}>
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;