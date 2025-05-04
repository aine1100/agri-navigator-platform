import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ShoppingCart, Package, Search, Scale, Calendar } from "lucide-react";
import { JwtPayload } from "@/types/auth";

interface Livestock {
  livestockId: number;
  type: string;
  breed: string;
  count: number;
  description: string;
  weight: number;
  price: number;
  quantity: number;
  status: string;
  birthDate: string;
  imageUrls: string;
  farmer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface CartItem {
  id: number;
  livestock: Livestock;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const BuyerDashboard = () => {
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLivestock();
    fetchCartItems();
  }, []);

  const fetchLivestock = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8080/api/livestock/v2/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view livestock",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to fetch livestock");
      }

      const data = await response.json();
      setLivestock(data);
      // Initialize quantities to 1 for each livestock item
      const initialQuantities = data.reduce((acc: { [key: number]: number }, item: Livestock) => {
        acc[item.livestockId] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load livestock data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const decoded = jwtDecode<JwtPayload>(token);
      const response = await fetch(`http://localhost:8080/api/cart/user/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        console.log("User not authorized to access cart");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (livestock: Livestock) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const decoded = jwtDecode<JwtPayload>(token);
      const selectedQuantity = quantities[livestock.livestockId] || 1;

      if (selectedQuantity > livestock.quantity) {
        toast({
          title: "Error",
          description: `Cannot add ${selectedQuantity} items. Only ${livestock.quantity} available.`,
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://localhost:8080/api/cart/create-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          livestock: { livestockId: livestock.livestockId },
          buyer: { id: decoded.id },
          quantity: selectedQuantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      toast({
        title: "Success",
        description: `${selectedQuantity} ${livestock.type} added to cart`,
      });

      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartId: number) => {
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

      if (!response.ok) throw new Error("Failed to remove from cart");

      toast({
        title: "Success",
        description: "Item removed from cart",
      });

      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateCartQuantity = async (cartId: number, newQuantity: number) => {
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
        description: "Failed to update cart quantity",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (livestockId: number, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setQuantities({ ...quantities, [livestockId]: 1 });
    } else {
      setQuantities({ ...quantities, [livestockId]: numValue });
    }
  };

  const incrementQuantity = (livestockId: number, maxQuantity: number) => {
    const currentQuantity = quantities[livestockId] || 1;
    if (currentQuantity < maxQuantity) {
      setQuantities({ ...quantities, [livestockId]: currentQuantity + 1 });
    }
  };

  const decrementQuantity = (livestockId: number) => {
    const currentQuantity = quantities[livestockId] || 1;
    if (currentQuantity > 1) {
      setQuantities({ ...quantities, [livestockId]: currentQuantity - 1 });
    }
  };

  const filteredLivestock = livestock.filter(item =>
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.farmer && `${item.farmer.firstName} ${item.farmer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Livestock Market</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/buyer/orders")}>
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Button>
          <Button variant="outline" onClick={() => navigate("/buyer/cart")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cartItems.length})
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by type, breed, description, or farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLivestock.map((item) => (
            <Card key={item.livestockId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{item.type}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {item.status}
                  </span>
                </CardTitle>
                <CardDescription>
                  Breed: {item.breed}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative mb-4">
                  <img
                    src={item.imageUrls.startsWith('http') ? item.imageUrls : `http://localhost:8080${item.imageUrls}`}
                    alt={item.type}
                    className="object-cover rounded-md w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-livestock.jpg';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{item.weight} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{new Date(item.birthDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">${item.price}</span>
                  <span className="text-sm text-gray-500">
                    Available: {item.quantity}
                  </span>
                </div>
                {item.farmer && (
                  <div className="mt-2 text-sm text-gray-500 mb-4">
                    Seller: {item.farmer.firstName} {item.farmer.lastName}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decrementQuantity(item.livestockId)}
                    disabled={quantities[item.livestockId] <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantities[item.livestockId] || 1}
                    onChange={(e) => handleQuantityChange(item.livestockId, e.target.value)}
                    className="w-16 text-center"
                    min="1"
                    max={item.quantity}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => incrementQuantity(item.livestockId, item.quantity)}
                    disabled={quantities[item.livestockId] >= item.quantity}
                  >
                    +
                  </Button>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Remaining in stock: {Math.max(0, item.quantity - (quantities[item.livestockId] || 1))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => addToCart(item)}
                  disabled={item.quantity === 0 || quantities[item.livestockId] > item.quantity}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Total Items: {cartItems.length}
              </p>
              <p className="text-sm text-gray-500">
                Total: $
                {cartItems.reduce((sum, item) => sum + item.totalPrice, 0)}
              </p>
            </div>
            <Button
              onClick={() => navigate("/buyer/checkout")}
              className="bg-green-600 hover:bg-green-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;