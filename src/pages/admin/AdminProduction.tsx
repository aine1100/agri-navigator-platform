
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionStats from "@/components/admin/ProductionStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, GrainIcon, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CropProduction {
  id: number;
  crop: string;
  totalAcres: number;
  estimatedYield: number;
  actualYield: number;
  farmName: string;
  region: string;
  harvestDate: string;
}

interface LivestockProduction {
  id: number;
  type: string;
  count: number;
  weight: number;
  farmName: string;
  region: string;
  lastUpdated: string;
}

const cropData: CropProduction[] = [
  {
    id: 1,
    crop: "Wheat",
    totalAcres: 450,
    estimatedYield: 13500,
    actualYield: 14200,
    farmName: "Green Valley Farm",
    region: "California",
    harvestDate: "2023-07-15",
  },
  {
    id: 2,
    crop: "Corn",
    totalAcres: 320,
    estimatedYield: 19200,
    actualYield: 18500,
    farmName: "Sunrise Acres",
    region: "Iowa",
    harvestDate: "2023-08-10",
  },
  {
    id: 3,
    crop: "Soybeans",
    totalAcres: 280,
    estimatedYield: 8400,
    actualYield: 8600,
    farmName: "Williams Organic",
    region: "Oregon",
    harvestDate: "2023-09-05",
  },
  {
    id: 4,
    crop: "Barley",
    totalAcres: 180,
    estimatedYield: 5400,
    actualYield: 5200,
    farmName: "Smith Family Farm",
    region: "Montana",
    harvestDate: "2023-07-20",
  },
  {
    id: 5,
    crop: "Rice",
    totalAcres: 210,
    estimatedYield: 14700,
    actualYield: 15100,
    farmName: "Delta Fields",
    region: "Mississippi",
    harvestDate: "2023-08-25",
  },
];

const livestockData: LivestockProduction[] = [
  {
    id: 1,
    type: "Cattle",
    count: 150,
    weight: 82500,
    farmName: "Johnson Ranch",
    region: "Texas",
    lastUpdated: "2023-06-12",
  },
  {
    id: 2,
    type: "Pigs",
    count: 320,
    weight: 35200,
    farmName: "Wilson Farms",
    region: "North Carolina",
    lastUpdated: "2023-06-15",
  },
  {
    id: 3,
    type: "Chickens",
    count: 2500,
    weight: 6250,
    farmName: "Peterson Poultry",
    region: "Georgia",
    lastUpdated: "2023-06-10",
  },
  {
    id: 4,
    type: "Sheep",
    count: 180,
    weight: 16200,
    farmName: "Highland Meadows",
    region: "Wyoming",
    lastUpdated: "2023-06-08",
  },
  {
    id: 5,
    type: "Goats",
    count: 95,
    weight: 4750,
    farmName: "Miller Farms",
    region: "Colorado",
    lastUpdated: "2023-06-11",
  },
];

const AdminProduction = () => {
  const [crops, setCrops] = useState(cropData);
  const [livestock, setLivestock] = useState(livestockData);
  const [cropSortBy, setCropSortBy] = useState("crop");
  const [cropSortOrder, setCropSortOrder] = useState<"asc" | "desc">("asc");
  const [livestockSortBy, setLivestockSortBy] = useState("type");
  const [livestockSortOrder, setLivestockSortOrder] = useState<"asc" | "desc">("asc");

  const sortCrops = (field: string) => {
    if (cropSortBy === field) {
      setCropSortOrder(cropSortOrder === "asc" ? "desc" : "asc");
    } else {
      setCropSortBy(field);
      setCropSortOrder("asc");
    }

    setCrops([...crops].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === "string") {
        return cropSortOrder === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return cropSortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    }));
  };

  const sortLivestock = (field: string) => {
    if (livestockSortBy === field) {
      setLivestockSortOrder(livestockSortOrder === "asc" ? "desc" : "asc");
    } else {
      setLivestockSortBy(field);
      setLivestockSortOrder("asc");
    }

    setLivestock([...livestock].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === "string") {
        return livestockSortOrder === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return livestockSortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    }));
  };

  const totalCropAcres = crops.reduce((sum, crop) => sum + crop.totalAcres, 0);
  const totalCropYield = crops.reduce((sum, crop) => sum + crop.actualYield, 0);
  const totalLivestockCount = livestock.reduce((sum, animal) => sum + animal.count, 0);
  const totalLivestockWeight = livestock.reduce((sum, animal) => sum + animal.weight, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Production Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Acres</CardTitle>
            <Tractor className="h-4 w-4 text-farm-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCropAcres.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Acres under cultivation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Crop Yield</CardTitle>
            <GrainIcon className="h-4 w-4 text-farm-wheat" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCropYield.toLocaleString()} tons</div>
            <p className="text-xs text-muted-foreground">Current growing season</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Livestock Count</CardTitle>
            <Tractor className="h-4 w-4 text-farm-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLivestockCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Animals in production</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Livestock Weight</CardTitle>
            <Tractor className="h-4 w-4 text-farm-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLivestockWeight.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">Total production weight</p>
          </CardContent>
        </Card>
      </div>

      <ProductionStats />

      <Card>
        <CardHeader>
          <CardTitle>Production Details</CardTitle>
          <CardDescription>Detailed view of crop and livestock production</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="crops">
            <TabsList>
              <TabsTrigger value="crops">Crops</TabsTrigger>
              <TabsTrigger value="livestock">Livestock</TabsTrigger>
            </TabsList>
            <TabsContent value="crops" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("crop")}>
                        Crop <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("totalAcres")}>
                        Acres <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("estimatedYield")}>
                        Est. Yield (tons) <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("actualYield")}>
                        Actual Yield (tons) <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("farmName")}>
                        Farm <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("region")}>
                        Region <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCrops("harvestDate")}>
                        Harvest Date <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crops.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">{crop.crop}</TableCell>
                      <TableCell>{crop.totalAcres.toLocaleString()}</TableCell>
                      <TableCell>{crop.estimatedYield.toLocaleString()}</TableCell>
                      <TableCell className={`font-medium ${crop.actualYield >= crop.estimatedYield ? 'text-farm-green' : 'text-destructive'}`}>
                        {crop.actualYield.toLocaleString()}
                      </TableCell>
                      <TableCell>{crop.farmName}</TableCell>
                      <TableCell>{crop.region}</TableCell>
                      <TableCell>{new Date(crop.harvestDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="livestock" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortLivestock("type")}>
                        Type <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortLivestock("count")}>
                        Count <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortLivestock("weight")}>
                        Total Weight (kg) <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortLivestock("farmName")}>
                        Farm <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortLivestock("region")}>
                        Region <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortLivestock("lastUpdated")}>
                        Last Updated <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livestock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.count.toLocaleString()}</TableCell>
                      <TableCell>{item.weight.toLocaleString()}</TableCell>
                      <TableCell>{item.farmName}</TableCell>
                      <TableCell>{item.region}</TableCell>
                      <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProduction;
