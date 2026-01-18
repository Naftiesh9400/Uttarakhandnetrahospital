import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const hasInteracted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted.current) {
        setIsOpen(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const phoneNumber = '917535021231';
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
    hasInteracted.current = true;
  };

  const toggleChat = () => {
    hasInteracted.current = true;
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-card border border-border rounded-2xl shadow-xl p-4 mb-4 w-80 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Chat with us</h3>
            <button onClick={() => {
              setIsOpen(false);
              hasInteracted.current = true;
            }} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Hi! How can we help you today?
          </p>
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-[#25D366] hover:bg-[#128C7E] text-white">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleChat}
            size="icon"
            className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg transition-transform hover:scale-110"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.536 0 1.52 1.115 2.988 1.264 3.186.149.198 2.19 3.325 5.27 4.648 3.08 1.323 3.08 1.323 3.66 1.225.58-.099 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.96 1.002-3.645-.235-.375a9.885 9.885 0 01-1.516-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat with us</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}