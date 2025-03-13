
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: 'Jan', crops: 4000, livestock: 2400 },
  { month: 'Feb', crops: 3000, livestock: 1398 },
  { month: 'Mar', crops: 2000, livestock: 3800 },
  { month: 'Apr', crops: 2780, livestock: 3908 },
  { month: 'May', crops: 1890, livestock: 4800 },
  { month: 'Jun', crops: 2390, livestock: 3800 },
  { month: 'Jul', crops: 3490, livestock: 4300 },
];

const ProductionStats = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Production Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="crops" 
                name="Crop Production (tons)" 
                stroke="#2C5F2D" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="livestock" 
                name="Livestock Production (units)" 
                stroke="#97664A" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionStats;
