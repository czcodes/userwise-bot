
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "./UserList";
import { SessionAnalytics } from "./SessionAnalytics";
import { UsageMetrics } from "./UsageMetrics";
import { Users, BarChart, Activity } from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Admin Dashboard</CardTitle>
        <CardDescription>
          Monitor users, sessions, and system performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center justify-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center justify-center">
              <Activity className="mr-2 h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center justify-center">
              <BarChart className="mr-2 h-4 w-4" />
              Metrics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="pt-4">
            <UserList />
          </TabsContent>
          <TabsContent value="sessions" className="pt-4">
            <SessionAnalytics />
          </TabsContent>
          <TabsContent value="metrics" className="pt-4">
            <UsageMetrics />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
