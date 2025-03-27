import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Video, 
  Loader2,
  Filter, 
  ChevronRight
} from "lucide-react";
import { Event as EventType, EventParticipant } from "@shared/schema";
import { format, isBefore, isAfter, addDays, isSameDay } from "date-fns";

export default function Events() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  
  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery<EventType[]>({
    queryKey: ["/api/events"],
    enabled: !!user,
  });
  
  // Fetch event participants
  const { data: eventParticipants, isLoading: participantsLoading } = useQuery<EventParticipant[]>({
    queryKey: ["/api/events/participants"],
    enabled: !!user,
  });
  
  const isLoading = eventsLoading || participantsLoading;
  
  // Filter events based on tab
  const filteredEvents = events?.filter(event => {
    const eventDate = new Date(event.startTime);
    const today = new Date();
    
    if (selectedTab === "upcoming") {
      return isAfter(eventDate, today) || isSameDay(eventDate, today);
    } else if (selectedTab === "past") {
      return isBefore(eventDate, today) && !isSameDay(eventDate, today);
    } else if (selectedTab === "my-events") {
      // Show events the user is participating in
      return eventParticipants?.some(
        participant => participant.eventId === event.id && participant.userId === user?.id
      );
    } else {
      return true; // "all" tab
    }
  });
  
  // Format date/time
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE, MMM d, yyyy");
  };
  
  const formatEventTime = (startString: string, endString: string) => {
    const start = new Date(startString);
    const end = new Date(endString);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };
  
  // Check if event is today
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return isSameDay(date, today);
  };
  
  // Check if event is tomorrow
  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    const tomorrow = addDays(new Date(), 1);
    return isSameDay(date, tomorrow);
  };
  
  // Check if user is registered for an event
  const isRegistered = (eventId: number) => {
    return eventParticipants?.some(
      participant => participant.eventId === eventId && participant.userId === user?.id
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto">
            <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Events
              </h2>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
                <CardDescription>
                  Browse and register for upcoming pitch events, meetings, and networking opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="my-events">My Events</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredEvents && filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className={`h-2 ${
                            isToday(event.startTime) 
                              ? "bg-red-500" 
                              : isTomorrow(event.startTime) 
                                ? "bg-orange-500" 
                                : "bg-primary-500"
                          }`} />
                          <CardContent className="pt-6">
                            <div className="mb-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium">{event.title}</h3>
                                {isToday(event.startTime) ? (
                                  <Badge variant="destructive">Today</Badge>
                                ) : isTomorrow(event.startTime) ? (
                                  <Badge variant="secondary">Tomorrow</Badge>
                                ) : null}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {event.description}
                              </p>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{formatEventDate(event.startTime)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{formatEventTime(event.startTime, event.endTime)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                {event.location.toLowerCase().includes('virtual') ? (
                                  <Video className="h-4 w-4 mr-2 text-gray-500" />
                                ) : (
                                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                )}
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 mr-2 text-gray-500" />
                                <span>12 participants</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                className="flex-1"
                                variant={isRegistered(event.id) ? "secondary" : "default"}
                                onClick={() => setSelectedEvent(event)}
                              >
                                {isRegistered(event.id) ? "Registered" : "Register"}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex items-center"
                                onClick={() => setSelectedEvent(event)}
                              >
                                Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mx-auto mb-4 w-fit">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No events found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {selectedTab === "upcoming" 
                          ? "There are no upcoming events scheduled." 
                          : selectedTab === "past" 
                            ? "There are no past events." 
                            : selectedTab === "my-events" 
                              ? "You haven't registered for any events yet." 
                              : "No events found."}
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </div>
                  )}
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Event Detail Modal */}
            {selectedEvent && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedEvent.title}</CardTitle>
                        <CardDescription>{formatEventDate(selectedEvent.startTime)}</CardDescription>
                      </div>
                      {isToday(selectedEvent.startTime) ? (
                        <Badge variant="destructive">Today</Badge>
                      ) : isTomorrow(selectedEvent.startTime) ? (
                        <Badge variant="secondary">Tomorrow</Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">{selectedEvent.description}</p>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatEventDate(selectedEvent.startTime)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatEventTime(selectedEvent.startTime, selectedEvent.endTime)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {selectedEvent.location.toLowerCase().includes('virtual') ? (
                          <Video className="h-5 w-5 mr-3 text-gray-500" />
                        ) : (
                          <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                        )}
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedEvent.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Participants (12)</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Avatar key={i}>
                            <AvatarImage src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} />
                            <AvatarFallback>P{i + 1}</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                          +6
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                      Close
                    </Button>
                    <Button variant={isRegistered(selectedEvent.id) ? "secondary" : "default"}>
                      {isRegistered(selectedEvent.id) ? (
                        <>
                          <Video className="h-4 w-4 mr-2" />
                          Join Event
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
          <p>&copy; 2023 StartupMatch. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
