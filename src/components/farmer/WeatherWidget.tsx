
import { CloudSun, Droplets, Wind, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherWidgetProps {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  location,
  temperature,
  condition,
  humidity,
  windSpeed,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Weather at {location}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="h-10 w-10 text-farm-blue" />
            <div>
              <p className="text-2xl font-bold">{temperature}°C</p>
              <p className="text-sm text-muted-foreground">{condition}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-farm-blue" />
              <span className="text-sm">{humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-farm-blue" />
              <span className="text-sm">{windSpeed} km/h wind</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
