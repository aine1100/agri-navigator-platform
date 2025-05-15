import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ShoppingCart, Package, Search, Scale, Calendar, ArrowUpDown, X, Info } from "lucide-react";
import { JwtPayload } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  const [sortBy, setSortBy] = useState<string>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Livestock | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
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
      console.log(data)
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
      const response = await fetch(`http://localhost:8080/api/cart`, {
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

  const getUniqueCategories = () => {
    const categories = new Set(livestock.map(item => item.type));
    return Array.from(categories);
  };

  const sortLivestock = (items: Livestock[]) => {
    let sortedItems = [...items];
    
    switch (sortBy) {
      case "price-low":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        sortedItems.sort((a, b) => new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime());
        break;
      case "oldest":
        sortedItems.sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
        break;
      default:
        break;
    }

    if (selectedCategory !== "all") {
      sortedItems = sortedItems.filter(item => item.type === selectedCategory);
    }

    return sortedItems;
  };

  const filteredAndSortedLivestock = sortLivestock(
    livestock.filter(item =>
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.farmer && `${item.farmer.firstName} ${item.farmer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedLivestock.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredAndSortedLivestock.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by type, breed, description, or farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Products</SelectItem>
                <SelectItem value="oldest">Oldest Products</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        filteredAndSortedLivestock.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-semibold mb-2">No livestock found</h2>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((item) => (
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
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
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
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Product Details
                    </Button>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )
      )}

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>{selectedProduct.type}</span>
                  <Badge variant="secondary">{selectedProduct.status}</Badge>
                </DialogTitle>
                <DialogDescription>
                  Breed: {selectedProduct.breed}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-video">
                  <img
                    src={selectedProduct.imageUrls.startsWith('http') ? selectedProduct.imageUrls : `http://localhost:8080${selectedProduct.imageUrls}`}
                    alt={selectedProduct.type}
                    className="object-cover rounded-md w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-livestock.jpg';
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-gray-500" />
                          <span>Weight: {selectedProduct.weight} kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Birth Date: {new Date(selectedProduct.birthDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Price & Stock</h3>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold">${selectedProduct.price}</div>
                        <div className="text-sm text-gray-500">
                          Available: {selectedProduct.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedProduct.farmer && (
                    <div>
                      <h3 className="font-semibold mb-2">Seller Information</h3>
                      <div className="text-sm text-gray-600">
                        {selectedProduct.farmer.firstName} {selectedProduct.farmer.lastName}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => decrementQuantity(selectedProduct.livestockId)}
                      disabled={quantities[selectedProduct.livestockId] <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantities[selectedProduct.livestockId] || 1}
                      onChange={(e) => handleQuantityChange(selectedProduct.livestockId, e.target.value)}
                      className="w-16 text-center"
                      min="1"
                      max={selectedProduct.quantity}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => incrementQuantity(selectedProduct.livestockId, selectedProduct.quantity)}
                      disabled={quantities[selectedProduct.livestockId] >= selectedProduct.quantity}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.quantity === 0 || quantities[selectedProduct.livestockId] > selectedProduct.quantity}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerDashboard;