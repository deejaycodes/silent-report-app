import { useState, useRef, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, User, Bot, PhoneOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "support"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm Sarah, a trained counselor. I'm here to provide support and listen. How are you feeling today?",
    sender: "support",
    timestamp: new Date()
  }
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAutomaticResponse(inputValue),
        sender: "support",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, supportMessage])
      setIsTyping(false)
    }, 2000)
  }

  const getAutomaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes("help") || message.includes("urgent")) {
      return "I understand you need help. Your safety is our priority. If you're in immediate danger, please contact emergency services at 199 or 112. Would you like me to help you find nearby resources or would you prefer to talk about what's happening?"
    }
    
    if (message.includes("scared") || message.includes("afraid")) {
      return "I hear that you're feeling scared, and that's completely understandable. You're brave for reaching out. Can you tell me a bit more about your situation? Remember, everything we discuss here is confidential."
    }
    
    if (message.includes("thank")) {
      return "You're very welcome. Remember, you're not alone in this. Is there anything specific you'd like to talk about or any way I can better support you today?"
    }
    
    return "Thank you for sharing that with me. I want you to know that your feelings are valid and you deserve support. Can you tell me more about how you're feeling or what brought you here today?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Layout className="pb-20">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-card border-b border-border p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-full">
                <Bot className="h-5 w-5 text-success" />
              </div>
              <div>
                <h1 className="font-semibold">Live Support Chat</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Sarah is online
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-destructive">
              <PhoneOff className="h-4 w-4 mr-1" />
              End Chat
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 shadow-soft",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                )}
              >
                <div className="flex items-start gap-2">
                  {message.sender === "support" && (
                    <Bot className="h-4 w-4 mt-0.5 text-success" />
                  )}
                  {message.sender === "user" && (
                    <User className="h-4 w-4 mt-0.5 opacity-80" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1 opacity-70",
                        message.sender === "user" 
                          ? "text-primary-foreground" 
                          : "text-muted-foreground"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-lg p-3 shadow-soft">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-success" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-card border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              variant="trust"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This chat is confidential and secure. Press Enter to send.
          </p>
        </div>
      </div>

      <Navigation />
    </Layout>
  )
}