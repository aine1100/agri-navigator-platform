
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeatherWidget from "@/components/farmer/WeatherWidget";
import { CloudRain, Droplets, Sun, Wind } from "lucide-react";

const weatherLocations = [
  { 
    id: 1,
    location: "Main Farm",
    temperature: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: "Today", high: 24, low: 18, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Tomorrow", high: 26, low: 17, condition: "Sunny", precipitation: 0 },
      { day: "Wednesday", high: 25, low: 16, condition: "Sunny", precipitation: 0 },
      { day: "Thursday", high: 23, low: 15, condition: "Cloudy", precipitation: 40 },
      { day: "Friday", high: 20, low: 14, condition: "Rain", precipitation: 70 },
    ]
  },
  { 
    id: 2,
    location: "North Field",
    temperature: 23,
    condition: "Sunny",
    humidity: 60,
    windSpeed: 10,
    forecast: [
      { day: "Today", high: 23, low: 16, condition: "Sunny", precipitation: 0 },
      { day: "Tomorrow", high: 25, low: 17, condition: "Sunny", precipitation: 0 },
      { day: "Wednesday", high: 24, low: 15, condition: "Partly Cloudy", precipitation: 10 },
      { day: "Thursday", high: 22, low: 14, condition: "Cloudy", precipitation: 30 },
      { day: "Friday", high: 19, low: 13, condition: "Rain", precipitation: 60 },
    ]
  },
  { 
    id: 3,
    location: "South Pasture",
    temperature: 25,
    condition: "Sunny",
    humidity: 55,
    windSpeed: 8,
    forecast: [
      { day: "Today", high: 25, low: 19, condition: "Sunny", precipitation: 0 },
      { day: "Tomorrow", high: 27, low: 18, condition: "Sunny", precipitation: 0 },
      { day: "Wednesday", high: 26, low: 17, condition: "Partly Cloudy", precipitation: 5 },
      { day: "Thursday", high: 24, low: 16, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Friday", high: 21, low: 15, condition: "Cloudy", precipitation: 50 },
    ]
  }
];

const FarmerWeather = () => {
  const [currentTab, setCurrentTab] = useState("today");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "partly cloudy":
        return <Sun className="h-8 w-8 text-gray-400" />;
      case "cloudy":
        return <CloudRain className="h-8 w-8 text-gray-500" />;
      case "rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">
          Current time: {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherLocations.map((location) => (
          <WeatherWidget
            key={location.id}
            location={location.location}
            temperature={location.temperature}
            condition={location.condition}
            humidity={location.humidity}
            windSpeed={location.windSpeed}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid grid-cols-3">
              {weatherLocations.map((location, index) => (
                <TabsTrigger key={location.id} value={index.toString()}>
                  {location.location}
                </TabsTrigger>
              ))}
            </TabsList>
            {weatherLocations.map((location, index) => (
              <TabsContent key={location.id} value={index.toString()}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                  {location.forecast.map((day, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardHeader className="p-3 bg-muted/50">
                        <CardTitle className="text-sm font-medium">{day.day}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-center">
                        <div className="mb-2">{getWeatherIcon(day.condition)}</div>
                        <div className="font-bold text-lg">{day.high}°C</div>
                        <div className="text-sm text-muted-foreground">{day.low}°C</div>
                        <div className="mt-2 flex items-center justify-center text-xs">
                          <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                          <span>{day.precipitation}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-md bg-yellow-50 border-yellow-200">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Wind className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <h3 className="font-medium">High Winds Expected</h3>
                <p className="text-sm text-muted-foreground">Thursday - Wind speeds up to 30km/h expected in the afternoon.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 border rounded-md bg-blue-50 border-blue-200">
              <div className="bg-blue-100 p-2 rounded-full">
                <CloudRain className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">Heavy Rain</h3>
                <p className="text-sm text-muted-foreground">Friday - Potential for heavy rainfall, 20-30mm expected.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerWeather;
