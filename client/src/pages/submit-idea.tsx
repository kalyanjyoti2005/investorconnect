import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// UI Components
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Unlock,
  Upload,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Startup submission schema
const startupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Startup name must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  description: z.string().min(30, {
    message: "Idea overview must be at least 30 characters.",
  }),
  problemSolved: z.string().min(30, {
    message: "Problem and solution must be at least 30 characters.",
  }),
  targetMarket: z.string().min(20, {
    message: "Target market description must be at least 20 characters.",
  }),
  uniqueSellingPoint: z.string().min(20, {
    message: "Unique selling point must be at least 20 characters.",
  }),
  revenueModel: z.string().min(20, {
    message: "Revenue model must be at least 20 characters.",
  }),
  fundingGoal: z.coerce.number().min(1000, {
    message: "Funding goal must be at least 1000.",
  }),
  stage: z.string({
    required_error: "Please select your startup stage.",
  }),
  website: z.string().url().optional().or(z.literal("")),
  pitchDeck: z.string().optional(),
  requireNda: z.boolean().default(false),
});

// Industry options
const industryOptions = [
  "Technology",
  "AI & Machine Learning",
  "Healthcare",
  "Education",
  "Finance",
  "E-commerce",
  "SaaS",
  "Manufacturing",
  "Food & Beverage",
  "Transportation",
  "Entertainment",
  "Real Estate",
  "Energy",
  "Blockchain",
  "IoT",
  "Other",
];

// Startup stages
const stageOptions = [
  { value: "idea", label: "Idea Stage" },
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "series_c", label: "Series C" },
  { value: "growth", label: "Growth/Expansion" },
];

export default function SubmitIdea() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State management
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [swotAnalysis, setSwotAnalysis] = useState<null | {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  }>(null);

  // Form setup
  const form = useForm<z.infer<typeof startupFormSchema>>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      description: "",
      problemSolved: "",
      targetMarket: "",
      uniqueSellingPoint: "",
      revenueModel: "",
      fundingGoal: 0,
      stage: "",
      website: "",
      pitchDeck: "",
      requireNda: false,
    },
  });

  // Watch form values to calculate progress
  const watchedFields = form.watch();
  
  // Update form progress based on field completion
  const updateFormProgress = () => {
    const totalFields = Object.keys(form.formState.touchedFields).length;
    const completedFields = Object.keys(form.formState.touchedFields).filter(
      field => !!watchedFields[field as keyof typeof watchedFields]
    ).length;
    
    const progress = totalFields ? Math.round((completedFields / totalFields) * 100) : 0;
    setFormProgress(Math.min(100, Math.max(progress, formProgress)));
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // For a real app, we would upload the file to storage
      // Here we just store the filename
      form.setValue("pitchDeck", event.target.files[0].name);
      updateFormProgress();
    }
  };

  // Generate SWOT analysis
  const generateSwotAnalysis = () => {
    setGeneratingAnalysis(true);
    
    // Simulating AI analysis (would be replaced with a real API call)
    setTimeout(() => {
      setSwotAnalysis({
        strengths: [
          "Strong founding team with technical expertise",
          "Innovative product with clear market differentiation",
          "Scalable business model with high potential ROI",
        ],
        weaknesses: [
          "Limited initial funding",
          "Early stage with unproven market fit",
          "Requires significant user acquisition to succeed",
        ],
        opportunities: [
          "Growing market with increasing demand",
          "Potential for strategic partnerships",
          "International expansion potential",
        ],
        threats: [
          "Established competitors with market presence",
          "Changing regulatory environment",
          "Technological disruption risks",
        ],
      });
      setGeneratingAnalysis(false);
    }, 2000);
  };

  // Submit the startup idea
  const submitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof startupFormSchema>) => {
      return await apiRequest("POST", "/api/startups", {
        name: data.name,
        industry: data.industry,
        description: data.description,
        founderId: user?.id,
        stage: data.stage,
        fundingGoal: data.fundingGoal,
        website: data.website || null,
        // We would handle pitch deck upload and storage in a real app
        businessPlan: data.problemSolved + "\n\n" + data.targetMarket + "\n\n" + data.uniqueSellingPoint + "\n\n" + data.revenueModel,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      toast({
        title: "Success!",
        description: "Your startup idea has been submitted.",
        variant: "default",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your startup idea.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: z.infer<typeof startupFormSchema>) => {
    setIsSubmitting(true);
    submitMutation.mutate(values);
  };

  // If user isn't logged in or isn't a founder, redirect to login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need to log in as a startup founder to submit an idea.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/auth")}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (user.role !== "founder") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only startup founders can submit ideas. Your account is registered as an investor.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render the form for startup founders
  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <div className="mb-8 text-center">
        <motion.h1 
          className="mb-3 text-4xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Submit Your Startup Idea
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Share your vision with potential investors and get matched with the right funding partners.
        </motion.p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Form Completion</span>
          <span className="text-sm font-medium">{formProgress}%</span>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between w-full px-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 mb-2 rounded-full border-2 
                ${activeStep >= step 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-background border-muted text-muted-foreground"
                }`}
            >
              {activeStep > step ? <Check className="w-5 h-5" /> : step}
            </div>
            <span className={`text-xs font-medium ${activeStep >= step ? "text-primary" : "text-muted-foreground"}`}>
              {step === 1 && "Idea Details"}
              {step === 2 && "Protection"}
              {step === 3 && "Analysis"}
              {step === 4 && "Review"}
            </span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Enter Idea Details */}
          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Enter Idea Details</CardTitle>
                  <CardDescription>
                    Tell us about your startup idea and what makes it special.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. TechNova AI" {...field} onChange={(e) => {
                              field.onChange(e);
                              updateFormProgress();
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateFormProgress();
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industryOptions.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idea Overview</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your startup idea (what it does, who it's for)" 
                            className="h-24"
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              updateFormProgress();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="problemSolved"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem & Solution</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What problem does your startup solve and how?" 
                              className="h-24"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateFormProgress();
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetMarket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Market</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Who is your target audience? How large is this market?" 
                              className="h-24"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateFormProgress();
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="uniqueSellingPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unique Selling Point (USP)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What makes your solution unique? Why will it succeed?" 
                              className="h-24"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateFormProgress();
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="revenueModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue Model</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How will your startup make money? What's the business model?" 
                              className="h-24"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateFormProgress();
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fundingGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Investment Amount ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 500000" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateFormProgress();
                              }} 
                            />
                          </FormControl>
                          <FormDescription>Enter the amount in USD</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Stage</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateFormProgress();
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your startup stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stageOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://yourstartup.com" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateFormProgress();
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pitchDeck"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Pitch Deck (Optional)</FormLabel>
                          <div className="flex items-center gap-3">
                            <Input
                              type="file"
                              className="hidden"
                              id="pitch-deck-upload"
                              accept=".pdf,.ppt,.pptx"
                              onChange={handleFileUpload}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("pitch-deck-upload")?.click()}
                              className="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Select File
                            </Button>
                          </div>
                          {field.value && (
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 mr-1 text-green-500" />
                              {field.value} uploaded
                            </div>
                          )}
                          <FormDescription>
                            Accepted formats: PDF, PowerPoint
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveStep(2)}
                    disabled={!form.formState.isValid}
                  >
                    Next: Protection
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Step 2: NDA Protection */}
          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: NDA Protection (Optional)</CardTitle>
                  <CardDescription>
                    Choose how you want to protect your startup idea.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="requireNda"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="p-6 mb-4 border rounded-lg bg-background">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {field.value ? (
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center justify-center p-3 rounded-full bg-primary/10"
                                >
                                  <Lock className="w-6 h-6 text-primary" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center justify-center p-3 rounded-full bg-muted"
                                >
                                  <Unlock className="w-6 h-6 text-muted-foreground" />
                                </motion.div>
                              )}
                              <div>
                                <FormLabel className="text-lg">
                                  {field.value ? "NDA-Protected Submission" : "Public Submission"}
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  {field.value 
                                    ? "Investors must sign an NDA to view your full details" 
                                    : "Basic information visible to all investors"}
                                </p>
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  updateFormProgress();
                                }}
                              />
                            </FormControl>
                          </div>
                        </div>

                        {/* Preview of how it will look to investors */}
                        <div className="p-6 mt-4 border rounded-lg">
                          <h3 className="mb-4 text-lg font-medium">Preview: How Investors Will See Your Idea</h3>
                          
                          <div className="p-4 mb-4 rounded-lg bg-background">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">Basic Information (Visible to All)</h4>
                              <Badge variant="outline">Always Visible</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Startup Name:</span>
                                <span className="text-sm font-medium">{form.watch("name") || "Your Startup Name"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Industry:</span>
                                <span className="text-sm font-medium">{form.watch("industry") || "Selected Industry"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Funding Goal:</span>
                                <span className="text-sm font-medium">
                                  ${form.watch("fundingGoal")?.toLocaleString() || "0"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Stage:</span>
                                <span className="text-sm font-medium">
                                  {stageOptions.find(option => option.value === form.watch("stage"))?.label || "Startup Stage"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-background">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">Detailed Information</h4>
                              {field.value ? (
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">NDA Required</Badge>
                              ) : (
                                <Badge variant="outline">Publicly Visible</Badge>
                              )}
                            </div>
                            
                            <div className={`space-y-2 ${field.value ? "blur-sm select-none" : ""}`}>
                              <div>
                                <span className="text-sm text-muted-foreground">Idea Overview:</span>
                                <p className="text-sm mt-1">
                                  {form.watch("description") || "Your startup description will appear here..."}
                                </p>
                              </div>
                              
                              <div>
                                <span className="text-sm text-muted-foreground">Problem & Solution:</span>
                                <p className="text-sm mt-1">
                                  {form.watch("problemSolved") || "Description of the problem your startup solves..."}
                                </p>
                              </div>
                              
                              <div>
                                <span className="text-sm text-muted-foreground">Business Model:</span>
                                <p className="text-sm mt-1">
                                  {form.watch("revenueModel") || "How your startup plans to generate revenue..."}
                                </p>
                              </div>
                            </div>
                            
                            {field.value && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
                                  <Lock className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium">Sign NDA to view details</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(1)}>
                    Previous
                  </Button>
                  <Button type="button" onClick={() => setActiveStep(3)}>
                    Next: AI Analysis
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Step 3: AI SWOT Analysis */}
          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: AI SWOT Analysis</CardTitle>
                  <CardDescription>
                    Get AI-powered insights about your startup idea.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!swotAnalysis ? (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg">
                      <div className="mb-4 text-center">
                        <h3 className="mb-2 text-lg font-medium">Generate AI Insights</h3>
                        <p className="text-sm text-muted-foreground">
                          Our AI will analyze your startup idea and provide a SWOT analysis to help you understand its potential.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={generateSwotAnalysis} 
                        disabled={generatingAnalysis}
                        size="lg"
                        className="mt-4"
                      >
                        {generatingAnalysis ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing your idea...
                          </>
                        ) : (
                          "Generate SWOT Analysis"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="p-4 mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30">
                        <div className="flex mb-4">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-green-800 dark:text-green-400">
                              Your startup has high potential!
                            </h3>
                            <p className="text-green-700 dark:text-green-300">
                              Based on our AI analysis, your idea shows promising investment potential in {form.watch("industry")}.
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* Strengths */}
                          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <h4 className="mb-2 text-base font-medium text-green-700 dark:text-green-400">Strengths</h4>
                            <ul className="pl-5 space-y-1 list-disc text-sm">
                              {swotAnalysis.strengths.map((strength, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  {strength}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Weaknesses */}
                          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <h4 className="mb-2 text-base font-medium text-amber-700 dark:text-amber-400">Weaknesses</h4>
                            <ul className="pl-5 space-y-1 list-disc text-sm">
                              {swotAnalysis.weaknesses.map((weakness, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                  {weakness}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Opportunities */}
                          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <h4 className="mb-2 text-base font-medium text-blue-700 dark:text-blue-400">Opportunities</h4>
                            <ul className="pl-5 space-y-1 list-disc text-sm">
                              {swotAnalysis.opportunities.map((opportunity, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                  {opportunity}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Threats */}
                          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <h4 className="mb-2 text-base font-medium text-red-700 dark:text-red-400">Threats</h4>
                            <ul className="pl-5 space-y-1 list-disc text-sm">
                              {swotAnalysis.threats.map((threat, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.9 + index * 0.1 }}
                                >
                                  {threat}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-amber-500" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                              AI Analysis Disclaimer
                            </h3>
                            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                              This SWOT analysis is generated by AI based on the information you provided. 
                              It's meant to provide general guidance and should not replace professional business advice.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={generateSwotAnalysis} 
                          disabled={generatingAnalysis}
                          className="flex items-center"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${generatingAnalysis ? "animate-spin" : ""}`} />
                          {generatingAnalysis ? "Analyzing..." : "Regenerate Analysis"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(2)}>
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveStep(4)}
                    disabled={!swotAnalysis && !generatingAnalysis}
                  >
                    Next: Review & Submit
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {activeStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Step 4: Review & Submit</CardTitle>
                  <CardDescription>
                    Review your startup idea before submitting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="mb-4 text-lg font-medium">Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Startup Name</h4>
                          <p className="text-base">{form.watch("name")}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Industry</h4>
                          <p className="text-base">{form.watch("industry")}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Idea Overview</h4>
                        <p className="text-base">{form.watch("description")}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Problem & Solution</h4>
                          <p className="text-base">{form.watch("problemSolved")}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Target Market</h4>
                          <p className="text-base">{form.watch("targetMarket")}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Unique Selling Point</h4>
                          <p className="text-base">{form.watch("uniqueSellingPoint")}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Revenue Model</h4>
                          <p className="text-base">{form.watch("revenueModel")}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Required Investment</h4>
                          <p className="text-base">${form.watch("fundingGoal")?.toLocaleString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Startup Stage</h4>
                          <p className="text-base">
                            {stageOptions.find(option => option.value === form.watch("stage"))?.label}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Pitch Deck</h4>
                          <p className="text-base">{form.watch("pitchDeck") || "Not uploaded"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">NDA Protection</h4>
                        <div className="flex items-center mt-1 space-x-2">
                          {form.watch("requireNda") ? (
                            <>
                              <Lock className="w-4 h-4 text-primary" />
                              <span className="text-base">NDA required for detailed information</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-base">Public submission</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/20">
                    <div className="flex items-start">
                      <AlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-orange-500" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-orange-800 dark:text-orange-400">
                          Before you submit
                        </h3>
                        <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                          Once submitted, your startup idea will be visible to potential investors based on your NDA settings. 
                          You'll be able to edit some details later, but the core idea information will be fixed.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(3)}>
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !form.formState.isValid}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Startup Idea"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </form>
      </Form>
    </div>
  );
}