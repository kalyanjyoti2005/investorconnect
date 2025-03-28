import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import { 
  MessageSquare, Users, Trophy, Calendar, Bell, 
  ThumbsUp, ThumbsDown, CheckCircle, Pin, Search,
  ArrowUp, ArrowDown, CheckCircle2, Award, RefreshCw,
  UserPlus, Video, SendHorizontal, Smile, PlusCircle,
  Filter, Bookmark, Share2, MoreVertical, User
} from 'lucide-react';

// Custom Components
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

const CommunityPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discussions");
  
  // Check if the user is authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
        <p className="text-muted-foreground mt-2">
          Connect with founders, investors, and innovators to discuss ideas and collaborate
        </p>
      </header>
      
      <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="hackathon" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Hackathon</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions" className="space-y-4">
          <DiscussionsTab user={user} />
        </TabsContent>
        
        <TabsContent value="hackathon" className="space-y-4">
          <HackathonTab user={user} />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTab user={user} />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <EventsTab user={user} />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DiscussionsTab = ({ user }) => {
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("all");
  const { toast } = useToast();
  
  // Fetch discussions
  const { data: discussions, isLoading, error } = useQuery({
    queryKey: ['/api/discussions', selectedTag],
    queryFn: () => {
      const endpoint = selectedTag === 'all' 
        ? '/api/discussions' 
        : `/api/discussions?tag=${selectedTag}`;
      return fetch(endpoint).then(res => {
        if (!res.ok) throw new Error('Failed to fetch discussions');
        return res.json();
      });
    }
  });
  
  const handleCreatePost = async (formData) => {
    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create discussion');
      }

      // Invalidate and refetch discussions
      await queryClient.invalidateQueries({ queryKey: ['/api/discussions'] });
      
      toast({
        title: "Post created successfully",
        description: "Your discussion has been published.",
      });
      setNewPostDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Filter discussions by tag if one is selected
  const filteredDiscussions = selectedTag === "all" 
    ? discussions 
    : discussions?.filter(d => d.tag === selectedTag);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-destructive mb-4">Failed to load discussions</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Get discussions from API query
  
  const tags = [
    { id: "all", label: "All Topics" },
    { id: "funding", label: "Funding" },
    { id: "startups", label: "Startups" },
    { id: "growth", label: "Growth" },
    { id: "technology", label: "Technology" },
    { id: "hackathon", label: "Hackathon" },
    { id: "pitch", label: "Pitch" },
    { id: "networking", label: "Networking" },
    { id: "investing", label: "Investing" }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Discussions</h2>
          <Button onClick={() => setNewPostDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tags.map(tag => (
            <Badge 
              key={tag.id} 
              variant={selectedTag === tag.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag.id)}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search discussions..." className="pl-8" />
        </div>
        
        <div className="space-y-4">
          {filteredDiscussions && filteredDiscussions.length > 0 ? (
            filteredDiscussions.map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} currentUser={user} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No discussions found. Be the first to start a conversation!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• Be respectful and constructive</p>
            <p className="text-sm">• Share knowledge and experiences</p>
            <p className="text-sm">• No promotional content without context</p>
            <p className="text-sm">• Keep discussions on-topic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">#AIStartups</h4>
              <p className="text-sm text-muted-foreground">24 discussions this week</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">#FundingRounds</h4>
              <p className="text-sm text-muted-foreground">19 discussions this week</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">#ProductMarketFit</h4>
              <p className="text-sm text-muted-foreground">16 discussions this week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Jane Doe</p>
                <p className="text-xs text-muted-foreground">32 contributions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Alex Brown</p>
                <p className="text-xs text-muted-foreground">28 contributions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Mike Smith</p>
                <p className="text-xs text-muted-foreground">23 contributions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
            <DialogDescription>
              Start a meaningful conversation with the community
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              title: formData.get('title'),
              content: formData.get('content'),
              tag: formData.get('tag'),
            };
            handleCreatePost(data);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="What's your discussion about?" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag">Category</Label>
                <Select name="tag" required defaultValue="startups">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {tags.filter(tag => tag.id !== "all").map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>{tag.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="Share your thoughts, questions, or insights..." 
                  rows={6}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewPostDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Post Discussion</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DiscussionCard = ({ discussion, currentUser }) => {
  const { toast } = useToast();
  const [score, setScore] = useState(discussion.upvotes - discussion.downvotes);
  const [userVote, setUserVote] = useState(null); // null, 'up', or 'down'
  
  // Check if the user already has a vote on this discussion
  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const response = await fetch(`/api/discussions/${discussion.id}/vote?userId=${currentUser.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setUserVote(data.voteType === 1 ? 'up' : 'down');
          }
        }
      } catch (error) {
        console.error('Error fetching user vote:', error);
      }
    };
    
    fetchUserVote();
  }, [discussion.id, currentUser.id]);
  
  const formatDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d ago`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m ago`;
  };
  
  const voteMutation = useMutation({
    mutationFn: async ({ discussionId, userId, voteType }) => {
      const response = await fetch(`/api/discussions/${discussionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          voteType,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discussions'] });
    },
    onError: (error) => {
      toast({
        title: 'Vote failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleVote = (type) => {
    const voteType = type === 'up' ? 1 : -1;
    
    // If user already voted the same way, they're removing their vote
    const newVoteType = userVote === type ? 0 : voteType;
    
    voteMutation.mutate({
      discussionId: discussion.id,
      userId: currentUser.id,
      voteType: newVoteType,
    });
    
    // Optimistic UI update
    if (type === 'up' && userVote !== 'up') {
      setScore(prev => userVote === 'down' ? prev + 2 : prev + 1);
      setUserVote('up');
      toast({ title: "Upvoted" });
    } else if (type === 'down' && userVote !== 'down') {
      setScore(prev => userVote === 'up' ? prev - 2 : prev - 1);
      setUserVote('down');
      toast({ title: "Downvoted" });
    } else {
      // Remove vote
      setScore(prev => type === 'up' ? prev - 1 : prev + 1);
      setUserVote(null);
      toast({ title: "Vote removed" });
    }
  };

  return (
    <Card className={discussion.isPinned ? "border-primary/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{discussion.author.name}</span>
            <span className="text-xs text-muted-foreground">@{discussion.author.username}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {discussion.isPinned && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Pin className="h-4 w-4 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pinned by moderators</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {discussion.isVerified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified answer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Badge variant="outline">{discussion.tag}</Badge>
          </div>
        </div>
        
        <CardTitle className="text-lg mt-2">{discussion.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-3">{discussion.content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className={userVote === 'up' ? "text-primary" : ""}
              onClick={() => handleVote('up')}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm mx-1">{score}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className={userVote === 'down' ? "text-destructive" : ""}
              onClick={() => handleVote('down')}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MessageSquare className="h-4 w-4" />
            <span>{discussion.commentCount}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Bookmark className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Share2 className="h-3 w-3 mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const HackathonTab = ({ user }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  
  // Placeholder data
  const teams = [
    {
      id: 1,
      name: "BlockChain Innovators",
      description: "Building decentralized solutions for supply chain transparency",
      members: 5,
      isLeader: true,
      unreadMessages: 3
    },
    {
      id: 2,
      name: "AI Visionaries",
      description: "Creating AI-driven personal finance assistants",
      members: 4,
      isLeader: false,
      unreadMessages: 0
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Hackathon Teams</CardTitle>
            <CardDescription>
              Collaborate with other participants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map(team => (
              <div 
                key={team.id} 
                className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${selectedTeam?.id === team.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setSelectedTeam(team)}
              >
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-xs text-muted-foreground">{team.members} members</div>
                </div>
                <div className="flex gap-2">
                  {team.isLeader && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="border-primary text-primary text-xs">
                            Leader
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You're the team leader</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {team.unreadMessages > 0 && (
                    <Badge>{team.unreadMessages}</Badge>
                  )}
                </div>
              </div>
            ))}
            
            {teams.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You're not part of any team yet</p>
              </div>
            )}
            
            <Button 
              className="w-full" 
              variant={teams.length === 0 ? "default" : "outline"}
              onClick={() => setCreateTeamDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hackathon Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Registration</h4>
              <p className="text-sm text-muted-foreground">March 1-10, 2025</p>
            </div>
            <div>
              <h4 className="font-medium">Team Formation</h4>
              <p className="text-sm text-muted-foreground">March 11-15, 2025</p>
            </div>
            <div>
              <h4 className="font-medium">Coding Period</h4>
              <p className="text-sm text-muted-foreground">March 16-23, 2025</p>
            </div>
            <div>
              <h4 className="font-medium">Judging & Awards</h4>
              <p className="text-sm text-muted-foreground">March 24-25, 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        {selectedTeam ? (
          <HackathonChatPanel team={selectedTeam} user={user} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center p-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Select a Team</h3>
              <p className="text-muted-foreground mb-6">
                Choose a team from the list to view the chat or create a new team to get started
              </p>
              <Button onClick={() => setCreateTeamDialogOpen(true)}>Create New Team</Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={createTeamDialogOpen} onOpenChange={setCreateTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a New Hackathon Team</DialogTitle>
            <DialogDescription>
              Start a team for the upcoming hackathon event
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            setCreateTeamDialogOpen(false);
            // Implementation will be added later
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input id="teamName" name="name" placeholder="Give your team a catchy name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teamDescription">Project Description</Label>
                <Textarea 
                  id="teamDescription" 
                  name="description" 
                  placeholder="Describe what your team will be building" 
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teamLogo">Team Logo (optional)</Label>
                <Input id="teamLogo" name="logo" type="file" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateTeamDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Team</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const HackathonChatPanel = ({ team, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  // Placeholder data
  const messages = [
    {
      id: 1,
      senderId: 2,
      sender: { name: "Alex Johnson", username: "alexj" },
      content: "Hey team! I've started working on the backend architecture. Any suggestions?",
      createdAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      id: 2,
      senderId: 3,
      sender: { name: "Sarah Chen", username: "sarahc" },
      content: "I think we should go with a microservices approach. It'll be more scalable for our use case.",
      createdAt: new Date(Date.now() - 3600000 * 4)
    },
    {
      id: 3,
      senderId: user.id,
      sender: { name: user.name, username: user.username },
      content: "Agreed. I'm focusing on the frontend with React. Should we use Redux for state management?",
      createdAt: new Date(Date.now() - 3600000 * 3)
    },
    {
      id: 4,
      senderId: 2,
      sender: { name: "Alex Johnson", username: "alexj" },
      content: "I think Context API might be sufficient for our needs. Let's not overcomplicate things for the hackathon.",
      createdAt: new Date(Date.now() - 3600000 * 2)
    }
  ];
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Implementation will be added later
    setNewMessage("");
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatMessageDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const dateStr = formatMessageDate(message.createdAt);
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
    return groups;
  }, {});
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1" />
              Invite
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-1" />
              Video Call
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow p-4">
        {Object.entries(messagesByDate).map(([date, dateMessages]) => (
          <div key={date} className="mb-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground">{date}</span>
              <div className="flex-grow border-t"></div>
            </div>
            
            {dateMessages.map(message => (
              <div key={message.id} className={`flex mb-4 ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                {message.senderId !== user.id && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
                  {message.senderId !== user.id && (
                    <div className="text-xs font-medium mb-1">{message.sender.name}</div>
                  )}
                  
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 text-right mt-1">
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full items-center gap-2">
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="icon">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
      
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Add people to your hackathon team
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="searchUser">Find users</Label>
            <div className="flex gap-2 mt-2">
              <Input id="searchUser" placeholder="Search by name or username" />
              <Button>Search</Button>
            </div>
            
            <div className="mt-4">
              <Label>Suggested Users</Label>
              <div className="mt-2 space-y-2">
                {[
                  { id: 5, name: "Emily Zhang", role: "Frontend Developer" },
                  { id: 6, name: "David Kim", role: "UX Designer" },
                  { id: 7, name: "Raj Patel", role: "Data Scientist" }
                ].map(user => (
                  <div key={user.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <Button size="sm">Invite</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const LeaderboardTab = ({ user }) => {
  const [leaderboardType, setLeaderboardType] = useState("contributors");
  
  // Placeholder data
  const contributors = [
    { id: 1, name: "Emma Wilson", username: "emmaw", contributions: 42, badges: ["Top Contributor", "Innovator"] },
    { id: 2, name: "Liam Johnson", username: "liamj", contributions: 38, badges: ["Growth Hacker"] },
    { id: 3, name: "Olivia Smith", username: "olivias", contributions: 35, badges: ["Mentor"] },
    { id: 4, name: "Noah Brown", username: "noahb", contributions: 29, badges: ["Top Contributor"] },
    { id: 5, name: "Ava Davis", username: "avad", contributions: 26, badges: [] },
    { id: 6, name: "William Miller", username: "williamm", contributions: 24, badges: ["Innovator"] },
    { id: 7, name: "Sophia Wilson", username: "sophiaw", contributions: 22, badges: [] },
    { id: 8, name: "James Moore", username: "jamesm", contributions: 18, badges: [] },
    { id: 9, name: "Isabella Taylor", username: "isabellat", contributions: 15, badges: [] },
    { id: 10, name: "Logan Anderson", username: "logana", contributions: 12, badges: [] },
  ];
  
  const hackathonWinners = [
    { id: 1, name: "Team Nova", prize: "First Place", project: "AI-Powered Supply Chain Optimization" },
    { id: 2, name: "ByteCrafters", prize: "Second Place", project: "Decentralized Healthcare Records" },
    { id: 3, name: "Quantum Shift", prize: "Third Place", project: "Sustainable Energy Trading Platform" },
    { id: 4, name: "CodeCatalysts", prize: "Best UI/UX", project: "Augmented Reality Shopping Experience" },
    { id: 5, name: "Data Dynamos", prize: "Most Innovative", project: "Predictive Maintenance using IoT" },
  ];
  
  const startups = [
    { id: 1, name: "EcoTech Solutions", funding: "$2.4M", investors: 8, trendingScore: 92 },
    { id: 2, name: "FinGenius", funding: "$1.8M", investors: 6, trendingScore: 87 },
    { id: 3, name: "HealthAI", funding: "$1.5M", investors: 5, trendingScore: 83 },
    { id: 4, name: "BlockSecure", funding: "$1.2M", investors: 4, trendingScore: 78 },
    { id: 5, name: "SmartRetail", funding: "$950K", investors: 4, trendingScore: 72 },
  ];
  
  const userBadges = [
    { id: 1, name: "Top Contributor", description: "Awarded to members with exceptional community contributions", iconClass: "bg-yellow-500" },
    { id: 2, name: "Innovator", description: "Recognized for bringing creative ideas to discussions", iconClass: "bg-purple-500" },
    { id: 3, name: "Growth Hacker", description: "Expert in startup growth strategies", iconClass: "bg-green-500" },
    { id: 4, name: "Mentor", description: "Helps and guides other community members", iconClass: "bg-blue-500" },
    { id: 5, name: "Hackathon Winner", description: "Part of a winning hackathon team", iconClass: "bg-red-500" },
    { id: 6, name: "Investor Expert", description: "Provides valuable investment insights", iconClass: "bg-orange-500" },
  ];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="contributors" value={leaderboardType} onValueChange={setLeaderboardType}>
        <TabsList className="mb-4">
          <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathon Winners</TabsTrigger>
          <TabsTrigger value="startups">Trending Startups</TabsTrigger>
          <TabsTrigger value="badges">Your Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contributors">
          <Card>
            <CardHeader>
              <CardTitle>Top Community Contributors</CardTitle>
              <CardDescription>
                Members with the most valuable contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {contributors.map((person, index) => (
                  <div key={person.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted-foreground/10 text-muted-foreground font-medium">
                      {index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="font-medium">{person.name}</div>
                      <div className="text-xs text-muted-foreground">@{person.username}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{person.contributions}</div>
                      <div className="text-xs text-muted-foreground">contributions</div>
                    </div>
                    <div className="flex gap-1">
                      {person.badges.map((badge, idx) => (
                        <TooltipProvider key={idx}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline">{badge}</Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{badge} badge</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline">View All Contributors</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="hackathon">
          <Card>
            <CardHeader>
              <CardTitle>Recent Hackathon Winners</CardTitle>
              <CardDescription>
                Teams that delivered exceptional projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hackathonWinners.map((team, index) => (
                  <Card key={team.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {team.name}
                          {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                        </CardTitle>
                        <Badge>{team.prize}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{team.project}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="startups">
          <Card>
            <CardHeader>
              <CardTitle>Trending Startups</CardTitle>
              <CardDescription>
                Most popular startups on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startups.map((startup, index) => (
                  <div key={startup.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted-foreground/10 text-muted-foreground font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{startup.name}</div>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span>{startup.funding} raised</span>
                          <span>{startup.investors} investors</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{startup.trendingScore}</div>
                      <div className="text-xs text-muted-foreground">score</div>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline">Explore All Startups</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievement Badges</CardTitle>
              <CardDescription>
                Badges you've earned through community participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBadges.map(badge => (
                  <Card key={badge.id} className="overflow-hidden">
                    <div className={`h-2 ${badge.iconClass}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${badge.iconClass} text-white`}>
                          <Award className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-md">{badge.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </CardContent>
                  </Card>
                ))}
                
                {userBadges.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Participate in discussions and hackathons to earn badges
                    </p>
                    <Button variant="outline">Learn How to Earn Badges</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EventsTab = ({ user }) => {
  const [upcomingTab, setUpcomingTab] = useState("upcoming");
  
  // Placeholder data
  const upcomingEvents = [
    {
      id: 1,
      title: "Fundraising Strategies for Early-Stage Startups",
      description: "Learn proven strategies to secure seed funding and angel investments",
      startTime: new Date(2025, 3, 15, 14, 0),
      endTime: new Date(2025, 3, 15, 16, 0),
      location: "Virtual (Zoom)",
      attendees: 78,
      isRsvp: true
    },
    {
      id: 2,
      title: "AI in Business: Practical Applications",
      description: "Discover how to leverage AI to solve real business challenges",
      startTime: new Date(2025, 3, 18, 10, 0),
      endTime: new Date(2025, 3, 18, 12, 0),
      location: "Innovation Hub, San Francisco",
      attendees: 54,
      isRsvp: false
    },
    {
      id: 3,
      title: "Networking Mixer: Founders & Investors",
      description: "Connect with potential investors and other entrepreneurs",
      startTime: new Date(2025, 3, 22, 18, 0),
      endTime: new Date(2025, 3, 22, 21, 0),
      location: "Startup Lounge, New York",
      attendees: 112,
      isRsvp: false
    }
  ];
  
  const pastEvents = [
    {
      id: 4,
      title: "Product Market Fit Workshop",
      description: "Interactive session on validating and achieving product market fit",
      startTime: new Date(2025, 2, 25, 14, 0),
      endTime: new Date(2025, 2, 25, 17, 0),
      location: "Virtual (Zoom)",
      attendees: 92,
      isRsvp: true
    },
    {
      id: 5,
      title: "Pitch Perfect: Investor Presentation Masterclass",
      description: "Learn how to create compelling investor pitches",
      startTime: new Date(2025, 2, 18, 10, 0),
      endTime: new Date(2025, 2, 18, 13, 0),
      location: "Tech Campus, Austin",
      attendees: 67,
      isRsvp: true
    }
  ];
  
  const formatEventDate = (startTime, endTime) => {
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    const start = startTime.toLocaleTimeString('en-US', options);
    const end = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    return `${start} - ${end}`;
  };
  
  const daysUntil = (date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" value={upcomingTab} onValueChange={setUpcomingTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="bg-primary h-1"></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    {daysUntil(event.startTime) <= 3 && (
                      <Badge variant="outline" className="border-orange-500 text-orange-500">
                        {daysUntil(event.startTime) === 0 ? "Today" : `${daysUntil(event.startTime)} days left`}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatEventDate(event.startTime, event.endTime)}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Pin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} attending</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={event.isRsvp ? "outline" : "default"}
                    onClick={() => {
                      // Implementation will be added later
                    }}
                  >
                    {event.isRsvp ? "Cancel RSVP" : "RSVP to Event"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {upcomingEvents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground mb-6">
                  Check back later for new events or create your own
                </p>
                <Button>Create Event</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastEvents.map(event => (
              <Card key={event.id} className="opacity-80">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatEventDate(event.startTime, event.endTime)}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Pin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} attended</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Recording
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Materials
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {pastEvents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Past Events</h3>
                <p className="text-muted-foreground">
                  You haven't attended any events yet
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NotificationsTab = ({ user }) => {
  const [filter, setFilter] = useState("all");
  
  // Placeholder data
  const notifications = [
    {
      id: 1,
      type: "badge",
      content: "You've been awarded the 'Top Contributor' badge!",
      relatedId: 123,
      createdAt: new Date(Date.now() - 3600000 * 2),
      read: false
    },
    {
      id: 2,
      type: "discussion",
      content: "Alex Johnson replied to your discussion: 'Funding Strategies'",
      relatedId: 456,
      createdAt: new Date(Date.now() - 3600000 * 5),
      read: false
    },
    {
      id: 3,
      type: "event",
      content: "Reminder: 'Fundraising Workshop' starts in 2 hours",
      relatedId: 789,
      createdAt: new Date(Date.now() - 3600000 * 12),
      read: true
    },
    {
      id: 4,
      type: "message",
      content: "You have a new message from Sarah Chen",
      relatedId: 101,
      createdAt: new Date(Date.now() - 3600000 * 24),
      read: true
    },
    {
      id: 5,
      type: "discussion",
      content: "Your discussion 'AI in Startups' is trending with 15 new replies",
      relatedId: 102,
      createdAt: new Date(Date.now() - 3600000 * 48),
      read: true
    }
  ];
  
  const formatNotificationTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d ago`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m ago`;
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case "badge":
        return <Award className="h-5 w-5 text-yellow-500" />;
      case "discussion":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "message":
        return <SendHorizontal className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const filteredNotifications = filter === "all" 
    ? notifications 
    : filter === "unread" 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Notifications</CardTitle>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="badge">Badges</SelectItem>
                <SelectItem value="discussion">Discussions</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`flex items-start gap-4 p-3 rounded-md ${notification.read ? "" : "bg-primary/5"} hover:bg-muted`}
          >
            <div className="mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <p className={`${notification.read ? "" : "font-medium"}`}>{notification.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatNotificationTime(notification.createdAt)}</p>
            </div>
            {!notification.read && (
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            )}
          </div>
        ))}
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === "all"
                ? "You're all caught up!"
                : `You don't have any ${filter === "unread" ? "unread" : filter} notifications`}
            </p>
          </div>
        )}
      </CardContent>
      {filteredNotifications.length > 0 && (
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommunityPage;