import React from "react";
import Header from "@/components/layouts/Header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart2, 
  BarChart,
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateChartData, formatNumber, formatPercentage } from "@/lib/chart-utils";

export default function Analytics() {
  // Generate sample data for charts
  const marketPerformance = generateChartData(19500, 0.15, 0.6);
  const sectorPerformance = [
    { name: "IT", value: 14.2 },
    { name: "Banking", value: 9.6 },
    { name: "Pharma", value: 7.8 },
    { name: "Auto", value: 6.5 },
    { name: "Energy", value: 4.2 },
    { name: "FMCG", value: 3.1 }
  ];
  
  const strategyPerformance = [
    { name: "IT Sector Rotation", value: 15.7 },
    { name: "Defensive Portfolio", value: 8.9 },
    { name: "PSU Banking", value: 11.5 },
    { name: "Pharma Momentum", value: 7.2 },
    { name: "Small Cap Value", value: 14.1 }
  ];
  
  const monthlyReturns = [
    { name: "Jan", value: 3.2 },
    { name: "Feb", value: -1.5 },
    { name: "Mar", value: 2.8 },
    { name: "Apr", value: 1.9 },
    { name: "May", value: -0.7 },
    { name: "Jun", value: 4.5 },
    { name: "Jul", value: 3.1 },
    { name: "Aug", value: 2.4 },
    { name: "Sep", value: -1.2 },
    { name: "Oct", value: 5.6 },
    { name: "Nov", value: 2.8 },
    { name: "Dec", value: 1.6 }
  ];
  
  const riskReturnData = [
    { name: "Low Risk", risk: 2.5, return: 6.2, size: 100 },
    { name: "Medium Risk", risk: 5.8, return: 12.4, size: 120 },
    { name: "High Risk", risk: 9.2, return: 18.6, size: 90 },
    { name: "Speculative", risk: 15.3, return: 24.1, size: 60 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4B7BE5'];
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-medium">{formatNumber(payload[0].value, 2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart2 className="mr-2 h-8 w-8 text-primary" />
            Market Analytics
          </h1>
          
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Download Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-gray-500 text-sm">Nifty 50</h2>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+2.34%</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">19,674.25</div>
              <div className="text-green-500 text-sm font-medium">+450.25 today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-gray-500 text-sm">Sensex</h2>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+2.12%</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">65,387.16</div>
              <div className="text-green-500 text-sm font-medium">+1,350.75 today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-gray-500 text-sm">Bank Nifty</h2>
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  <span>-0.43%</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">42,982.75</div>
              <div className="text-red-500 text-sm font-medium">-185.50 today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-gray-500 text-sm">India VIX</h2>
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+8.75%</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">15.32</div>
              <div className="text-amber-500 text-sm font-medium">+1.23 today</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-primary" />
                Market Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={marketPerformance}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(value) => value}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `${formatNumber(value, 0)}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Sector Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={sectorPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend align="center" verticalAlign="bottom" />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, 'Performance']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Strategy Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={strategyPerformance}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip formatter={(value) => [`${value}%`, 'Return']} />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Monthly Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={monthlyReturns}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip formatter={(value) => [`${value}%`, 'Return']} />
                    <Bar 
                      dataKey="value" 
                      fill={(data) => (data.value >= 0 ? '#4ade80' : '#ef4444')}
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}