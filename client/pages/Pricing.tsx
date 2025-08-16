import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  Star,
  Shield,
  Smartphone,
  Tv,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  checkoutUrl: string;
  features: string[];
}

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/subscription/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Open Mercado Pago checkout
    window.open(plan.checkoutUrl, "_blank");
  };

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Planos de{" "}
              <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">
                Assinatura
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano perfeito para você. Primeiro mês grátis para novos
              assinantes!
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-xnema-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando planos...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
              {plans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.id === "premium" ? "border-2 border-xnema-orange scale-105" : "border-xnema-border"} transition-all hover:scale-105`}
                >
                  {plan.id === "premium" && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-xnema-orange to-xnema-purple px-4 py-1 rounded-full">
                        <span className="text-black font-bold text-sm flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>RECOMENDADO</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="py-4">
                      <div className="text-4xl font-bold text-xnema-orange">
                        R$ {plan.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        por mês
                      </div>
                      {plan.id === "premium" && (
                        <div className="text-sm text-green-500 font-medium mt-1">
                          Primeiro mês grátis!
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${plan.id === "premium" ? "bg-gradient-to-r from-xnema-orange to-xnema-purple text-black" : ""}`}
                      onClick={() => handleSubscribe(plan)}
                      variant={plan.id === "premium" ? "default" : "outline"}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Assinar Agora
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Conteúdo Exclusivo
                </h3>
                <p className="text-muted-foreground">
                  Acesso antecipado a séries como "Between Heaven and Hell" e
                  filmes exclusivos
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-xnema-purple to-xnema-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tv className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Multi-dispositivos
                </h3>
                <p className="text-muted-foreground">
                  Assista em TV, computador, tablet ou smartphone com até 4
                  telas simultâneas
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Sem Compromisso
                </h3>
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
                  Você tem acesso completo por 30 dias sem pagar nada. Após esse
                  período, será cobrado R$ 19,90/mês automaticamente.
                </p>
              </div>

              <div className="bg-xnema-surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem
                  taxas ou multas.
                </p>
              </div>

              <div className="bg-xnema-surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Quantos dispositivos posso usar?
                </h3>
                <p className="text-muted-foreground">
                  Sua assinatura permite até 4 telas simultâneas em dispositivos
                  diferentes.
                </p>
              </div>

              <div className="bg-xnema-surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Como funciona o pagamento?
                </h3>
                <p className="text-muted-foreground">
                  Utilizamos o Mercado Pago para processar os pagamentos de
                  forma segura. Você pode pagar com cartão de crédito, débito ou
                  PIX.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
