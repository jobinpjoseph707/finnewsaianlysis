import React from "react";
import Header from "@/components/layouts/Header";
import { MCPConfiguration } from "@/components/settings/MCPConfiguration";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  User, 
  BellRing, 
  Shield, 
  Database, 
  Zap,
  Save,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [mcpStatus, setMcpStatus] = React.useState([
    { name: "Strategy Repository", status: "ACTIVE", message: "Operating normally" },
    { name: "Sentiment Analyzer", status: "ACTIVE", message: "Operating normally" },
    { name: "Market Data Service", status: "ACTIVE", message: "Operating normally" }
  ]);
  
  const [form, setForm] = React.useState({
    name: "Ankit Desai",
    email: "ankit.d@example.com",
    notifications: {
      marketUpdates: true,
      strategyAlerts: true,
      newsAlerts: false,
      performanceReports: true
    },
    apiKey: "sk-************************",
    refreshRate: "5"
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  const handleNotificationChange = (key, value) => {
    setForm({
      ...form,
      notifications: {
        ...form.notifications,
        [key]: value
      }
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
      variant: "default"
    });
  };
  
  const regenerateApiKey = () => {
    // In a real app, this would make an API call to generate a new key
    setForm({
      ...form,
      apiKey: "sk-" + Math.random().toString(36).substring(2, 10) + "****************"
    });
    
    toast({
      title: "API Key regenerated",
      description: "Your new API key has been generated. Keep it secure!",
      variant: "default"
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <SettingsIcon className="mr-2 h-8 w-8 text-primary" />
            Settings
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-6">
              <CardContent className="p-0">
                <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-r h-full p-0">
                    <div className="flex flex-col w-full gap-1">
                      <TabsTrigger 
                        value="profile" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notifications" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
                      >
                        <BellRing className="mr-2 h-4 w-4" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger 
                        value="api" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        API Access
                      </TabsTrigger>
                      <TabsTrigger 
                        value="mcp" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
                      >
                        <Database className="mr-2 h-4 w-4" />
                        MCP Status
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
              <TabsContent value="profile" className="m-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your personal information and account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={form.name} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={form.email} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••••••" 
                      />
                      <p className="text-xs text-gray-500">
                        Leave blank to keep current password
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••••••" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} className="ml-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Customize how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Market Updates</h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications about significant market movements
                        </p>
                      </div>
                      <Switch 
                        checked={form.notifications.marketUpdates} 
                        onCheckedChange={(value) => handleNotificationChange('marketUpdates', value)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Strategy Alerts</h3>
                        <p className="text-sm text-gray-500">
                          Get notified when new investment strategies are generated
                        </p>
                      </div>
                      <Switch 
                        checked={form.notifications.strategyAlerts} 
                        onCheckedChange={(value) => handleNotificationChange('strategyAlerts', value)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">News Alerts</h3>
                        <p className="text-sm text-gray-500">
                          Receive breaking news that may impact your investments
                        </p>
                      </div>
                      <Switch 
                        checked={form.notifications.newsAlerts} 
                        onCheckedChange={(value) => handleNotificationChange('newsAlerts', value)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Performance Reports</h3>
                        <p className="text-sm text-gray-500">
                          Receive weekly performance reports of your strategies
                        </p>
                      </div>
                      <Switch 
                        checked={form.notifications.performanceReports} 
                        onCheckedChange={(value) => handleNotificationChange('performanceReports', value)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="refresh-rate">Data Refresh Rate (minutes)</Label>
                      <Input 
                        id="refresh-rate" 
                        name="refreshRate"
                        type="number" 
                        min="1" 
                        max="60" 
                        value={form.refreshRate} 
                        onChange={handleChange} 
                      />
                      <p className="text-xs text-gray-500">
                        How frequently data is refreshed in the dashboard
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} className="ml-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="m-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>
                      Manage your API keys and integration settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-medium mb-2">Your API Key</h3>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          value={form.apiKey} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={regenerateApiKey}
                          className="whitespace-nowrap"
                        >
                          Regenerate
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Keep this key secure. Do not share it publicly or commit it to a public repository.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">API Rate Limits</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="text-sm text-gray-500">Requests per minute</p>
                          <p className="text-xl font-bold">60</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="text-sm text-gray-500">Requests per day</p>
                          <p className="text-xl font-bold">10,000</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Webhook URL</h3>
                      <Input 
                        placeholder="https://your-website.com/webhook" 
                      />
                      <p className="text-xs text-gray-500">
                        We'll send event notifications to this URL
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Enable Webhooks</h3>
                        <p className="text-sm text-gray-500">
                          Send event notifications to your webhook URL
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} className="ml-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="mcp" className="m-0 space-y-6">
                {/* External MCP Configuration */}
                <MCPConfiguration />
                
                {/* Local MCP Status */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Local MCP Status</CardTitle>
                    <CardDescription>
                      Status of local MCP services and components
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mcpStatus.map((service, index) => (
                      <React.Fragment key={service.name}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-500">
                              {service.message}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              service.status === 'ACTIVE' 
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : service.status === 'ERROR'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-amber-50 text-amber-600 border-amber-200'
                            } flex items-center`}
                          >
                            {service.status === 'ACTIVE' && <Check className="mr-1 h-3 w-3" />}
                            {service.status}
                          </Badge>
                        </div>
                        {index < mcpStatus.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                    
                    <div className="bg-gray-50 p-4 rounded-lg border mt-4">
                      <h3 className="font-medium mb-2">Last System Check</h3>
                      <p className="text-sm">
                        All systems operational as of <span className="font-medium">April 6, 2025, 15:02:34 IST</span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="mr-2">
                      Run Diagnostics
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Systems restarted",
                        description: "All MCP systems have been restarted successfully.",
                        variant: "default"
                      });
                    }}>
                      Restart Systems
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}