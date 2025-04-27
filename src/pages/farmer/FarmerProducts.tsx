import { useState, useEffect } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash, ShoppingBag, Tags } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";

// Backend base URL for image fetching
const BACKEND_BASE_URL = "http://localhost:8080";

// Product type to match schema and API
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  ownerEmail?: string;
  image?: string;
};

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const FarmerProducts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({}); // Store authenticated image URLs

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      unit: "",
      description: "",
      image: undefined,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8080/api/products/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log("Fetched products:", data); // Log to inspect image URLs
      setProducts(data);

      // Fetch images with Authorization header
      const newImageUrls: { [key: string]: string } = {};
      for (const product of data) {
        if (product.image && product.image.startsWith("/uploads/")) {
          try {
            const imageResponse = await fetch(
              `${BACKEND_BASE_URL}${product.image}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
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
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!editingProductId && !data.image) {
        toast({
          title: "Error",
          description: "Product image is required for new products",
          variant: "destructive",
        });
        return;
      }

      let response;
      if (editingProductId) {
        // Update existing product (send JSON, as backend expects ProductDto)
        const productData = {
          proName: data.name,
          proDesc: data.description || "",
          proPrice: data.price,
          proUnits: data.unit.toUpperCase(),
          proCategory: data.category.toUpperCase(),
        };

        response = await fetch(
          `http://localhost:8080/api/products/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update product: ${errorText}`);
        }

        toast({
          title: "Product updated",
          description: `${data.name} has been updated successfully.`,
        });
        setEditingProductId(null);
      } else {
        // Add new product (send FormData)
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description || "");
        formData.append("price", data.price.toString());
        formData.append("unit", data.unit.toUpperCase()); // Convert to uppercase
        formData.append("category", data.category.toUpperCase()); // Convert to uppercase
        if (data.image instanceof File) {
          formData.append("image", data.image);
          console.log("Uploading image:", data.image.name); // Log image name
        }

        response = await fetch("http://localhost:8080/api/products/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add product: ${errorText}`);
        }

        toast({
          title: "Product added",
          description: `${data.name} has been added to your marketplace.`,
        });
      }

      await fetchProducts();
      form.reset();
    } catch (error: any) {
      console.error("Submission error:", error);
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: error.message || "Failed to save product",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (productId: string) => {
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      form.reset({
        name: productToEdit.name,
        category: productToEdit.category,
        price: productToEdit.price,
        unit: productToEdit.unit,
        description: productToEdit.description,
        image: undefined,
      });
      setEditingProductId(productId);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast({
        title: "Product removed",
        description: "The product has been removed from your marketplace.",
        variant: "destructive",
      });

      if (editingProductId === productId) {
        setEditingProductId(null);
        form.reset();
      }

      fetchProducts();
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
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
              <div className="space-y-4">
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
                          <SelectItem value="CROPS">Crops</SelectItem>
                          <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                          <SelectItem value="FRUITS">Fruits</SelectItem>
                          <SelectItem value="ANIMAL_PRODUCTS">
                            Animal Products
                          </SelectItem>
                          <SelectItem value="DAIRY">Dairy</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
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
                          <SelectItem value="KILOGRAM">Kilogram (kg)</SelectItem>
                          <SelectItem value="GRAM">Gram (g)</SelectItem>
                          <SelectItem value="POUND">Pound (lb)</SelectItem>
                          <SelectItem value="UNIT">Unit</SelectItem>
                          <SelectItem value="DOZEN">Dozen</SelectItem>
                          <SelectItem value="LITER">Liter</SelectItem>
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

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Product Image {editingProductId ? "(Optional)" : "(Required)"}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                          {...field}
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
                    type="button"
                    className="bg-farm-forest hover:bg-farm-forest/90"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {editingProductId ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </div>
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
              {products.map((product) => {
                const imageUrl = imageUrls[product.id] || "/placeholder.svg";
                console.log(`Rendering image for ${product.name}: ${imageUrl}`);
                return (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.error(
                                `Failed to load image for ${product.name}: ${imageUrl}`
                              );
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium line-clamp-1">
                                {product.name}
                              </h3>
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
                            <div className="text-sm">{product.unit}</div>
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProducts;