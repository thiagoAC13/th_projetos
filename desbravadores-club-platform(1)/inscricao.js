function signupWithGoogle() {
  alert("Integração com Google Auth será implementada. Por enquanto, esta é uma demonstração.")
}

function handleSignup(event) {
  event.preventDefault()

  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!")
    return
  }

  const firstName = document.getElementById("firstName").value
  const email = document.getElementById("email").value

  alert(`Inscrição realizada com sucesso! Bem-vindo(a), ${firstName}!`)
  window.location.href = "index.html"
}
