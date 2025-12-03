'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, X, Bot } from 'lucide-react';
import Link from 'next/link';

export function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        size="lg"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
      </Button>

      {/* Quick Actions Popup */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-80 border border-border/70 bg-card/95 shadow-xl p-4 animate-in slide-in-from-bottom">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">AI Assistant</h3>
            </div>
            <Link href="/dashboard/chat" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start text-left">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
            </Link>
            <div className="text-xs text-foreground/60 space-y-1">
              <p className="font-medium">Quick actions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Get resume advice</li>
                <li>Add experiences</li>
                <li>Generate resume</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

