
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: 'Jan', income: 4000, expenses: 2400 },
  { month: 'Feb', income: 3000, expenses: 1398 },
  { month: 'Mar', income: 2000, expenses: 3800 },
  { month: 'Apr', income: 2780, expenses: 3908 },
  { month: 'May', income: 1890, expenses: 4800 },
  { month: 'Jun', income: 2390, expenses: 3800 },
];

const FinancialSummary = () => {
  const currentBalance = data.reduce((acc, curr) => acc + (curr.income - curr.expenses), 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Financial Summary</CardTitle>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">Current Balance</span>
          <span className={`text-xl font-bold ${currentBalance >= 0 ? 'text-farm-green' : 'text-destructive'}`}>
            ${currentBalance.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} tickMargin={5} />
              <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} width={40} />
              <Tooltip 
                formatter={(value) => [`$${value}`, '']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="income" name="Income" fill="#57CC99" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#97664A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
