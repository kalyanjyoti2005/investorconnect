import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { useAI, MessagePurpose } from "@/hooks/use-ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AIMessageGeneratorButtonProps {
  recipientName: string;
  onMessageGenerated: (message: string) => void;
}

export function AIMessageGeneratorButton({
  recipientName,
  onMessageGenerated,
}: AIMessageGeneratorButtonProps) {
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState<MessagePurpose>("introduction");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  
  const { generateMessageMutation, isLoading } = useAI();
  const { toast } = useToast();
  
  // Handle requesting message generation
  const handleGenerateMessage = async () => {
    try {
      const message = await generateMessageMutation.mutateAsync({
        recipientName,
        purpose,
        additionalContext,
      });
      
      setGeneratedMessage(message);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle applying the generated message
  const handleApplyMessage = () => {
    onMessageGenerated(generatedMessage);
    setOpen(false);
    setGeneratedMessage("");
    setAdditionalContext("");
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Generate AI Message"
      >
        <Wand2 className="h-5 w-5" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate AI Message</DialogTitle>
            <DialogDescription>
              Create a professional message using AI. Choose the purpose and add any specific context.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Message Purpose</Label>
              <Select
                value={purpose}
                onValueChange={(value) => setPurpose(value as MessagePurpose)}
              >
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Communication Purpose</SelectLabel>
                    <SelectItem value="introduction">Introduction</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="pitch">Pitch Idea/Business</SelectItem>
                    <SelectItem value="investment_interest">Express Investment Interest</SelectItem>
                    <SelectItem value="meeting_request">Meeting Request</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Additional Context (optional)</Label>
              <Textarea
                id="context"
                placeholder="Add any specific details you'd like to include in the message..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={3}
              />
            </div>
            
            {generatedMessage && (
              <div className="space-y-2">
                <Label htmlFor="generated-message">Generated Message</Label>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                  {generatedMessage}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {!generatedMessage ? (
              <Button 
                onClick={handleGenerateMessage} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Message
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedMessage("")}
                  className="w-full sm:w-auto"
                >
                  Regenerate
                </Button>
                <Button 
                  onClick={handleApplyMessage}
                  className="w-full sm:w-auto"
                >
                  Use This Message
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}