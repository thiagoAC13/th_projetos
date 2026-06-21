import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain, Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Desbravadores</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aventura, comunidade e crescimento para adolescentes de 13 a 18 anos.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-foreground">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="text-muted-foreground hover:text-foreground">
                  Eventos DBV
                </Link>
              </li>
              <li>
                <Link href="/calendario" className="text-muted-foreground hover:text-foreground">
                  Calendário
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/galeria" className="text-muted-foreground hover:text-foreground">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-foreground">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Junte-se a nós</h3>
            <p className="text-sm text-muted-foreground">Pronto para começar sua aventura?</p>
            <Button asChild className="w-full">
              <Link href="/inscricao">Inscreva-se Agora</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clube de Desbravadores. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
