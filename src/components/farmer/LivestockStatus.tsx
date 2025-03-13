
import { Badge } from "@/components/ui/badge";

type Status = 'healthy' | 'attention' | 'critical';

interface LivestockProps {
  type: string;
  count: number;
  healthStatus: Status;
}

const LivestockStatus: React.FC<LivestockProps> = ({ type, count, healthStatus }) => {
  const getStatusColor = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'bg-farm-green text-white';
      case 'attention':
        return 'bg-amber-500 text-white';
      case 'critical':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div>
        <p className="font-medium">{type}</p>
        <p className="text-xs text-muted-foreground">{count} animals</p>
      </div>
      <Badge className={getStatusColor()}>
        {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
      </Badge>
    </div>
  );
};

export default LivestockStatus;
