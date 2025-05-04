import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudRain, Droplets, Sun, Wind, AlertTriangle, Thermometer, Umbrella, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }[];
}

interface WeatherAlert {
  type: 'temperature' | 'rain' | 'wind' | 'humidity';
  severity: 'warning' | 'danger';
  message: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  threshold: number;
}

const FarmerWeather = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
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

        const response = await fetch("http://localhost:8080/api/weather?location=Kigali", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const rawData = await response.text();
        const parsedData = JSON.parse(rawData);
        
        // Transform OpenWeather API response to our format
        const transformedData: WeatherData = {
          temperature: parsedData.main.temp,
          condition: parsedData.weather[0].main,
          humidity: parsedData.main.humidity,
          windSpeed: parsedData.wind.speed,
          forecast: [] // Since we're only getting current weather
        };
        
        setWeatherData(transformedData);
        
        // Generate alerts based on weather conditions
        const newAlerts: WeatherAlert[] = [];
        
        // Temperature alerts
        if (transformedData.temperature > 30) {
          newAlerts.push({
            type: 'temperature',
            severity: 'warning',
            message: 'High temperature alert: Consider additional irrigation',
            icon: <Thermometer className="h-5 w-5 text-orange-500" />,
            value: transformedData.temperature,
            unit: '°C',
            threshold: 30
          });
        } else if (transformedData.temperature < 10) {
          newAlerts.push({
            type: 'temperature',
            severity: 'warning',
            message: 'Low temperature alert: Protect sensitive crops',
            icon: <Thermometer className="h-5 w-5 text-blue-500" />,
            value: transformedData.temperature,
            unit: '°C',
            threshold: 10
          });
        }
        
        // Rain alerts
        if (transformedData.condition.toLowerCase().includes('rain')) {
          newAlerts.push({
            type: 'rain',
            severity: 'warning',
            message: 'Rain alert: Check drainage systems',
            icon: <Umbrella className="h-5 w-5 text-blue-500" />,
            value: 100, // Assuming 100% chance of rain
            unit: '%',
            threshold: 0
          });
        }
        
        // Wind alerts
        if (transformedData.windSpeed > 10) {
          newAlerts.push({
            type: 'wind',
            severity: 'warning',
            message: 'High wind alert: Secure equipment and structures',
            icon: <Wind className="h-5 w-5 text-yellow-500" />,
            value: transformedData.windSpeed * 3.6, // Convert to km/h
            unit: 'km/h',
            threshold: 36 // 10 m/s = 36 km/h
          });
        }
        
        // Humidity alerts
        if (transformedData.humidity > 80) {
          newAlerts.push({
            type: 'humidity',
            severity: 'warning',
            message: 'High humidity alert: Monitor for fungal diseases',
            icon: <Droplets className="h-5 w-5 text-blue-500" />,
            value: transformedData.humidity,
            unit: '%',
            threshold: 80
          });
        }
        
        setAlerts(newAlerts);
        
        // Show toast for new alerts
        if (newAlerts.length > 0) {
          toast({
            title: "Weather Alerts",
            description: `${newAlerts.length} weather alert${newAlerts.length > 1 ? 's' : ''} for your farm`,
            variant: "default",
          });
        }
      } catch (error) {
        if (!handleTokenExpiration(error, navigate, toast)) {
          console.error("Error fetching weather data:", error);
          toast({
            title: "Error",
            description: "Failed to load weather data. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();

    // Set up timer to update current time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [toast, navigate]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "clouds":
        return <Sun className="h-8 w-8 text-gray-400" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-forest"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No weather data available</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">
          Current time: {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
        </p>
      </div>

      {alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-md bg-white">
                  <div className="mt-1">{alert.icon}</div>
                  <div>
                    <p className="font-medium text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {alert.value}{alert.unit} | Threshold: {alert.threshold}{alert.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Weather at your Farm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                {getWeatherIcon(weatherData.condition)}
                <div>
                  <p className="text-4xl font-bold">{Math.round(weatherData.temperature)}°C</p>
                  <p className="text-muted-foreground capitalize">{weatherData.condition}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="font-medium">{weatherData.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="font-medium">{Math.round(weatherData.windSpeed * 3.6)} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Alert Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Temperature Alerts</p>
                <div className="text-xs text-muted-foreground">
                  <p>• High Temperature: {">"} 30°C</p>
                  <p>• Low Temperature: {"<"} 10°C</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Other Alerts</p>
                <div className="text-xs text-muted-foreground">
                  <p>• Wind Speed: {">"} 36 km/h (10 m/s)</p>
                  <p>• Humidity: {">"} 80%</p>
                  <p>• Rain: Any precipitation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerWeather;
