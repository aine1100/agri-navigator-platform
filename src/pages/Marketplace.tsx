
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Filter, Store } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data - would connect to a database in a real application
const allProducts = [
  {
    id: "1",
    name: "Organic Corn",
    category: "Crops",
    price: 3.99,
    quantity: 50,
    unit: "kg",
    description: "Fresh organic corn harvested this season",
    image: "/placeholder.svg",
    farmerName: "John Smith",
    farmId: "farm1",
    location: "Green Valley"
  },
  {
    id: "2",
    name: "Fresh Eggs",
    category: "Animal Products",
    price: 4.50,
    quantity: 30,
    unit: "dozen",
    description: "Free-range chicken eggs",
    image: "/placeholder.svg",
    farmerName: "Sarah Johnson",
    farmId: "farm2",
    location: "Sunny Fields"
  },
  {
    id: "3",
    name: "Organic Tomatoes",
    category: "Vegetables",
    price: 2.99,
    quantity: 40,
    unit: "kg",
    description: "Locally grown organic tomatoes",
    image: "/placeholder.svg",
    farmerName: "Mike Davis",
    farmId: "farm3",
    location: "Riverside Farm"
  },
  {
    id: "4",
    name: "Raw Honey",
    category: "Other",
    price: 8.99,
    quantity: 15,
    unit: "liter",
    description: "Pure, unfiltered honey from our bee farm",
    image: "/placeholder.svg",
    farmerName: "Emma Wilson",
    farmId: "farm4",
    location: "Meadow Bee Farm"
  },
  {
    id: "5",
    name: "Grass-fed Beef",
    category: "Animal Products",
    price: 12.99,
    quantity: 20,
    unit: "kg",
    description: "Premium grass-fed beef from pasture-raised cattle",
    image: "/placeholder.svg",
    farmerName: "Robert Green",
    farmId: "farm5",
    location: "Green Pastures"
  },
  {
    id: "6",
    name: "Organic Apples",
    category: "Fruits",
    price: 3.49,
    quantity: 45,
    unit: "kg",
    description: "Freshly picked organic apples",
    image: "/placeholder.svg",
    farmerName: "John Smith",
    farmId: "farm1",
    location: "Green Valley"
  },
];

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  farmerName: string;
  unit: string;
};

const Marketplace = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Filter products based on search term and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: typeof allProducts[0]) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          farmerName: product.farmerName,
          unit: product.unit
        }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    toast({
      title: "Order placed successfully!",
      description: "Your order has been placed and farmers have been notified.",
    });
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Farm Fresh Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase fresh products directly from local farmers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, farmers, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="md:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Crops">Crops</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Animal Products">Animal Products</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={() => setShowCart(!showCart)}
          variant="outline"
          className="relative"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span>Cart</span>
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-farm-forest">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart slide-in panel */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 md:bg-transparent md:inset-auto md:absolute md:top-[80px] md:right-4 md:left-auto md:bottom-auto">
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 shadow-lg md:absolute md:rounded-lg md:max-h-[80vh] md:overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                Close
              </Button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-4 py-2 border-b">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Sold by: {item.farmerName}
                        </p>
                        <p className="text-sm">${item.price.toFixed(2)} per {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full bg-farm-forest hover:bg-farm-forest/90"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product listings */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter settings
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <Badge variant="outline" className="ml-2">
                    {product.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Store className="h-3.5 w-3.5 mr-1" />
                  <span>{product.farmerName}</span>
                  <span className="mx-1">•</span>
                  <span>{product.location}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    ${product.price.toFixed(2)}
                    <span className="text-sm text-muted-foreground ml-1">
                      / {product.unit}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(product)}
                    className="bg-farm-forest hover:bg-farm-forest/90"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
