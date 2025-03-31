
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";

// Mock data for session analytics
const dailySessionData = [
  { name: "Mon", sessions: 20, activeUsers: 15 },
  { name: "Tue", sessions: 15, activeUsers: 12 },
  { name: "Wed", sessions: 25, activeUsers: 18 },
  { name: "Thu", sessions: 22, activeUsers: 16 },
  { name: "Fri", sessions: 30, activeUsers: 25 },
  { name: "Sat", sessions: 18, activeUsers: 14 },
  { name: "Sun", sessions: 10, activeUsers: 8 },
];

const hourlySessionData = [
  { name: "00:00", sessions: 5 },
  { name: "02:00", sessions: 3 },
  { name: "04:00", sessions: 2 },
  { name: "06:00", sessions: 4 },
  { name: "08:00", sessions: 10 },
  { name: "10:00", sessions: 18 },
  { name: "12:00", sessions: 15 },
  { name: "14:00", sessions: 20 },
  { name: "16:00", sessions: 22 },
  { name: "18:00", sessions: 16 },
  { name: "20:00", sessions: 10 },
  { name: "22:00", sessions: 8 },
];

const averageSessionData = {
  duration: "12m 30s",
  messagesPerSession: 18,
  sessionCompletionRate: "78%",
  mostActivePeriod: "2:00 PM - 4:00 PM",
};

export function SessionAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
              <h3 className="text-2xl font-bold">{averageSessionData.duration}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Messages/Session</p>
              <h3 className="text-2xl font-bold">{averageSessionData.messagesPerSession}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <h3 className="text-2xl font-bold">{averageSessionData.sessionCompletionRate}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Peak Activity</p>
              <h3 className="text-2xl font-bold">{averageSessionData.mostActivePeriod}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Daily Sessions & Active Users</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#3B82F6" name="Sessions" />
                  <Bar dataKey="activeUsers" fill="#8B5CF6" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Sessions by Hour</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlySessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="#3B82F6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
