
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Shield } from "lucide-react";

interface UserTypeSelectionProps {
  onSelect: (type: "farmer" | "admin") => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState<"farmer" | "admin" | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Choose User Type</CardTitle>
        <CardDescription>Select your role to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer hover:border-farm-forest transition-colors ${selectedType === 'farmer' ? 'border-2 border-farm-forest' : ''}`}
            onClick={() => setSelectedType("farmer")}
          >
            <CardHeader className="pb-2 flex justify-center">
              <div className="bg-farm-forest/10 w-12 h-12 flex items-center justify-center rounded-full">
                <Leaf className="h-6 w-6 text-farm-forest" />
              </div>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <h3 className="font-bold">Farmer</h3>
              <p className="text-xs text-muted-foreground">Manage your farm, crops, livestock, and finances</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer hover:border-farm-forest transition-colors ${selectedType === 'admin' ? 'border-2 border-farm-forest' : ''}`}
            onClick={() => setSelectedType("admin")}
          >
            <CardHeader className="pb-2 flex justify-center">
              <div className="bg-farm-forest/10 w-12 h-12 flex items-center justify-center rounded-full">
                <Shield className="h-6 w-6 text-farm-forest" />
              </div>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <h3 className="font-bold">Administrator</h3>
              <p className="text-xs text-muted-foreground">Manage farmers, system data, and analytics</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-farm-forest hover:bg-farm-forest/90" 
          disabled={!selectedType}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserTypeSelection;
