
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";

type OnboardingStep = "welcome" | "credentials" | "complete";

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [airflowUrl, setAirflowUrl] = useState("");
  const [airflowUsername, setAirflowUsername] = useState("");
  const [airflowPassword, setAirflowPassword] = useState("");
  const [mongoUri, setMongoUri] = useState("");
  const [mongoUsername, setMongoUsername] = useState("");
  const [mongoPassword, setMongoPassword] = useState("");
  const [kubeConfig, setKubeConfig] = useState("");
  const [currentTab, setCurrentTab] = useState("airflow");
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep === "welcome") {
      setCurrentStep("credentials");
    } else if (currentStep === "credentials") {
      // Validate and save credentials (in a real app)
      toast({
        title: "Credentials saved",
        description: "Your credentials have been saved successfully.",
      });
      setCurrentStep("complete");
    } else {
      onComplete();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold">Welcome to DevOps Chatbot!</h3>
            <p className="text-muted-foreground">
              This wizard will help you set up your connection to Airflow, MongoDB, and Kubernetes.
              You can always change these settings later.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleNext}>Get Started</Button>
            </div>
          </div>
        );
      case "credentials":
        return (
          <div className="space-y-4 animate-fade-in">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="airflow">Airflow</TabsTrigger>
                <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
                <TabsTrigger value="kubernetes">Kubernetes</TabsTrigger>
              </TabsList>
              <TabsContent value="airflow" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="airflow-url">Airflow URL</Label>
                  <Input
                    id="airflow-url"
                    value={airflowUrl}
                    onChange={(e) => setAirflowUrl(e.target.value)}
                    placeholder="https://airflow.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airflow-username">Username</Label>
                  <Input
                    id="airflow-username"
                    value={airflowUsername}
                    onChange={(e) => setAirflowUsername(e.target.value)}
                    placeholder="admin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airflow-password">Password</Label>
                  <Input
                    id="airflow-password"
                    type="password"
                    value={airflowPassword}
                    onChange={(e) => setAirflowPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </TabsContent>
              <TabsContent value="mongodb" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="mongo-uri">MongoDB URI</Label>
                  <Input
                    id="mongo-uri"
                    value={mongoUri}
                    onChange={(e) => setMongoUri(e.target.value)}
                    placeholder="mongodb://localhost:27017"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mongo-username">Username</Label>
                  <Input
                    id="mongo-username"
                    value={mongoUsername}
                    onChange={(e) => setMongoUsername(e.target.value)}
                    placeholder="admin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mongo-password">Password</Label>
                  <Input
                    id="mongo-password"
                    type="password"
                    value={mongoPassword}
                    onChange={(e) => setMongoPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </TabsContent>
              <TabsContent value="kubernetes" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="kube-config">Kubernetes Config</Label>
                  <textarea
                    id="kube-config"
                    className="w-full min-h-[150px] p-2 rounded-md border border-input bg-background"
                    value={kubeConfig}
                    onChange={(e) => setKubeConfig(e.target.value)}
                    placeholder="Paste your kubeconfig YAML here..."
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext}>Save & Continue</Button>
            </div>
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col items-center space-y-4 py-6 animate-fade-in">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Setup Complete!</h3>
            <p className="text-center text-muted-foreground">
              Your credentials have been saved securely. You're now ready to use the chatbot.
            </p>
            <Button onClick={onComplete} className="mt-4">
              Start Using the Chatbot
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto card-gradient">
      <CardHeader>
        <CardTitle>Setup Your Chatbot</CardTitle>
        <CardDescription>
          Configure your connections to enable all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <div className={`h-2 w-8 rounded-full ${currentStep === "welcome" ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-8 rounded-full ${currentStep === "credentials" ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-8 rounded-full ${currentStep === "complete" ? "bg-primary" : "bg-muted"}`}></div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OnboardingFlow;
