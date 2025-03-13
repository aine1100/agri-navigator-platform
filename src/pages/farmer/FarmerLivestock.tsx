import { Plus, Beef } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LivestockStatus from "@/components/farmer/LivestockStatus";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Livestock {
  id: number;
  type: string;
  count: number;
  healthStatus: "healthy" | "attention" | "critical";
  lastChecked: string;
  notes: string;
}

const livestockSchema = z.object({
  type: z.string().min(2, { message: "Type must be at least 2 characters" }),
  count: z.string().transform(val => parseInt(val, 10)),
  healthStatus: z.enum(["healthy", "attention", "critical"]),
  notes: z.string().optional(),
});

const FarmerLivestock = () => {
  const { toast } = useToast();
  const [livestock, setLivestock] = useState<Livestock[]>([
    { 
      id: 1, 
      type: "Cattle", 
      count: 42, 
      healthStatus: "healthy", 
      lastChecked: "2023-06-15", 
      notes: "All cattle are healthy and well-fed." 
    },
    { 
      id: 2, 
      type: "Pigs", 
      count: 86, 
      healthStatus: "attention", 
      lastChecked: "2023-06-10", 
      notes: "Some pigs showing signs of respiratory issues. Vet scheduled for next week." 
    },
    { 
      id: 3, 
      type: "Chickens", 
      count: 120, 
      healthStatus: "healthy", 
      lastChecked: "2023-06-16", 
      notes: "Egg production steady. Added new nesting boxes." 
    },
    { 
      id: 4, 
      type: "Sheep", 
      count: 35, 
      healthStatus: "critical", 
      lastChecked: "2023-06-12", 
      notes: "Several sheep showing symptoms of potential disease. Vet coming tomorrow for emergency check-up." 
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(livestockSchema),
    defaultValues: {
      type: "",
      count: "0",
      healthStatus: "healthy",
      notes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof livestockSchema>) => {
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
                        <Textarea placeholder="Additional information" {...field} />
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
                  <Beef className="h-4 w-4 text-farm-forest" />
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
