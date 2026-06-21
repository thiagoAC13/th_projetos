"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome } from "lucide-react"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleGoogleSignup = () => {
    console.log("[v0] Google signup clicked")
    // Implementar autenticação com Google
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted", { name, email, password })
    // Implementar lógica de inscrição
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Inscreva-se</CardTitle>
              <CardDescription>Crie sua conta e junte-se ao clube de desbravadores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignup}>
                <Chrome className="mr-2 h-4 w-4" />
                Continuar com Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Criar Conta
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Faça login
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
