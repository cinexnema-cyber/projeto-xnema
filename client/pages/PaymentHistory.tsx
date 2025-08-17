import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, CreditCard, Download, Calendar, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  method: string;
  invoiceUrl?: string;
}

export default function PaymentHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dados simulados de histórico de pagamentos (em produção, viriam da API)
  const [payments] = useState<PaymentRecord[]>([
    {
      id: "PAY_001",
      date: "2024-01-15",
      amount: 19.90,
      status: 'completed',
      description: "Assinatura Premium - Janeiro 2024",
      method: "Cartão de Crédito ****1234",
      invoiceUrl: "#"
    },
    {
      id: "PAY_002", 
      date: "2024-02-15",
      amount: 19.90,
      status: 'completed',
      description: "Assinatura Premium - Fevereiro 2024",
      method: "Cartão de Crédito ****1234",
      invoiceUrl: "#"
    },
    {
      id: "PAY_003",
      date: "2024-03-15", 
      amount: 19.90,
      status: 'pending',
      description: "Assinatura Premium - Março 2024",
      method: "Cartão de Crédito ****1234"
    },
    {
      id: "PAY_004",
      date: "2024-04-15",
      amount: 19.90,
      status: 'failed',
      description: "Assinatura Premium - Abril 2024",
      method: "Cartão de Crédito ****1234"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Histórico de Pagamentos</h1>
                <p className="text-muted-foreground">
                  Visualize todas as suas transações e faturas
                </p>
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatAmount(totalPaid)}</div>
                <p className="text-xs text-muted-foreground">
                  Desde o início da assinatura
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Realizados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payments.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Transações concluídas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15/04</div>
                <p className="text-xs text-muted-foreground">
                  {formatAmount(19.90)} • Cartão ****1234
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Histórico Completo
              </CardTitle>
              <CardDescription>
                Todas as suas transações em ordem cronológica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(payment.status)}
                      <div>
                        <div className="font-semibold">{payment.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payment.date)} • {payment.method}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatAmount(payment.amount)}</div>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      {payment.invoiceUrl && payment.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Fatura
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {payments.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum pagamento encontrado</h3>
                  <p className="text-muted-foreground">
                    Seu histórico de pagamentos aparecerá aqui
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métodos de Pagamento */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Gerencie seus cartões e métodos de cobrança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Cartão de Crédito</div>
                      <div className="text-sm text-muted-foreground">
                        Visa ****1234 • Expira em 12/2027
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Principal</Badge>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Adicionar Método de Pagamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• As faturas são geradas automaticamente no dia 15 de cada mês</p>
                <p>• Você pode baixar suas faturas para fins de reembolso ou contabilidade</p>
                <p>• Em caso de problemas com pagamento, entre em contato conosco</p>
                <p>• Cancelamentos podem ser feitos a qualquer momento sem taxa</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
