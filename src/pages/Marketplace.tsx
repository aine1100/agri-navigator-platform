
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
import { Search, ShoppingCart, Filter, Store, Trash, CreditCard, CheckCircle, ArrowRight, Home, User, LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

type PaymentMethod = "credit-card" | "bank-transfer" | "cash-on-delivery";

const Marketplace = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: typeof allProducts[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
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

  const initiateCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    setShowPaymentDialog(true);
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentComplete(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setPaymentComplete(false);
        setShowPaymentDialog(false);
        handleCheckout();
      }, 2000);
    }, 1500);
  };

  const handleCheckout = () => {
    toast({
      title: "Order placed successfully!",
      description: "Your order has been placed and farmers have been notified.",
    });
    setCart([]);
  };

  const formatCardNumber = (value: string) => {
    const rawValue = value.replace(/\s+/g, '');
    const parts = [];
    
    for (let i = 0; i < rawValue.length; i += 4) {
      parts.push(rawValue.substring(i, i + 4));
    }
    
    return parts.join(' ').trim();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-farm-forest text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center">
              <Store className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">Farm Fresh</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-gray-200 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
              </Link>
              <Link to="/marketplace" className="hover:text-gray-200 flex items-center font-bold border-b-2 border-white">
                <Store className="h-4 w-4 mr-1" />
                <span>Marketplace</span>
              </Link>
              <Link to="/farmer" className="hover:text-gray-200 flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Farmer Portal</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-gray-200 flex items-center">
              <LogIn className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link to="/signup" className="bg-white text-farm-forest px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
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
                <SelectItem value="all">All Categories</SelectItem>
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
            <span>{showCart ? "Hide Cart" : "Show Cart"}</span>
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-farm-forest">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Store className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter settings
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          {showCart && (
            <div className="border rounded-lg shadow-sm p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <span className="text-sm text-muted-foreground">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[50vh] overflow-auto">
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
                      onClick={initiateCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[500px]">
            {paymentComplete ? (
              <div className="py-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <DialogTitle className="text-xl mb-2">Payment Successful!</DialogTitle>
                <DialogDescription>
                  Your order is confirmed and the farmers have been notified.
                </DialogDescription>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Complete Your Purchase</DialogTitle>
                  <DialogDescription>
                    Select a payment method and enter your details to complete your order.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label>Select Payment Method</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={paymentMethod === "credit-card" ? "default" : "outline"}
                        className={`flex-1 ${paymentMethod === "credit-card" ? "bg-farm-forest hover:bg-farm-forest/90" : ""}`}
                        onClick={() => setPaymentMethod("credit-card")}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "bank-transfer" ? "default" : "outline"}
                        className={`flex-1 ${paymentMethod === "bank-transfer" ? "bg-farm-forest hover:bg-farm-forest/90" : ""}`}
                        onClick={() => setPaymentMethod("bank-transfer")}
                      >
                        Bank Transfer
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "cash-on-delivery" ? "default" : "outline"}
                        className={`flex-1 ${paymentMethod === "cash-on-delivery" ? "bg-farm-forest hover:bg-farm-forest/90" : ""}`}
                        onClick={() => setPaymentMethod("cash-on-delivery")}
                      >
                        Cash on Delivery
                      </Button>
                    </div>
                  </div>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "bank-transfer" && (
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-md text-sm">
                        <p className="font-medium mb-2">Bank Transfer Details:</p>
                        <p>Bank Name: Farm Fresh Bank</p>
                        <p>Account Name: Farm Fresh Marketplace</p>
                        <p>Account Number: 1234567890</p>
                        <p>Sort Code: 12-34-56</p>
                        <p>Reference: Your Order #</p>
                        <p className="mt-2 italic">Please use your order number as reference when making the transfer.</p>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "cash-on-delivery" && (
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-md text-sm">
                        <p>You will pay for your order when it's delivered to your address.</p>
                        <p className="mt-2">Please have the exact amount ready to ensure a smooth delivery process.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPaymentDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    className="bg-farm-forest hover:bg-farm-forest/90"
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? "Processing..." : "Complete Payment"}
                    {!isProcessingPayment && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Store className="h-6 w-6 mr-2 text-farm-forest" />
                <span className="font-bold text-xl">Farm Fresh</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting farmers directly to consumers for fresher, more sustainable food.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-farm-forest">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-farm-forest">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/farmer" className="text-sm text-muted-foreground hover:text-farm-forest">
                    Become a Farmer
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-farm-forest">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>123 Farm Road, Countryside</p>
                <p>Email: info@farmfresh.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Farm Fresh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
