import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, User, AlertTriangle, Info, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Área do Usuário - {user.displayName}
                </h1>
                <p className="text-muted-foreground">
                  Conta básica - Faça upgrade para acessar todo o conteúdo premium
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-200 text-gray-700 rounded-lg px-4 py-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Usuário Básico</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>

          {/* Alert para upgrade */}
          <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950 mb-6">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              <strong>Acesso Limitado:</strong> Você tem acesso apenas às informações básicas. 
              Faça upgrade para Premium e tenha acesso completo aos vídeos!
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Informações da Conta */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações da Conta
                  </CardTitle>
                  <CardDescription>
                    Dados do seu perfil básico no XNEMA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome Completo</p>
                      <p className="font-semibold">{user.displayName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                      <p className="font-semibold text-gray-600">Usuário Básico</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold text-gray-600">Acesso Limitado</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Configurações da Conta</h4>
                        <p className="text-sm text-muted-foreground">Editar informações pessoais</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conteúdo Disponível */}
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo Disponível para Usuários Básicos</CardTitle>
                  <CardDescription>
                    Explore o que você pode acessar com sua conta atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-xnema-surface rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        <Info className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold">Catálogo de Informações</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Veja detalhes, sinopses, trailers e informações sobre todos os filmes e séries
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/catalog">Explorar Catálogo</Link>
                      </Button>
                    </div>

                    <div className="p-4 bg-xnema-surface rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        <Settings className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Categorias</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Navegue pelas diferentes categorias e gêneros disponíveis
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/categories">Ver Categorias</Link>
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed opacity-60">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="h-5 w-5 text-gray-400" />
                        <h4 className="font-semibold text-gray-500">Vídeos Premium</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Acesso completo aos vídeos requer assinatura Premium
                      </p>
                      <Button disabled size="sm" className="w-full">
                        Bloqueado
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed opacity-60">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="h-5 w-5 text-gray-400" />
                        <h4 className="font-semibold text-gray-500">Série Exclusiva</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        "Entre o Céu e o Inferno" disponível apenas para assinantes
                      </p>
                      <Button disabled size="sm" className="w-full">
                        Bloqueado
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upgrade para Premium */}
            <div className="space-y-6">
              <Card className="border-xnema-orange">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xnema-orange">
                    <Crown className="h-5 w-5" />
                    Upgrade Premium
                  </CardTitle>
                  <CardDescription>
                    Desbloqueie todo o potencial do XNEMA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm flex items-center gap-2">
                      ✅ <span>Acesso completo a todos os vídeos</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      ✅ <span>Série exclusiva "Entre o Céu e o Inferno"</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      ✅ <span>Qualidade 4K sem anúncios</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      ✅ <span>Downloads para assistir offline</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      ✅ <span>Suporte prioritário</span>
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t space-y-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-xnema-orange">R$ 19,90</p>
                      <p className="text-sm text-muted-foreground">por mês</p>
                    </div>
                    <Button asChild className="w-full" size="lg">
                      <Link to="/register">
                        <Crown className="w-4 h-4 mr-2" />
                        Assinar Premium
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/pricing">Ver Todos os Planos</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Links Úteis */}
              <Card>
                <CardHeader>
                  <CardTitle>Links Úteis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link to="/pricing">💰 Ver Preços</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link to="/terms-of-service">📄 Termos de Uso</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link to="/privacy-policy">🔒 Política de Privacidade</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
