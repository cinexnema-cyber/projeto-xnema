import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Crown, Check, Star, Shield, Smartphone, Tv } from "lucide-react";

export default function Pricing() {
  const handlePayment = () => {
    window.open('https://mpago.la/1p9Jkyy', '_blank');
  };

  const features = [
    "Streaming em 4K Ultra HD",
    "Acesso a todo catálogo premium",
    "Sem anúncios ou interrupções",
    "Download para assistir offline",
    "Até 4 telas simultâneas",
    "Conteúdo exclusivo XNEMA",
    "Suporte técnico prioritário",
    "Primeira temporada completa de Between Heaven and Hell"
  ];

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Planos de <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">Assinatura</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano perfeito para você. Primeiro mês grátis para novos assinantes!
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-xnema-surface to-background border-2 border-xnema-orange rounded-3xl p-8 shadow-2xl">
              {/* Premium Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-xnema-orange to-xnema-purple px-6 py-2 rounded-full">
                  <span className="text-black font-bold flex items-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>PLANO PREMIUM</span>
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mt-8 mb-8">
                <div className="text-sm text-muted-foreground mb-2">Primeiro mês</div>
                <div className="text-5xl font-bold text-xnema-orange mb-2">GRÁTIS</div>
                <div className="text-sm text-muted-foreground mb-4">Depois apenas</div>
                <div className="text-3xl font-bold text-foreground">
                  R$ 19,90<span className="text-lg text-muted-foreground">/mês</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-xnema-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Payment Button */}
              <Button 
                size="lg" 
                className="w-full bg-xnema-orange hover:bg-xnema-orange/90 text-black font-bold text-lg py-4"
                onClick={handlePayment}
              >
                Assinar Agora - Primeiro Mês Grátis
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Cancele quando quiser. Sem multas ou taxas adicionais.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Por que escolher a XNEMA Premium?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Conteúdo Exclusivo</h3>
                <p className="text-muted-foreground">
                  Acesso antecipado a séries como "Between Heaven and Hell" e filmes exclusivos
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-xnema-purple to-xnema-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tv className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Multi-dispositivos</h3>
                <p className="text-muted-foreground">
                  Assista em TV, computador, tablet ou smartphone com até 4 telas simultâneas
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Sem Compromisso</h3>
                <p className="text-muted-foreground">
                  Cancele quando quiser, sem multas ou taxas de cancelamento
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-6">
              <div className="bg-xnema-surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Como funciona o primeiro mês grátis?
                </h3>
                <p className="text-muted-foreground">
                  Você tem acesso completo por 30 dias sem pagar nada. Após esse período, será cobrado R$ 19,90/mês automaticamente.
                </p>
              </div>
              
              <div className="bg-xnema-surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas.
                </p>
              </div>
              
              <div className="bg-xnema-surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Quantos dispositivos posso usar?
                </h3>
                <p className="text-muted-foreground">
                  Sua assinatura permite até 4 telas simultâneas em dispositivos diferentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
