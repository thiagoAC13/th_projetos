import { SignupForm } from "@/components/signup-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
