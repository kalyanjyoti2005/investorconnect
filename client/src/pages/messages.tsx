import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { UserList } from "@/components/chat/user-list";
import { ChatInterface } from "@/components/chat/chat-interface";
import { User } from "@shared/schema";
import { MessageCircle } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full p-4 overflow-y-auto flex-1">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
            {/* User list */}
            <div className="md:col-span-1">
              <UserList 
                onSelectUser={handleSelectUser} 
                selectedUserId={selectedUser?.id}
              />
            </div>
            
            {/* Chat interface */}
            <div className="hidden md:block md:col-span-2">
              {selectedUser ? (
                <ChatInterface 
                  recipientId={selectedUser.id} 
                  recipientName={selectedUser.name}
                />
              ) : (
                <div className="flex items-center justify-center h-[70vh] bg-muted/30 rounded-lg">
                  <div className="text-center p-8">
                    <div className="mx-auto bg-background w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a user from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
