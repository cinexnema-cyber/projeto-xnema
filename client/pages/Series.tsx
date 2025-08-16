import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Star, Crown, Calendar, Users, Plus } from "lucide-react";

export default function Series() {
  const allSeries = [
    {
      id: 1,
      title: "Between Heaven and Hell",
      description: "Uma saga épica que explora os limites entre o bem e o mal",
      genre: "Drama Sobrenatural",
      rating: 4.9,
      seasons: 7,
      episodes: 84,
      releaseYear: 2025,
      status: "Em Produção",
      image: "https://cdn.builder.io/api/v1/image/assets%2Ff280dc7f1a3b442bb1f2a4e0b57c6521%2F53ce9d12d034482db26dcf63073a2cfe?format=webp&width=600",
      isExclusive: true,
      isAvailable: true
    },
    {
      id: 2,
      title: "Cidade das Sombras",
      description: "Um thriller urbano sobre corrupção e justiça",
      genre: "Thriller Policial",
      rating: 4.7,
      seasons: 3,
      episodes: 36,
      releaseYear: 2025,
      status: "Em Desenvolvimento",
      image: "https://images.unsplash.com/photo-1489599809568-c88341c7bfeb?w=600&h=800&fit=crop",
      isExclusive: true,
      isAvailable: false
    },
    {
      id: 3,
      title: "Tempo Perdido",
      description: "Ficção científica sobre viagem no tempo",
      genre: "Ficção Científica",
      rating: 4.6,
      seasons: 4,
      episodes: 48,
      releaseYear: 2025,
      status: "Pré-produção",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=800&fit=crop",
      isExclusive: true,
      isAvailable: false
    },
    {
      id: 4,
      title: "Raízes Brasileiras",
      description: "Drama histórico sobre a formação do Brasil",
      genre: "Drama Histórico",
      rating: 4.8,
      seasons: 5,
      episodes: 60,
      releaseYear: 2025,
      status: "Roteiro",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop",
      isExclusive: true,
      isAvailable: false
    },
    {
      id: 5,
      title: "Fam��lia Digital",
      description: "Comédia sobre tecnologia e relacionamentos",
      genre: "Comédia",
      rating: 4.4,
      seasons: 2,
      episodes: 24,
      releaseYear: 2025,
      status: "Conceito",
      image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=600&h=800&fit=crop",
      isExclusive: true,
      isAvailable: false
    },
    {
      id: 6,
      title: "Amazônia Secreta",
      description: "Documentário sobre os mistérios da floresta",
      genre: "Documentário",
      rating: 4.9,
      seasons: 1,
      episodes: 8,
      releaseYear: 2025,
      status: "Filmagem",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=800&fit=crop",
      isExclusive: true,
      isAvailable: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Produção": return "text-green-500";
      case "Em Desenvolvimento": return "text-blue-500";
      case "Pré-produção": return "text-yellow-500";
      case "Roteiro": return "text-purple-500";
      case "Conceito": return "text-orange-500";
      case "Filmagem": return "text-emerald-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-xnema-dark via-background to-xnema-surface" />
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
                Universo de <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">Séries</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Explore nosso catálogo exclusivo de séries originais XNEMA. Cada história é única, cada episódio é uma jornada.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold text-lg px-8 py-4" asChild>
                  <Link to="/between-heaven-hell" className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Assistir Agora</span>
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" className="border-xnema-purple text-xnema-purple hover:bg-xnema-purple hover:text-black font-semibold text-lg px-8 py-4" asChild>
                  <Link to="/subscribe" className="flex items-center space-x-2">
                    <Crown className="w-5 h-5" />
                    <span>Assinar Premium</span>
                  </Link>
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-xnema-orange mb-2">6+</div>
                  <div className="text-muted-foreground">Séries Exclusivas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-xnema-orange mb-2">200+</div>
                  <div className="text-muted-foreground">Episódios Planejados</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-xnema-orange mb-2">4K</div>
                  <div className="text-muted-foreground">Qualidade Ultra HD</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Series Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Catálogo Completo de Séries
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {allSeries.map((series) => (
                <div key={series.id} className="group cursor-pointer bg-xnema-surface rounded-2xl overflow-hidden hover:bg-background transition-colors">
                  <div className="grid md:grid-cols-5 h-full">
                    {/* Image */}
                    <div className="md:col-span-2 relative aspect-[3/4] md:aspect-auto overflow-hidden">
                      <img
                        src={series.image}
                        alt={series.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-sm ${getStatusColor(series.status)}`}>
                          {series.status}
                        </div>
                      </div>
                      
                      {series.isExclusive && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-xnema-purple text-white px-2 py-1 rounded-full text-xs font-semibold">
                            EXCLUSIVA
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="md:col-span-3 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xnema-orange font-semibold text-sm">{series.genre}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-xnema-orange fill-current" />
                            <span className="text-sm text-muted-foreground">{series.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-foreground mb-3">{series.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{series.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-xnema-orange" />
                            <span>{series.releaseYear}</span>
                          </div>
                          <span>{series.seasons} Temporadas</span>
                          <span>{series.episodes} Episódios</span>
                        </div>
                      </div>
                      
                      <div>
                        {series.isAvailable ? (
                          <Button className="w-full bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold" asChild>
                            <Link to="/between-heaven-hell" className="flex items-center justify-center space-x-2">
                              <Play className="w-4 h-4" />
                              <span>Assistir Agora</span>
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full border-xnema-border text-muted-foreground" disabled>
                            <span>Em Breve</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-20 bg-xnema-surface">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Mais Séries em Desenvolvimento
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Nossa equipe está trabalhando em mais conteúdo exclusivo. Fique atento às novidades!
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-background rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Novas Histórias</h3>
                  <p className="text-muted-foreground text-sm">Histórias originais sendo desenvolvidas por criadores brasileiros</p>
                </div>
                
                <div className="bg-background rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-xnema-purple to-xnema-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Elenco Nacional</h3>
                  <p className="text-muted-foreground text-sm">Valorizando talentos brasileiros em produções de qualidade internacional</p>
                </div>
                
                <div className="bg-background rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Alta Produção</h3>
                  <p className="text-muted-foreground text-sm">Qualidade cinematográfica em cada episódio produzido</p>
                </div>
              </div>
              
              <Button size="lg" className="bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold text-lg px-8 py-4" asChild>
                <Link to="/subscribe">
                  Assinar para Acessar Tudo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
