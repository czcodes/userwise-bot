
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for usage metrics
const commandUsageData = [
  { name: "Airflow", value: 40 },
  { name: "MongoDB", value: 30 },
  { name: "Kubernetes", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];

const trafficData = [
  { day: "Mon", queries: 120 },
  { day: "Tue", queries: 132 },
  { day: "Wed", queries: 101 },
  { day: "Thu", queries: 134 },
  { day: "Fri", queries: 90 },
  { day: "Sat", queries: 60 },
  { day: "Sun", queries: 45 },
];

const resourceUsage = {
  cpu: 42,
  memory: 65,
  storage: 37,
  network: 28,
};

export function UsageMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Command Usage Distribution</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commandUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {commandUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Daily Query Traffic</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="queries"
                    stroke="#3B82F6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">System Resource Usage</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm font-medium">{resourceUsage.cpu}%</span>
              </div>
              <Progress value={resourceUsage.cpu} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm font-medium">{resourceUsage.memory}%</span>
              </div>
              <Progress value={resourceUsage.memory} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm font-medium">{resourceUsage.storage}%</span>
              </div>
              <Progress value={resourceUsage.storage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Network Bandwidth</span>
                <span className="text-sm font-medium">{resourceUsage.network}%</span>
              </div>
              <Progress value={resourceUsage.network} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
