import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, Crown } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-xnema-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-xnema-orange to-xnema-purple rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">X</span>
          </div>
          <span className="text-2xl font-bold text-foreground">XNEMA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/catalog" className="text-foreground hover:text-xnema-orange transition-colors">
            Início
          </Link>
          <Link to="/between-heaven-hell" className="text-foreground hover:text-xnema-orange transition-colors flex items-center space-x-1">
            <span>Série</span>
            <div className="w-2 h-2 bg-xnema-orange rounded-full"></div>
          </Link>
          <Link to="/categories" className="text-foreground hover:text-xnema-orange transition-colors">
            Categorias
          </Link>
          <Link to="/pricing" className="text-foreground hover:text-xnema-orange transition-colors">
            Planos
          </Link>
          <Link to="/creators" className="text-foreground hover:text-xnema-orange transition-colors">
            Criadores
          </Link>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar filmes, séries..."
                className="pl-10 pr-4 py-2 w-64 bg-muted border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-xnema-orange"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/smart-dashboard" className="text-foreground hover:text-xnema-orange flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Minha Conta</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="text-foreground hover:text-xnema-orange">
                Entrar
              </Link>
            </Button>
            <Button size="sm" className="bg-xnema-orange hover:bg-xnema-orange/90 text-black font-medium" asChild>
              <Link to="/subscribe" className="flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Assinar</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-xnema-border bg-background/95 backdrop-blur">
          <nav className="flex flex-col space-y-4 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar filmes, séries..."
                className="pl-10 pr-4 py-2 w-full bg-muted border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-xnema-orange"
              />
            </div>
            <Link to="/catalog" className="text-foreground hover:text-xnema-orange transition-colors py-2">
              Início
            </Link>
            <Link to="/between-heaven-hell" className="text-foreground hover:text-xnema-orange transition-colors py-2 flex items-center space-x-2">
              <span>Série Exclusiva</span>
              <div className="w-2 h-2 bg-xnema-orange rounded-full"></div>
            </Link>
            <Link to="/categories" className="text-foreground hover:text-xnema-orange transition-colors py-2">
              Categorias
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-xnema-orange transition-colors py-2">
              Planos
            </Link>
            <Link to="/creators" className="text-foreground hover:text-xnema-orange transition-colors py-2">
              Criadores
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
