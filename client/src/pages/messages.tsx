import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Message as MessageType } from "@shared/schema";
import { SendHorizonal, Search, Loader2, CheckCircle2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function Messages() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  // Get all messages for the current user
  const { data: messages, isLoading: messagesLoading } = useQuery<MessageType[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });

  // Get conversation messages when a user is selected
  const { data: conversationMessages, isLoading: conversationLoading } = useQuery<MessageType[]>({
    queryKey: [`/api/messages/${selectedUserId}`],
    enabled: !!selectedUserId,
  });

  // Get all users (in a real app, you would probably want to paginate this)
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: number; content: string }) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      if (selectedUserId) {
        queryClient.invalidateQueries({ queryKey: [`/api/messages/${selectedUserId}`] });
      }
      setMessageText("");
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest("PUT", `/api/messages/${messageId}/read`, {});
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      if (selectedUserId) {
        queryClient.invalidateQueries({ queryKey: [`/api/messages/${selectedUserId}`] });
      }
    },
  });

  // Get unique users from messages
  const getUniqueContactsFromMessages = () => {
    if (!messages || !users) return [];
    
    const contactsMap = new Map<number, {
      user: User,
      lastMessage: MessageType,
      unreadCount: number
    }>();
    
    messages.forEach(message => {
      const contactId = message.senderId === user?.id ? message.receiverId : message.senderId;
      const contactUser = users.find(u => u.id === contactId);
      
      if (contactUser) {
        const existingContact = contactsMap.get(contactId);
        const unreadCount = message.receiverId === user?.id && message.status === "unread" 
          ? (existingContact?.unreadCount || 0) + 1 
          : (existingContact?.unreadCount || 0);
        
        if (!existingContact || new Date(message.createdAt) > new Date(existingContact.lastMessage.createdAt)) {
          contactsMap.set(contactId, {
            user: contactUser,
            lastMessage: message,
            unreadCount
          });
        } else if (unreadCount !== existingContact.unreadCount) {
          contactsMap.set(contactId, {
            ...existingContact,
            unreadCount
          });
        }
      }
    });
    
    return Array.from(contactsMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
  };

  // Filter contacts by search query
  const filteredContacts = getUniqueContactsFromMessages().filter(contact => 
    contact.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user by ID
  const getUserById = (userId: number): User | undefined => {
    return users?.find(u => u.id === userId);
  };

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !messageText.trim()) return;
    
    sendMessageMutation.mutate({
      receiverId: selectedUserId,
      content: messageText.trim()
    });
  };

  // Mark unread messages as read when conversation is opened
  useEffect(() => {
    if (selectedUserId && conversationMessages) {
      conversationMessages.forEach(message => {
        if (message.receiverId === user?.id && message.status === "unread") {
          markAsReadMutation.mutate(message.id);
        }
      });
    }
  }, [selectedUserId, conversationMessages, user?.id]);

  // Format message timestamp
  const formatMessageTime = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    } else if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, "MMM d");
    } else {
      return format(messageDate, "MMM d, yyyy");
    }
  };

  // Get selected user
  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto flex-1 flex">
          <div className="flex w-full h-full">
            {/* Contacts sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4 border-r dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
              <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                {usersLoading || messagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredContacts.length > 0 ? (
                  <div className="divide-y dark:divide-gray-700">
                    {filteredContacts.map(({ user: contactUser, lastMessage, unreadCount }) => (
                      <div 
                        key={contactUser.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedUserId === contactUser.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                        onClick={() => setSelectedUserId(contactUser.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={contactUser.profileImage} alt={contactUser.name} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {contactUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate">{contactUser.name}</p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatMessageTime(lastMessage.createdAt)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <p className={`text-sm truncate ${
                                lastMessage.receiverId === user?.id && lastMessage.status === 'unread'
                                  ? 'text-gray-900 dark:text-white font-medium'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {lastMessage.senderId === user?.id ? 'You: ' : ''}
                                {lastMessage.content}
                              </p>
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="rounded-full text-xs px-2 ml-2">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
                      <SendHorizonal className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No messages yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery 
                        ? `No conversations match "${searchQuery}"`
                        : "Connect with founders and investors by starting a conversation"
                      }
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Chat area */}
            <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col bg-gray-50 dark:bg-gray-900">
              {selectedUserId && selectedUser ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
                    <Avatar className="mr-3">
                      <AvatarImage src={selectedUser.profileImage} alt={selectedUser.name} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {selectedUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedUser.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <ScrollArea className="flex-1 p-4">
                    {conversationLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : conversationMessages && conversationMessages.length > 0 ? (
                      <div className="space-y-4">
                        {conversationMessages.map((message) => {
                          const isCurrentUser = message.senderId === user?.id;
                          
                          return (
                            <div 
                              key={message.id} 
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className="flex flex-col max-w-[70%]">
                                <div 
                                  className={`rounded-lg p-3 ${
                                    isCurrentUser 
                                      ? 'bg-primary-600 text-white' 
                                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <div className={`flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                                  isCurrentUser ? 'justify-end' : 'justify-start'
                                }`}>
                                  <span>{formatMessageTime(message.createdAt)}</span>
                                  {isCurrentUser && message.status === 'read' && (
                                    <CheckCircle2 className="h-3 w-3 ml-1 text-primary-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
                          <SendHorizonal className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No messages yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Send your first message to start the conversation
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                  
                  {/* Chat input */}
                  <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input 
                        placeholder="Type your message..." 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SendHorizonal className="h-4 w-4" />
                        )}
                        <span className="ml-2">Send</span>
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-5 mb-4">
                    <SendHorizonal className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your messages</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Select a conversation from the list to view messages or start a new conversation with founders and investors.
                  </p>
                </div>
              )}
            </div>
            
            {/* Mobile: No conversation selected message */}
            <div className="md:hidden flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 text-center">
              <div>
                <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-5 mx-auto mb-4">
                  <SendHorizonal className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your messages</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a conversation to view your messages
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
