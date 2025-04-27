import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Search,
  Leaf,
  ShoppingCart,
  Filter,
  Store,
  Trash,
  CreditCard,
  CheckCircle,
  ArrowRight,
  HomeIcon,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { handleTokenExpiration } from "@/utils/auth";

// Backend base URL for API and image fetching
const BACKEND_BASE_URL = "http://localhost:8080";

// Product type based on backend database
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image?: string;
  ownerEmail?: string; // Made optional to handle undefined
  farmerName?: string; // Derived or placeholder
  farmId?: string; // Placeholder
  location?: string; // Placeholder
  quantity?: number; // Not in DB, placeholder for UI
};

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
  const navigate = useNavigate();
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
  const [products, setProducts] = useState<Product[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  // Fetch all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched products:", data);

        // Map backend data to Product type, adding placeholders
        const mappedProducts = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: product.unit,
          description: product.description || "",
          image: product.image,
          ownerEmail: product.ownerEmail,
          farmerName: product.ownerEmail,
          farmId: "1",
          location: "Rwanda",
          quantity: 100,
        }));

        setProducts(mappedProducts);

        // Fetch images with Authorization header
        const token = localStorage.getItem("token");
        const newImageUrls: { [key: string]: string } = {};
        for (const product of mappedProducts) {
          if (product.image && product.image.startsWith("/uploads/")) {
            try {
              const imageResponse = await fetch(
                `${BACKEND_BASE_URL}${product.image}`,
                {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
              );
              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                newImageUrls[product.id] = URL.createObjectURL(blob);
              } else {
                console.error(
                  `Failed to fetch image for ${product.name}: ${imageResponse.status} ${imageResponse.statusText}`
                );
                newImageUrls[product.id] = "/placeholder.svg";
              }
            } catch (error) {
              console.error(
                `Error fetching image for ${product.name}: ${product.image}`,
                error
              );
              newImageUrls[product.id] = "/placeholder.svg";
            }
          } else {
            newImageUrls[product.id] = "/placeholder.svg";
          }
        }
        setImageUrls(newImageUrls);
      } catch (error) {
        console.error("Fetch products error:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            farmerName: product.farmerName || "Unknown Farmer",
            unit: product.unit,
          },
        ];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentComplete(true);
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
    const rawValue = value.replace(/\s+/g, "");
    const parts = [];
    for (let i = 0; i < rawValue.length; i += 4) {
      parts.push(rawValue.substring(i, i + 4));
    }
    return parts.join(" ").trim();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6 md:py-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-farm-forest" />
          <span className="text-xl font-bold">Hinga</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="ghost" size="sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Marketplace
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="default" size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Hinga Marketplace</h1>
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
                <SelectItem value="CROPS">Crops</SelectItem>
                <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                <SelectItem value="FRUITS">Fruits</SelectItem>
                <SelectItem value="ANIMAL_PRODUCTS">Animal Products</SelectItem>
                <SelectItem value="DAIRY">Dairy</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
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
                        src={imageUrls[product.id] || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error(
                            `Failed to load image for ${product.name}: ${imageUrls[product.id]}`
                          );
                          e.currentTarget.src = "/placeholder.svg";
                        }}
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
                  {cart.length} {cart.length === 1 ? "item" : "items"}
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
                      <div
                        key={item.productId}
                        className="flex gap-4 py-2 border-b"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Sold by: {item.farmerName}
                          </p>
                          <p className="text-sm">
                            ${item.price.toFixed(2)} per {item.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
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
                      <span className="font-bold">
                        ${getTotalPrice().toFixed(2)}
                      </span>
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
                <DialogTitle className="text-xl mb-2">
                  Payment Successful!
                </DialogTitle>
                <DialogDescription>
                  Your order is confirmed and the farmers have been notified.
                </DialogDescription>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Complete Your Purchase</DialogTitle>
                  <DialogDescription>
                    Select a payment method and enter your details to complete
                    your order.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label>Select Payment Method</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "credit-card" ? "default" : "outline"
                        }
                        className={`flex-1 ${
                          paymentMethod === "credit-card"
                            ? "bg-farm-forest hover:bg-farm-forest/90"
                            : ""
                        }`}
                        onClick={() => setPaymentMethod("credit-card")}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </Button>
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "bank-transfer"
                            ? "default"
                            : "outline"
                        }
                        className={`flex-1 ${
                          paymentMethod === "bank-transfer"
                            ? "bg-farm-forest hover:bg-farm-forest/90"
                            : ""
                        }`}
                        onClick={() => setPaymentMethod("bank-transfer")}
                      >
                        Bank Transfer
                      </Button>
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "cash-on-delivery"
                            ? "default"
                            : "outline"
                        }
                        className={`flex-1 ${
                          paymentMethod === "cash-on-delivery"
                            ? "bg-farm-forest hover:bg-farm-forest/90"
                            : ""
                        }`}
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
                          onChange={(e) =>
                            setCardNumber(formatCardNumber(e.target.value))
                          }
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
                        <p className="font-medium mb-2">
                          Bank Transfer Details:
                        </p>
                        <p>Bank Name: Farm Fresh Bank</p>
                        <p>Account Name: Farm Fresh Marketplace</p>
                        <p>Account Number: 1234567890</p>
                        <p>Sort Code: 12-34-56</p>
                        <p>Reference: Your Order #</p>
                        <p className="mt-2 italic">
                          Please use your order number as reference when making the
                          transfer.
                        </p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === "cash-on-delivery" && (
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-md text-sm">
                        <p>
                          You will pay for your order when it's delivered to your
                          address.
                        </p>
                        <p className="mt-2">
                          Please have the exact amount ready to ensure a smooth
                          delivery process.
                        </p>
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
                    {!isProcessingPayment && (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
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
                <Leaf className="h-6 w-6 mr-2 text-farm-forest" />
                <span className="font-bold text-xl">Hinga</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting farmers directly to consumers for fresher, more
                sustainable food.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-farm-forest"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/marketplace"
                    className="text-sm text-muted-foreground hover:text-farm-forest"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    to="/farmer"
                    className="text-sm text-muted-foreground hover:text-farm-forest"
                  >
                    Become a Farmer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-muted-foreground hover:text-farm-forest"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>123 Farm Road, Countryside</p>
                <p>Email: info@Hinga.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Hinga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;