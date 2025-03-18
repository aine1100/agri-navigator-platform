
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Edit, Trash, ShoppingBag, Tags } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Create a type for our product
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  image: string;
};

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Mock data - would connect to a database in a real application
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Organic Corn",
    category: "Crops",
    price: 3.99,
    quantity: 50,
    unit: "kg",
    description: "Fresh organic corn harvested this season",
    image: "/placeholder.svg",
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
  },
];

const FarmerProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      quantity: 1,
      unit: "",
      description: "",
      image: "/placeholder.svg",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (editingProductId) {
      // Update existing product
      setProducts(
        products.map((product) =>
          product.id === editingProductId
            ? { 
                ...product, 
                name: data.name,
                category: data.category,
                price: data.price,
                quantity: data.quantity,
                unit: data.unit,
                description: data.description || "",
                image: data.image || "/placeholder.svg"
              }
            : product
        )
      );
      toast({
        title: "Product updated",
        description: `${data.name} has been updated successfully.`,
      });
      setEditingProductId(null);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        unit: data.unit,
        description: data.description || "",
        image: data.image || "/placeholder.svg",
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Product added",
        description: `${data.name} has been added to your marketplace.`,
      });
    }
    form.reset();
  };

  const handleEdit = (productId: string) => {
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      form.reset(productToEdit);
      setEditingProductId(productId);
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
    toast({
      title: "Product removed",
      description: "The product has been removed from your marketplace.",
      variant: "destructive",
    });
    if (editingProductId === productId) {
      setEditingProductId(null);
      form.reset();
    }
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Farm Products</h1>
          <p className="text-muted-foreground">
            List and manage products you want to sell in the marketplace
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              {editingProductId ? "Update Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Organic Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Crops">Crops</SelectItem>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Fruits">Fruits</SelectItem>
                          <SelectItem value="Animal Products">Animal Products</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0.01" 
                            placeholder="0.00" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            step="1" 
                            placeholder="1" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="lb">Pound (lb)</SelectItem>
                          <SelectItem value="unit">Unit</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product..." 
                          className="resize-none" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-2">
                  {editingProductId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="bg-farm-forest hover:bg-farm-forest/90"
                  >
                    {editingProductId ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Listed Products</h2>
          {products.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-lg font-medium">No products listed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your first product to start selling in the marketplace.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium line-clamp-1">{product.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Tags className="h-3 w-3" />
                              <span>{product.category}</span>
                            </div>
                          </div>
                          <div className="font-medium text-right">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="text-sm">
                            {product.quantity} {product.unit} available
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(product.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProducts;
