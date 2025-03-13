
import { Cow, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LivestockStatus from "@/components/farmer/LivestockStatus";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const livestockSchema = z.object({
  type: z.string().min(1, { message: "Livestock type is required" }),
  count: z.string().transform(val => parseInt(val)),
  healthStatus: z.enum(["healthy", "attention", "critical"]),
  notes: z.string().optional(),
});

type LivestockFormValues = z.infer<typeof livestockSchema>;

interface Livestock {
  id: number;
  type: string;
  count: number;
  healthStatus: "healthy" | "attention" | "critical";
  lastChecked: string;
  notes?: string;
}

const FarmerLivestock = () => {
  const { toast } = useToast();
  const [livestock, setLivestock] = useState<Livestock[]>([
    { 
      id: 1, 
      type: "Cattle", 
      count: 24, 
      healthStatus: "healthy", 
      lastChecked: "2023-06-15",
      notes: "All cattle vaccinated and healthy"
    },
    { 
      id: 2, 
      type: "Chickens", 
      count: 150, 
      healthStatus: "attention", 
      lastChecked: "2023-06-14",
      notes: "Some chickens showing signs of reduced appetite"
    },
    { 
      id: 3, 
      type: "Pigs", 
      count: 18, 
      healthStatus: "healthy", 
      lastChecked: "2023-06-16",
      notes: "New feed introduced"
    },
    { 
      id: 4, 
      type: "Sheep", 
      count: 45, 
      healthStatus: "critical", 
      lastChecked: "2023-06-10",
      notes: "Several sheep with suspected respiratory infection - vet visit scheduled"
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockSchema),
    defaultValues: {
      type: "",
      count: "0",
      healthStatus: "healthy",
      notes: "",
    },
  });

  const onSubmit = (data: LivestockFormValues) => {
    // Add new livestock
    const newLivestock: Livestock = {
      id: livestock.length + 1,
      type: data.type,
      count: data.count,
      healthStatus: data.healthStatus,
      lastChecked: new Date().toISOString().split('T')[0],
      notes: data.notes,
    };
    
    setLivestock([...livestock, newLivestock]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Livestock added",
      description: `${data.count} ${data.type} has been added to your livestock.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Livestock</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Livestock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Livestock</DialogTitle>
              <DialogDescription>
                Enter the details of your livestock.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Livestock Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cattle, Chickens, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select health status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="attention">Needs Attention</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Additional information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Livestock</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livestock.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.type}</CardTitle>
                  <CardDescription>Last checked: {new Date(item.lastChecked).toLocaleDateString()}</CardDescription>
                </div>
                <div className="bg-farm-forest/10 w-8 h-8 flex items-center justify-center rounded-full">
                  <Cow className="h-4 w-4 text-farm-forest" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <LivestockStatus 
                  type={item.type} 
                  count={item.count} 
                  healthStatus={item.healthStatus} 
                />
                {item.notes && (
                  <div className="text-sm">
                    <p className="font-medium">Notes:</p>
                    <p className="text-muted-foreground">{item.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmerLivestock;
