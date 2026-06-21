// Slider
let currentSlide = 0
const slides = document.querySelectorAll(".slide")
const dots = document.querySelectorAll(".dot")

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index)
  })
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })
}

function changeSlide(direction) {
  currentSlide += direction
  if (currentSlide >= slides.length) currentSlide = 0
  if (currentSlide < 0) currentSlide = slides.length - 1
  showSlide(currentSlide)
}

function goToSlide(index) {
  currentSlide = index
  showSlide(currentSlide)
}

// Auto-advance slider
setInterval(() => {
  changeSlide(1)
}, 5000)

// Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu")
  menu.classList.toggle("active")
}

// Login Modal
function openLoginModal() {
  const modal = document.getElementById("loginModal")
  modal.classList.add("active")
  toggleMobileMenu()
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal")
  modal.classList.remove("active")
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("loginModal")
  if (event.target === modal) {
    closeLoginModal()
  }
}

// Login with Google
function loginWithGoogle() {
  alert("Integração com Google Auth será implementada. Por enquanto, esta é uma demonstração.")
  closeLoginModal()
}

// Handle Login Form
function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById("email").value
  alert(`Login realizado com sucesso para: ${email}`)
  closeLoginModal()
}
