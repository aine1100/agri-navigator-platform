
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CropProgressProps {
  crop: string;
  progress: number;
  daysToHarvest: number;
}

const CropProgress: React.FC<CropProgressProps> = ({ crop, progress, daysToHarvest }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{crop}</span>
        <span className="text-xs text-muted-foreground">{daysToHarvest} days to harvest</span>
      </div>
      <Progress value={progress} className={cn("h-2", progress < 30 ? "bg-amber-100" : "bg-farm-wheat")} />
    </div>
  );
};

export default CropProgress;
