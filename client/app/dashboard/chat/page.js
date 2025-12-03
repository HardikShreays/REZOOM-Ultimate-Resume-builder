'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, Upload, X, CheckCircle, ExternalLink } from "lucide-react";
import api from "@/services/api";

// Helper to format AI responses (remove markdown stars, format nicely)
function formatResponse(content) {
  if (!content) return '';
  
  // Remove markdown bold/italic stars
  let formatted = content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
    .replace(/`(.*?)`/g, '$1'); // Remove `code`
  
  // Split by double newlines for paragraphs
  const paragraphs = formatted.split(/\n\n+/);
  
  return paragraphs.map((para, idx) => {
    // Check if it's a list item
    if (para.trim().match(/^[-•]\s/)) {
      const items = para.split(/\n(?=[-•])/).filter(Boolean);
      return (
        <ul key={idx} className="list-disc list-inside space-y-2 my-3 ml-4">
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="text-[15px] leading-7">
              {item.replace(/^[-•]\s/, '')}
            </li>
          ))}
        </ul>
      );
    }
    // Regular paragraph
    return (
      <p key={idx} className="mb-3 text-[15px] leading-7">
        {para.split('\n').map((line, lineIdx) => (
          <span key={lineIdx}>
            {line}
            {lineIdx < para.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load saved messages', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("chat_messages"); // Clear chat on logout
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      document.title = `AI Assistant – ${user.name} | REZOOM`;
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage = {
      role: "user",
      content: inputMessage.trim(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setSending(true);

    try {
      // Prepare messages array for API
      const messagesForAPI = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await api.post("/chat", {
        messages: messagesForAPI,
      });

      // Add assistant reply
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply.content,
        },
      ]);

      // Show notifications for operations
      if (response.data.operations && response.data.operations.length > 0) {
        response.data.operations.forEach((op) => {
          showNotification({
            id: Date.now() + Math.random(),
            type: op.type,
            message: op.message,
            link: op.link,
          });
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = err.response?.data?.message || "I apologize, but I encountered an error. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMsg,
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setShowUpload(false);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/chat/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add messages about the upload
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `I've uploaded my resume. Please extract the information and add it to my profile.`,
        },
        {
          role: "assistant",
          content: response.data.message || "I've extracted information from your resume and added it to your profile. You can review it in your dashboard.",
        },
      ]);

      showNotification({
        id: Date.now(),
        type: 'resume_uploaded',
        message: 'Resume uploaded and processed',
        link: '/dashboard/profile',
      });
    } catch (err) {
      console.error("Upload error:", err);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("chat_messages");
    router.push("/");
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('chat_messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/50 border-t-primary"></div>
          <p className="text-[12px] uppercase tracking-[0.3em] text-foreground/60">Loading chat</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className="border border-primary/30 bg-card/95 shadow-lg p-4 min-w-[300px] animate-in slide-in-from-right"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{notif.message}</p>
                {notif.link && (
                  <Link href={notif.link} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
              <button
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                className="text-foreground/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex h-[calc(100vh-12rem)] flex-col">
        {/* Header */}
        <div className="mb-6 space-y-3 border-b border-border/80 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="border-border/60 bg-accent/80 text-foreground/60">AI Assistant</Badge>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearChat} className="text-xs">
                  Clear Chat
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpload(!showUpload)}
                className="text-xs"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
            </div>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,4vw,3.2rem)] leading-[1.05]">
            Your Professional Resume Advisor
          </h1>
          <p className="max-w-2xl text-[15px] leading-7 text-foreground/70">
            Get honest, professional guidance on building your resume. I can help you add experiences, refine content, and create resumes tailored to your goals.
          </p>
        </div>

        {/* Upload Resume Modal */}
        {showUpload && (
          <Card className="mb-4 border border-primary/30 bg-card/95 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Upload Resume (PDF)</h3>
              <button onClick={() => setShowUpload(false)} className="text-foreground/40 hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button variant="outline" className="w-full" disabled={uploading} asChild>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose PDF File
                    </>
                  )}
                </span>
              </Button>
            </label>
            <p className="text-xs text-foreground/50 mt-2">
              Upload your resume and I'll extract the information to populate your profile.
            </p>
          </Card>
        )}

        {/* Messages Container */}
        <Card className="mb-4 flex-1 overflow-hidden border border-border/70 bg-card/90">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border/60 bg-card">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl">Start a conversation</h3>
                  <p className="max-w-md text-[15px] leading-7 text-foreground/60">
                    Ask me anything about building your resume, adding experiences, or creating a new resume.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage("Help me create a resume")}
                      className="text-xs"
                    >
                      Create resume
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage("Show me my profile")}
                      className="text-xs"
                    >
                      View profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage("Add a new experience")}
                      className="text-xs"
                    >
                      Add experience
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "border border-border/60 bg-card/80 text-foreground"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="text-[15px] leading-7">
                            {formatResponse(message.content)}
                          </div>
                        ) : (
                          <p className="text-[15px] leading-7 whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card">
                          <User className="h-5 w-5 text-foreground/70" />
                        </div>
                      )}
                    </div>
                  ))}
                  {sending && (
                    <div className="flex gap-4 justify-start">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="border border-border/60 bg-card/80 rounded-2xl px-5 py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-foreground/60" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border/80 p-4">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your resume..."
                  className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-4 py-3 text-[15px] leading-7 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={1}
                  disabled={sending}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputMessage.trim() || sending}
                  className="rounded-xl px-6"
                  size="lg"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
