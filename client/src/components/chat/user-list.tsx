import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, UserCircle2 } from 'lucide-react';

interface UserListProps {
  onSelectUser: (user: User) => void;
  selectedUserId?: number;
}

export function UserList({ onSelectUser, selectedUserId }: UserListProps) {
  const { user: currentUser } = useAuth();

  // Fetch all users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: !!currentUser,
  });

  // Fetch unread messages count for users
  const { data: allMessages } = useQuery<any[]>({
    queryKey: ['/api/messages'],
    enabled: !!currentUser,
  });

  // Get unread count for a specific user
  const getUnreadCount = (userId: number) => {
    if (!allMessages) return 0;
    
    return allMessages.filter(
      message => message.senderId === userId && 
      message.receiverId === currentUser?.id && 
      message.status === 'unread'
    ).length;
  };

  // Generate user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Get filtered users (exclude current user)
  const filteredUsers = users?.filter(u => u.id !== currentUser?.id) || [];

  return (
    <Card className="h-[70vh]">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
        <CardDescription>Chat with founders and investors</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <ScrollArea className="h-[calc(70vh-5rem)]">
            <div className="px-4 pb-4 space-y-2">
              {filteredUsers.map((user) => {
                const unreadCount = getUnreadCount(user.id);
                return (
                  <Button
                    key={user.id}
                    variant={selectedUserId === user.id ? "default" : "ghost"}
                    className="w-full justify-start p-2 h-auto"
                    onClick={() => onSelectUser(user)}
                  >
                    <div className="flex items-center w-full">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          {unreadCount > 0 && (
                            <Badge className="ml-2">{unreadCount}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 h-40 text-center text-muted-foreground">
            <UserCircle2 className="h-10 w-10 mb-2" />
            <p>No users found</p>
            <p className="text-sm">Network with more founders and investors</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}