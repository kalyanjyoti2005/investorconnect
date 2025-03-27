import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/context/onboarding-context";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, Globe, HelpCircle, Lock, Moon, Shield, Sun, User, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { resetOnboarding } = useOnboarding();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");

  // Toggle theme (would connect to actual theme provider in production)
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  // Reset the onboarding wizard
  const handleResetOnboarding = () => {
    resetOnboarding();
    toast({
      title: "Onboarding Reset",
      description: "The startup journey tour will show the next time you log in.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden md:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden md:inline">Help</span>
                </TabsTrigger>
                {user?.role === "founder" && (
                  <TabsTrigger value="startup" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden md:inline">Startup</span>
                  </TabsTrigger>
                )}
                {user?.role === "investor" && (
                  <TabsTrigger value="investor" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden md:inline">Investor</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Settings Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your personal information and how it appears to others.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center gap-3">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-2xl">
                            {user?.name?.split(" ")
                              .map(n => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Button size="sm">Change Photo</Button>
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user?.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue={user?.username} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" defaultValue={user?.bio || ""} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue="" placeholder="e.g. San Francisco, CA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" defaultValue="" placeholder="https://" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Industry Interests</h3>
                        <p className="text-sm text-muted-foreground">
                          Select the industries you're interested in.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Tech</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Finance</Badge>
                        <Badge variant="secondary" className="cursor-pointer">AI</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Healthcare</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Education</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">E-commerce</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">SaaS</Badge>
                        <Badge variant="secondary" className="cursor-pointer">Blockchain</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">+</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Theme</CardTitle>
                    <CardDescription>
                      Customize your experience with the app.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Dark mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark themes.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-5 w-5" />
                        <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                        <Moon className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Authentication</CardTitle>
                    <CardDescription>
                      Update your password and security settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      <Button>Update Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Device & Session Management</CardTitle>
                    <CardDescription>
                      Manage your active sessions and devices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Current Session</h3>
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Chrome on Windows</p>
                            <p className="text-sm text-muted-foreground">
                              IP: 192.168.1.1 • Last active: Just now
                            </p>
                          </div>
                          <Badge>Current</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Other Sessions</h3>
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Safari on iPhone</p>
                            <p className="text-sm text-muted-foreground">
                              IP: 192.168.1.2 • Last active: 2 hours ago
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Sign Out</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="destructive" className="mt-2">
                      Sign Out All Devices
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>KYC & Verification</CardTitle>
                    <CardDescription>
                      Verify your identity to unlock all platform features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                      <div>
                        <p className="font-medium text-amber-800">Verification Pending</p>
                        <p className="text-sm text-amber-700">
                          Your KYC documents are under review. This usually takes 1-2 business days.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="id-type">ID Type</Label>
                        <Select defaultValue="passport">
                          <SelectTrigger id="id-type">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="driver">Driver's License</SelectItem>
                            <SelectItem value="national">National ID Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="id-upload">Upload ID Document</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <p className="text-muted-foreground mb-2">
                            Drag and drop your document, or click to browse
                          </p>
                          <Button variant="outline" size="sm">Browse Files</Button>
                        </div>
                      </div>
                      
                      <Button>Submit for Verification</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications from the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates, digests, and important alerts via email.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive real-time alerts in your browser or mobile device.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive text message alerts for critical updates.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Types</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="messages" className="flex-1">New Messages</Label>
                          <Switch id="messages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="investments" className="flex-1">Investment Offers</Label>
                          <Switch id="investments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="milestones" className="flex-1">Milestone Updates</Label>
                          <Switch id="milestones" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="events" className="flex-1">Event Invitations</Label>
                          <Switch id="events" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="marketing" className="flex-1">Marketing & Updates</Label>
                          <Switch id="marketing" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Chat & Messaging</CardTitle>
                    <CardDescription>
                      Manage your messaging preferences and privacy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message-privacy">Who Can Message You</Label>
                        <Select defaultValue="verified">
                          <SelectTrigger id="message-privacy">
                            <SelectValue placeholder="Select who can message you" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="verified">Verified Users Only</SelectItem>
                            <SelectItem value="connections">My Connections Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Read Receipts</Label>
                          <p className="text-sm text-muted-foreground">
                            Let others know when you've read their messages.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Auto-Delete Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically delete messages after 30 days.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Help & Support Tab */}
              <TabsContent value="help" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>
                      Find help resources and support options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Documentation & Tutorials</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Learn how to use StartupMatch platform with our resources.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="justify-start">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Getting Started Guide
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Connecting with Investors
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Shield className="mr-2 h-4 w-4" />
                            Security Best Practices
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Globe className="mr-2 h-4 w-4" />
                            Video Tutorials
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Onboarding Tour</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Review the platform tour to learn more about StartupMatch features.
                        </p>
                        <Button onClick={handleResetOnboarding}>
                          Restart Onboarding Tour
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Contact Support</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Need help with something specific? Our team is ready to assist you.
                        </p>
                        <div className="space-y-2">
                          <Button className="w-full md:w-auto">Contact Support Team</Button>
                          <p className="text-xs text-muted-foreground">
                            Support hours: Monday-Friday, 9am-6pm EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Find answers to common questions about using StartupMatch.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">How does the matching algorithm work?</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI-powered algorithm analyzes various factors including industry, growth stage, funding needs, and investment criteria to create optimal founder-investor matches.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">How is my data protected?</h4>
                        <p className="text-sm text-muted-foreground">
                          StartupMatch uses industry-standard encryption and security practices. NDA-protected data is only shared with approved investors who have signed the required agreements.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">What are milestone-based releases?</h4>
                        <p className="text-sm text-muted-foreground">
                          Milestone-based releases allow investors to fund startups incrementally, with funds held in escrow and released when predefined milestones are verified as complete.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">How do I verify my investor profile?</h4>
                        <p className="text-sm text-muted-foreground">
                          To verify your investor profile, complete the KYC process in the Security tab by submitting the required identification documents. Verification typically takes 1-2 business days.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Visibility</CardTitle>
                    <CardDescription>
                      Control how your profile appears to others on the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <Select defaultValue="public">
                          <SelectTrigger id="profile-visibility">
                            <SelectValue placeholder="Select profile visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public (Visible to everyone)</SelectItem>
                            <SelectItem value="private">Private (Visible to connections only)</SelectItem>
                            <SelectItem value="nda">NDA-Protected (Requires NDA to view details)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Appear in Search Results</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow your profile to appear in platform search results.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Show Profile Analytics</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to see profile analytics like investors interested.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Privacy</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Usage Analytics</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to collect anonymous usage data to improve the platform.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Button variant="outline">Download My Data</Button>
                        <p className="text-xs text-muted-foreground">
                          Get a copy of all your personal data that we store.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Button variant="destructive">Delete Account</Button>
                        <p className="text-xs text-muted-foreground">
                          Permanently delete your account and all associated data.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Investor-Specific Settings */}
              {user?.role === "investor" && (
                <TabsContent value="investor" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Preferences</CardTitle>
                      <CardDescription>
                        Customize your investment criteria and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Investment Range</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="min-investment" className="text-sm text-muted-foreground">Minimum ($)</Label>
                              <Input id="min-investment" type="number" placeholder="10000" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="max-investment" className="text-sm text-muted-foreground">Maximum ($)</Label>
                              <Input id="max-investment" type="number" placeholder="500000" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Preferred Industries</Label>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="cursor-pointer">Fintech</Badge>
                            <Badge variant="secondary" className="cursor-pointer">AI</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Healthcare</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">E-commerce</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">SaaS</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">+</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="startup-stage">Preferred Startup Stage</Label>
                          <Select defaultValue="seed">
                            <SelectTrigger id="startup-stage">
                              <SelectValue placeholder="Select preferred stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="idea">Idea Stage</SelectItem>
                              <SelectItem value="pre_seed">Pre-Seed</SelectItem>
                              <SelectItem value="seed">Seed</SelectItem>
                              <SelectItem value="series_a">Series A</SelectItem>
                              <SelectItem value="series_b">Series B or Later</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">AI-Powered Startup Recommendations</Label>
                            <p className="text-sm text-muted-foreground">
                              Get personalized recommendations based on your preferences.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Escrow & Payment Settings</CardTitle>
                      <CardDescription>
                        Manage your payment methods and escrow preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Payment Methods</Label>
                          <div className="rounded-lg border p-3 space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-800 font-bold">
                                  Visa
                                </div>
                                <div>
                                  <p className="font-medium">Visa ending in 4242</p>
                                  <p className="text-sm text-muted-foreground">Expires 05/2025</p>
                                </div>
                              </div>
                              <Badge>Primary</Badge>
                            </div>
                            <Button variant="outline" size="sm">+ Add Payment Method</Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="escrow-preferences">Escrow Release Preferences</Label>
                          <Select defaultValue="milestone">
                            <SelectTrigger id="escrow-preferences">
                              <SelectValue placeholder="Select escrow preferences" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="milestone">Milestone-based Release</SelectItem>
                              <SelectItem value="date">Date-based Release</SelectItem>
                              <SelectItem value="manual">Manual Approval Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Auto-Approve Milestone Releases</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically approve milestone releases when completed.
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Investor Visibility</CardTitle>
                      <CardDescription>
                        Control who can see your investment portfolio and activities.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Show Investment Portfolio</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow startups to see your previous investments.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pitch-access">Who Can Pitch To You</Label>
                          <Select defaultValue="verified">
                            <SelectTrigger id="pitch-access">
                              <SelectValue placeholder="Select who can pitch to you" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="anyone">Any Startup</SelectItem>
                              <SelectItem value="verified">Verified Startups Only</SelectItem>
                              <SelectItem value="nda">NDA-Protected Startups Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Anonymous Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Browse startups without revealing your identity until you engage.
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {/* Founder-Specific Settings */}
              {user?.role === "founder" && (
                <TabsContent value="startup" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Startup Profile & NDA Controls</CardTitle>
                      <CardDescription>
                        Manage your startup information and confidentiality settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="nda-requirements">NDA Requirements</Label>
                          <Select defaultValue="optional">
                            <SelectTrigger id="nda-requirements">
                              <SelectValue placeholder="Select NDA requirements" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mandatory">Mandatory NDA Before Viewing Details</SelectItem>
                              <SelectItem value="optional">Optional NDA</SelectItem>
                              <SelectItem value="none">No NDA Required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confidential-info">Confidential Information Access</Label>
                          <Select defaultValue="after_nda">
                            <SelectTrigger id="confidential-info">
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="after_nda">After NDA Signing</SelectItem>
                              <SelectItem value="approved">After Manual Approval</SelectItem>
                              <SelectItem value="after_interest">After Expressed Interest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Track Document Access</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications when investors view your documents.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Funding & Escrow Controls</CardTitle>
                      <CardDescription>
                        Manage your funding milestones and escrow settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="funding-model">Preferred Funding Model</Label>
                          <Select defaultValue="milestone">
                            <SelectTrigger id="funding-model">
                              <SelectValue placeholder="Select funding model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="milestone">Milestone-based Funding</SelectItem>
                              <SelectItem value="tranched">Tranched Investment</SelectItem>
                              <SelectItem value="full">Full-amount Upfront</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Auto-Update Milestone Progress</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically update investors on milestone progress.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dispute-resolution">Dispute Resolution Preference</Label>
                          <Select defaultValue="mediation">
                            <SelectTrigger id="dispute-resolution">
                              <SelectValue placeholder="Select dispute resolution" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mediation">Platform Mediation</SelectItem>
                              <SelectItem value="arbitration">Formal Arbitration</SelectItem>
                              <SelectItem value="legal">Legal Resolution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Plan & AI Reports</CardTitle>
                      <CardDescription>
                        Manage your startup's documentation and AI analysis.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Uploaded Documents</Label>
                          <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Pitch Deck.pdf</p>
                                  <p className="text-xs text-muted-foreground">
                                    Uploaded 2 weeks ago • 12 views
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Update</Button>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Financial Projections.xlsx</p>
                                  <p className="text-xs text-muted-foreground">
                                    Uploaded 1 week ago • 5 views • NDA Protected
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Update</Button>
                            </div>
                            
                            <Button size="sm">+ Upload New Document</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">AI Investment Analysis</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable AI to analyze and predict your startup's funding success.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Competitive Analysis Reports</Label>
                            <p className="text-sm text-muted-foreground">
                              Generate periodic market and competitive analysis reports.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}