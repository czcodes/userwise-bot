
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, Bot, Paperclip, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sendChatMessage } from "@/services/api";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your DevOps assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("1"); // Default session ID
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      // Send message to backend API
      const response = await sendChatMessage(sessionId, input);
      
      // Add bot response from API
      const botMessage: Message = {
        id: response.id || Date.now().toString() + "-response",
        content: response.content,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload functionality will be implemented in the next version.",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className={message.sender === "user" ? "bg-primary" : "bg-secondary"}>
                  {message.sender === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="bg-secondary">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handleFileUpload}
            title="Attach a file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
