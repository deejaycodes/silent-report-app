import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, ArrowLeft, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import apiService from "@/lib/api"

interface Message {
  id: string
  content: string
  sender: "user" | "support"
  timestamp: Date
  error?: boolean
}

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! I'm SafeVoice AI assistant. I can help answer questions, provide support, and connect you with resources. How can I help you today?", sender: "support", timestamp: new Date() }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    const userMsg: Message = { id: Date.now().toString(), content: inputValue, sender: "user", timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    const userInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await apiService.askChatbot(userInput)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), content: response.response, sender: "support", timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting. If you're in immediate danger, please call 112 or 199.",
        sender: "support", timestamp: new Date(), error: true
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold">SafeVoice Assistant</h1>
          <p className="text-[11px] text-muted-foreground">AI-powered · Confidential</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5", msg.sender === "user"
              ? "bg-primary text-primary-foreground rounded-br-md"
              : msg.error ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-md" : "bg-muted rounded-bl-md"
            )}>
              {msg.error && <AlertTriangle className="h-3.5 w-3.5 mb-1 text-red-500" />}
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={cn("text-[10px] mt-1", msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-card border-t border-border safe-bottom">
        <div className="flex gap-2">
          <Input value={inputValue} onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message..." className="flex-1 rounded-full" disabled={isTyping} />
          <Button onClick={sendMessage} disabled={!inputValue.trim() || isTyping} size="icon" className="rounded-full h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Confidential · AI responses may not always be accurate</p>
      </div>
    </div>
  )
}
