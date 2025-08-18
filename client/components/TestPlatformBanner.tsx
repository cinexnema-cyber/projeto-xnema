import { useState } from "react";
import { X, AlertTriangle, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TestPlatformBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="font-semibold text-sm sm:text-base">
              🧪 PLATAFORMA EM TESTE
            </span>
            <span className="text-xs sm:text-sm opacity-90">
              Recursos limitados • Em breve: criação de contas liberada
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-white/10 p-2 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
