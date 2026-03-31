"use client"

import { useEffect, useRef, useState } from "react"
import { Wifi, Code, ShoppingBag, Search, Menu } from "lucide-react"
import { NeonNavigationButtons } from "@/components/neon-navigation-buttons"
import { ProductCard } from "@/components/product-card"
import { Jeans3DCarousel } from "@/components/jeans-3d-carousel"
import { CatalogModal } from "@/components/catalog-modal"
import { useCatalog } from "@/contexts/catalog-context"

interface CardData {
  icon: React.ReactNode
  title: string
  badge: string
}

const cards: CardData[] = [
  {
    icon: <Wifi className="w-12 h-12" />,
    title: "Wherever you go, the cursor follows",
    badge: "Pro",
  },
  {
    icon: <Code className="w-12 h-12" />,
    title: "One event listener powers it all",
    badge: "Pro",
  },
]

const jeanImages = [
  "/images/jean-skinny.jpeg",
  "/images/jean-c2.jpg",
  "/images/jean-c5.png",
  "/images/jean-c3.png",
  "/images/jean-c4.png",
  "/images/jean-c6.png",
]

const products = [
  {
    id: "1",
    name: "Jean Skinny Tiro Alto Premium",
    price: 89900,
    originalPrice: 119900,
    image: "/images/jean-skinny.jpeg",
    discount: 25,
    isPlaceholder: false,
  },
  { id: "2", name: "", price: 0, image: "", isPlaceholder: true },
  { id: "3", name: "", price: 0, image: "", isPlaceholder: true },
  { id: "4", name: "", price: 0, image: "", isPlaceholder: true },
  { id: "5", name: "", price: 0, image: "", isPlaceholder: true },
  { id: "6", name: "", price: 0, image: "", isPlaceholder: true },
]

// Scene 1: Gradient Border Effect with Green/Purple theme
function GradientScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateCardPositions = (clientX: number, clientY: number) => {
      const cards = container.querySelectorAll<HTMLElement>(".gradient-card")
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top
        card.style.setProperty("--mouse-x", `${x}px`)
        card.style.setProperty("--mouse-y", `${y}px`)
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsActive(true)
      updateCardPositions(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setIsActive(true)
        const touch = e.touches[0]
        updateCardPositions(touch.clientX, touch.clientY)
      }
    }

    const handleMouseLeave = () => setIsActive(false)
    const handleTouchEnd = () => setIsActive(false)

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">
        <span className="text-purple-400">Gradient</span>{" "}
        <span className="text-green-300">Border Effect</span>
      </h1>

      <div
        ref={containerRef}
        className="flex flex-wrap gap-8 justify-center items-center"
      >
        {cards.map((card, index) => (
          <article
            key={index}
            className="gradient-card relative w-[260px] aspect-[3/4] rounded-2xl cursor-pointer"
            style={
              {
                "--mouse-x": "130px",
                "--mouse-y": "170px",
              } as React.CSSProperties
            }
          >
            <div
              className="absolute -inset-[1px] rounded-2xl transition-opacity duration-300"
              style={{
                opacity: isActive ? 1 : 0,
                background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.3) 30%, transparent 60%)`,
              }}
            />

            <div
              className="absolute inset-0 rounded-2xl transition-opacity duration-300"
              style={{
                opacity: isActive ? 1 : 0.3,
                background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(134, 239, 172, 0.6), rgba(134, 239, 172, 0.1) 40%, transparent 70%)`,
                padding: "1px",
              }}
            />

            <div className="relative h-full w-full rounded-2xl bg-purple-950/95 backdrop-blur-md p-6 flex flex-col border border-purple-700/50">
              <span className="text-sm text-purple-300 mb-4">{card.badge}</span>
              <div className="flex-1 flex items-center justify-center text-green-300/80">
                <div className="relative">
                  {card.icon}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 blur-xl"
                    style={{
                      opacity: isActive ? 1 : 0,
                      background:
                        "radial-gradient(circle, rgba(168, 85, 247, 0.6), transparent)",
                    }}
                  />
                </div>
              </div>
              <p className="text-green-100 text-lg font-medium mb-4">{card.title}</p>
              <button className="w-full py-3 px-4 bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium border border-purple-600">
                Follow
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="text-purple-300 mt-8 text-sm">
        Mueve el cursor o toca las tarjetas para ver el efecto
      </p>
    </div>
  )
}

// Scene 2: Product Store with Catalog
function StoreScene() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const { images } = useCatalog()

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Store Header */}
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-purple-300">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 text-purple-700 md:hidden" />
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800">MODA</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-purple-700 hover:text-purple-900 font-medium">Inicio</a>
          <a href="#" className="text-purple-700 hover:text-purple-900 font-medium">Jeans</a>
          <a href="#" className="text-purple-700 hover:text-purple-900 font-medium">Ofertas</a>
          <a href="#" className="text-purple-700 hover:text-purple-900 font-medium">Contacto</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-purple-200 rounded-full">
            <Search className="w-5 h-5 text-purple-700" />
          </button>
          <button className="p-2 hover:bg-purple-200 rounded-full relative">
            <ShoppingBag className="w-5 h-5 text-purple-700" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-200 to-purple-300 border-2 border-purple-400 rounded-2xl p-8 md:p-12 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          Nueva Coleccion de Jeans
        </h2>
        <p className="text-purple-700 text-lg mb-6">
          Descubre nuestros jeans de alta calidad con los mejores precios
        </p>
        <button
          onClick={() => setIsCatalogOpen(true)}
          className="bg-purple-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-900 transition-colors relative"
        >
          Ver Catalogo
          {images.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              {images.length}
            </span>
          )}
        </button>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-purple-900 mb-6">Nuestros Productos</h3>
        
        {/* Main Display: Product Card + 3D Carousel */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12">
          {/* Jean Skinny Card */}
          <div className="w-full max-w-sm">
            <ProductCard {...products[0]} />
          </div>
          
          {/* 3D Jeans Carousel */}
          <div className="flex-shrink-0">
            <Jeans3DCarousel images={jeanImages} />
          </div>
        </div>

        {/* Other Product Slots */}
        <h4 className="text-xl font-semibold text-purple-900 mb-4">Mas Productos - Sube tus imagenes</h4>
        <p className="text-purple-600 mb-6">Haz clic en los espacios para subir imagenes. Estas se acumularan en el catalogo.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(1).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Catalog Modal */}
      <CatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </div>
  )
}

const SCENE_COUNT = 2

export default function HomePage() {
  const [currentScene, setCurrentScene] = useState(0)
  const [sweepClass, setSweepClass] = useState<string | null>(null)
  const [sceneKey, setSceneKey] = useState(0)
  const isAnimating = useRef(false)

  const bgClass = currentScene === 0
    ? "bg-gradient-to-br from-purple-950 via-purple-900 to-green-950"
    : "bg-green-100"

  const navigate = (direction: "next" | "prev") => {
    if (isAnimating.current) return
    isAnimating.current = true

    const cls = direction === "next" ? "neon-sweep-green" : "neon-sweep-red"
    setSweepClass(cls)

    setTimeout(() => {
      setCurrentScene((prev) =>
        direction === "next"
          ? (prev === SCENE_COUNT - 1 ? 0 : prev + 1)
          : (prev === 0 ? SCENE_COUNT - 1 : prev - 1)
      )
      setSceneKey((k) => k + 1)
    }, 320)

    setTimeout(() => {
      setSweepClass(null)
      isAnimating.current = false
    }, 700)
  }

  const handlePrevious = () => navigate("prev")
  const handleNext = () => navigate("next")

  const scenes = [
    <GradientScene key={sceneKey} />,
    <StoreScene key={sceneKey} />,
  ]

  return (
    <main className={`min-h-screen ${bgClass}`} style={{ transition: "background 0.4s" }}>
      {/* Neon Sweep Overlay */}
      {sweepClass && (
        <div
          className={`fixed inset-0 z-50 pointer-events-none ${sweepClass}`}
          style={{
            background: sweepClass === "neon-sweep-green"
              ? "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.18) 30%, rgba(0,255,136,0.55) 50%, rgba(0,255,136,0.18) 70%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, rgba(255,0,64,0.18) 30%, rgba(255,0,64,0.55) 50%, rgba(255,0,64,0.18) 70%, transparent 100%)",
          }}
        />
      )}

      <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8">
        {/* Scene Content */}
        <div className="scene-enter flex-1 flex items-center justify-center w-full py-8">
          {scenes[currentScene]}
        </div>

        {/* Navigation */}
        <div className="py-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 mb-2">
            {Array.from({ length: SCENE_COUNT }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentScene) navigate(index > currentScene ? "next" : "prev")
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentScene === index
                    ? "bg-purple-500 scale-125"
                    : currentScene === 0
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-purple-300 hover:bg-purple-400"
                }`}
              />
            ))}
          </div>
          <NeonNavigationButtons
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <div className="flex gap-8 mt-2">
            <span className={`text-sm font-medium ${currentScene === 0 ? "text-blue-400" : "text-blue-600"}`}>
              Retroceso
            </span>
            <span className={`text-sm font-medium ${currentScene === 0 ? "text-orange-400" : "text-orange-600"}`}>
              Avance
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
