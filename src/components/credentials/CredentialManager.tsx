
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Trash, Save, Key, Server, Database, RefreshCw } from "lucide-react";

const CredentialManager = () => {
  const [activeTab, setActiveTab] = useState("airflow");
  const { toast } = useToast();
  
  const [airflowCredentials, setAirflowCredentials] = useState({
    url: "https://airflow.example.com",
    username: "admin",
    password: "••••••••",
  });
  
  const [mongoCredentials, setMongoCredentials] = useState({
    uri: "mongodb://localhost:27017/mydb",
    username: "dbuser",
    password: "••••••••",
  });
  
  const [kubernetesCredentials, setKubernetesCredentials] = useState({
    configFile: "apiVersion: v1\nkind: Config\nclusters:\n- name: default\n  cluster:\n    server: https://kubernetes.example.com",
  });

  const handleSaveCredentials = (type: string) => {
    toast({
      title: "Credentials Updated",
      description: `Your ${type} credentials have been saved successfully.`,
    });
  };

  const handleTestConnection = (type: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${type}...`,
    });
    
    // Simulate connection test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${type}.`,
      });
    }, 2000);
  };

  const handleDeleteCredentials = (type: string) => {
    toast({
      title: "Credentials Deleted",
      description: `Your ${type} credentials have been removed.`,
      variant: "destructive",
    });
    
    // Reset the credentials based on type
    if (type === "Airflow") {
      setAirflowCredentials({
        url: "",
        username: "",
        password: "",
      });
    } else if (type === "MongoDB") {
      setMongoCredentials({
        uri: "",
        username: "",
        password: "",
      });
    } else if (type === "Kubernetes") {
      setKubernetesCredentials({
        configFile: "",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5" />
          Credential Manager
        </CardTitle>
        <CardDescription>
          Manage your connection details for various services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="airflow" className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              Airflow
            </TabsTrigger>
            <TabsTrigger value="mongodb" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              MongoDB
            </TabsTrigger>
            <TabsTrigger value="kubernetes" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Kubernetes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="airflow" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="airflow-url">Airflow URL</Label>
              <Input
                id="airflow-url"
                value={airflowCredentials.url}
                onChange={(e) => setAirflowCredentials({...airflowCredentials, url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airflow-username">Username</Label>
              <Input
                id="airflow-username"
                value={airflowCredentials.username}
                onChange={(e) => setAirflowCredentials({...airflowCredentials, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airflow-password">Password</Label>
              <Input
                id="airflow-password"
                type="password"
                value={airflowCredentials.password}
                onChange={(e) => setAirflowCredentials({...airflowCredentials, password: e.target.value})}
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button onClick={() => handleSaveCredentials("Airflow")} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={() => handleTestConnection("Airflow")}>
                Test Connection
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteCredentials("Airflow")}
                className="ml-auto"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="mongodb" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="mongo-uri">MongoDB URI</Label>
              <Input
                id="mongo-uri"
                value={mongoCredentials.uri}
                onChange={(e) => setMongoCredentials({...mongoCredentials, uri: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mongo-username">Username</Label>
              <Input
                id="mongo-username"
                value={mongoCredentials.username}
                onChange={(e) => setMongoCredentials({...mongoCredentials, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mongo-password">Password</Label>
              <Input
                id="mongo-password"
                type="password"
                value={mongoCredentials.password}
                onChange={(e) => setMongoCredentials({...mongoCredentials, password: e.target.value})}
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button onClick={() => handleSaveCredentials("MongoDB")} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={() => handleTestConnection("MongoDB")}>
                Test Connection
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteCredentials("MongoDB")}
                className="ml-auto"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="kubernetes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="kube-config">Kubernetes Config File</Label>
              <textarea
                id="kube-config"
                className="w-full min-h-[200px] p-2 rounded-md border border-input bg-background"
                value={kubernetesCredentials.configFile}
                onChange={(e) => setKubernetesCredentials({...kubernetesCredentials, configFile: e.target.value})}
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button onClick={() => handleSaveCredentials("Kubernetes")} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={() => handleTestConnection("Kubernetes")}>
                Test Connection
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteCredentials("Kubernetes")}
                className="ml-auto"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CredentialManager;
