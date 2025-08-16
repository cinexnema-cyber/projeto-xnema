import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SubscriberOnlyVideos } from "@/components/SubscriberOnlyVideos";
import { Link } from "react-router-dom";
import { Play, Crown, Star, Users, Zap, Shield } from "lucide-react";

export default function Index() {
  const featuredMovies = [
    {
      id: 1,
      title: "Horizonte Infinito",
      genre: "Ficção Científica",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
      isPremium: true
    },
    {
      id: 2,
      title: "Mistérios da Cidade",
      genre: "Thriller",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1489599809568-c88341c7bfeb?w=400&h=600&fit=crop",
      isPremium: true
    },
    {
      id: 3,
      title: "Aventura Selvagem",
      genre: "Aventura",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
      isPremium: false
    },
    {
      id: 4,
      title: "Romance de Verão",
      genre: "Romance",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400&h=600&fit=crop",
      isPremium: true
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489599809568-c88341c7bfeb?w=1920&h=1080&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
        
        <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Bem-vindo ao
              <span className="block text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">
                XNEMA
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              A nova era do streaming brasileiro. Filmes exclusivos, séries originais e conteúdo premium por apenas <span className="text-xnema-orange font-semibold">R$ 19,90/mês</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold text-lg px-8 py-4" asChild>
                <Link to="/login" className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Primeiro Mês Grátis</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-xnema-purple text-xnema-purple hover:bg-xnema-purple hover:text-black font-semibold text-lg px-8 py-4" asChild>
                <Link to="/between-heaven-hell" className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Ver Série Exclusiva</span>
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-xnema-orange" />
                <span>+10.000 assinantes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-xnema-orange" />
                <span>4.8/5 avaliação</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-xnema-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Por que escolher a XNEMA?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma experiência de streaming única com tecnologia de ponta e conteúdo exclusivo
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background rounded-2xl border border-xnema-border">
              <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Streaming 4K</h3>
              <p className="text-muted-foreground">
                Qualidade ultra HD com tecnologia adaptativa para a melhor experiência visual
              </p>
            </div>
            
            <div className="text-center p-8 bg-background rounded-2xl border border-xnema-border">
              <div className="w-16 h-16 bg-gradient-to-br from-xnema-purple to-xnema-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Conteúdo Exclusivo</h3>
              <p className="text-muted-foreground">
                Filmes e séries originais que você não encontra em nenhum outro lugar
              </p>
            </div>
            
            <div className="text-center p-8 bg-background rounded-2xl border border-xnema-border">
              <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Sem Anúncios</h3>
              <p className="text-muted-foreground">
                Assista sem interrupções com nossa experiência premium livre de publicidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Series Spotlight */}
      <section className="py-20 bg-xnema-surface">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-xnema-orange text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>SÉRIE EXCLUSIVA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-xnema-orange fill-current" />
                  <span className="text-foreground font-semibold">4.9</span>
                </div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Between Heaven <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">and Hell</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Uma saga épica que explora os limites entre o bem e o mal. 7 temporadas, 84 episódios de puro drama sobrenatural que vai redefinir sua percepção sobre moralidade e humanidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button size="lg" className="bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold" asChild>
                  <Link to="/between-heaven-hell" className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Assistir Agora</span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-xnema-purple text-xnema-purple hover:bg-xnema-purple hover:text-black font-semibold" asChild>
                  <Link to="/between-heaven-hell">Saiba Mais</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>7 Temporadas</span>
                <span>84 Episódios</span>
                <span>Drama Sobrenatural</span>
                <span>2025</span>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-xnema-orange/20 to-xnema-purple/20 flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ff280dc7f1a3b442bb1f2a4e0b57c6521%2F53ce9d12d034482db26dcf63073a2cfe?format=webp&width=800"
                  alt="Between Heaven and Hell"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Em Destaque
            </h2>
            <Button variant="outline" asChild>
              <Link to="/catalog">Ver Todos</Link>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-xnema-surface">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {movie.isPremium && (
                    <div className="absolute top-3 right-3 bg-xnema-orange text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <Button size="sm" className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
                      <Play className="w-4 h-4 mr-2" />
                      {movie.isPremium ? "Assinar para Assistir" : "Assistir Grátis"}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{movie.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{movie.genre}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-xnema-orange fill-current" />
                      <span className="text-sm text-muted-foreground">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Videos Section */}
      <section className="py-20 bg-xnema-surface">
        <div className="container mx-auto px-4">
          <SubscriberOnlyVideos
            title="Filmes e Séries Premium"
            description="Conteúdo exclusivo para assinantes XNEMA"
            videos={[
              {
                id: '1',
                title: 'Between Heaven and Hell - T1E01',
                thumbnail: 'https://cdn.builder.io/api/v1/image/assets%2Ff280dc7f1a3b442bb1f2a4e0b57c6521%2F53ce9d12d034482db26dcf63073a2cfe?format=webp&width=400',
                duration: '45 min',
                description: 'O início de uma saga épica entre anjos e demônios'
              },
              {
                id: '2',
                title: 'Horizonte Infinito',
                thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
                duration: '2h 15min',
                description: 'Uma jornada através das estrelas em busca da verdade'
              },
              {
                id: '3',
                title: 'Mistérios da Cidade',
                thumbnail: 'https://images.unsplash.com/photo-1489599809568-c88341c7bfeb?w=400&h=600&fit=crop',
                duration: '1h 45min',
                description: 'Thriller urbano cheio de reviravoltas'
              },
              {
                id: '4',
                title: 'Aventura Selvagem',
                thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
                duration: '1h 30min',
                description: 'Uma aventura épica pela natureza selvagem'
              },
              {
                id: '5',
                title: 'Coração Digital',
                thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
                duration: '2h 05min',
                description: 'Romance futurista sobre inteligência artificial'
              },
              {
                id: '6',
                title: 'O Último Guardião',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
                duration: '1h 55min',
                description: 'Fantasia épica sobre o último protetor do reino'
              }
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-xnema-orange to-xnema-purple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Comece sua jornada hoje
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Primeiro mês grátis, depois apenas R$ 19,90/mês. Cancele quando quiser, sem multas ou taxas extras.
          </p>
          <Button size="lg" variant="outline" className="bg-black text-white hover:bg-gray-900 border-black font-semibold text-lg px-8 py-4" asChild>
            <Link to="/subscribe">
              Começar Grátis Agora
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
