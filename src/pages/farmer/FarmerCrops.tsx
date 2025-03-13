
import { Seed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CropProgress from "@/components/farmer/CropProgress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Crop {
  id: number;
  name: string;
  plantedDate: string;
  harvestDate: string;
  progress: number;
  daysToHarvest: number;
}

const FarmerCrops = () => {
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([
    { 
      id: 1, 
      name: "Wheat", 
      plantedDate: "2023-04-15", 
      harvestDate: "2023-07-15", 
      progress: 75, 
      daysToHarvest: 21 
    },
    { 
      id: 2, 
      name: "Corn", 
      plantedDate: "2023-05-01", 
      harvestDate: "2023-08-01", 
      progress: 60, 
      daysToHarvest: 40 
    },
    { 
      id: 3, 
      name: "Soybeans", 
      plantedDate: "2023-05-15", 
      harvestDate: "2023-09-15", 
      progress: 45, 
      daysToHarvest: 62 
    },
    { 
      id: 4, 
      name: "Barley", 
      plantedDate: "2023-03-10", 
      harvestDate: "2023-06-10", 
      progress: 90, 
      daysToHarvest: 5 
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      plantedDate: "",
      harvestDate: "",
    },
  });

  const onSubmit = (data: any) => {
    // Calculate days between now and harvest date
    const today = new Date();
    const harvestDate = new Date(data.harvestDate);
    const daysToHarvest = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate progress based on planted date and harvest date
    const plantedDate = new Date(data.plantedDate);
    const totalDays = Math.ceil((harvestDate.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min(Math.max(Math.round((elapsedDays / totalDays) * 100), 0), 100);
    
    // Add new crop
    const newCrop: Crop = {
      id: crops.length + 1,
      name: data.name,
      plantedDate: data.plantedDate,
      harvestDate: data.harvestDate,
      progress,
      daysToHarvest: daysToHarvest > 0 ? daysToHarvest : 0,
    };
    
    setCrops([...crops, newCrop]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Crop added",
      description: `${data.name} has been added to your crops.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Crops</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
              <DialogDescription>
                Enter the details of your new crop.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wheat, Corn, etc." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plantedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planting Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="harvestDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Harvest Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Crop</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <Card key={crop.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{crop.name}</CardTitle>
                  <CardDescription>Planted: {new Date(crop.plantedDate).toLocaleDateString()}</CardDescription>
                </div>
                <div className="bg-farm-forest/10 w-8 h-8 flex items-center justify-center rounded-full">
                  <Seed className="h-4 w-4 text-farm-forest" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CropProgress 
                  crop={crop.name} 
                  progress={crop.progress} 
                  daysToHarvest={crop.daysToHarvest} 
                />
                <div className="text-xs text-muted-foreground">
                  Expected harvest: {new Date(crop.harvestDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmerCrops;
