import { useEffect, useRef, useState } from 'react'

function randomColor() {
  const color = Math.round(0xffffff * Math.random())
  return [color >> 16, (color >> 8) & 255, color & 255]
}

export function FireworksCanvas({ duration = 3000 }) {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    let width = window.innerWidth
    let height = window.innerHeight
    let frameId = null
    let fireworks = []
    let particles = []
    const startedAt = performance.now()

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    class Firework {
      constructor() {
        this.x = Math.random() * width
        this.y = height
        this.sx = Math.random() * 3 - 1.5
        this.sy = Math.random() * -3 - 3
        this.size = Math.random() * 2 + 1
        ;[this.r, this.g, this.b] = randomColor()
        this.shouldExplode = false
      }

      update() {
        this.shouldExplode = this.sy >= -2 || this.y <= 100 || this.x <= 0 || this.x >= width
        this.sy += 0.01
        this.x += this.sx
        this.y += this.sy
      }

      draw() {
        context.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    class Particle {
      constructor(x, y, r, g, b) {
        this.x = x
        this.y = y
        this.sx = Math.random() * 3 - 1.5
        this.sy = Math.random() * 3 - 1.5
        this.r = r
        this.g = g
        this.b = b
        this.size = Math.random() * 2 + 1
        this.life = 100
      }

      update() {
        this.x += this.sx
        this.y += this.sy
        this.life -= 1
      }

      draw() {
        context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.life / 100})`
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    function animate(now) {
      context.clearRect(0, 0, width, height)

      if (now - startedAt < duration && Math.random() < 0.25) fireworks.push(new Firework())

      for (let index = fireworks.length - 1; index >= 0; index -= 1) {
        const firework = fireworks[index]
        firework.update()
        firework.draw()
        if (firework.shouldExplode) {
          for (let particleIndex = 0; particleIndex < 50; particleIndex += 1) {
            particles.push(new Particle(firework.x, firework.y, firework.r, firework.g, firework.b))
          }
          fireworks.splice(index, 1)
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        particle.update()
        particle.draw()
        if (particle.life <= 0) particles.splice(index, 1)
      }

      if (now - startedAt < duration || fireworks.length > 0 || particles.length > 0) {
        frameId = requestAnimationFrame(animate)
      } else {
        frameId = null
        context.clearRect(0, 0, width, height)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    fireworks.push(new Firework())
    frameId = requestAnimationFrame(animate)
    const cleanupTimer = window.setTimeout(() => setVisible(false), duration + 1900)

    return () => {
      window.removeEventListener('resize', resize)
      window.clearTimeout(cleanupTimer)
      if (frameId !== null) cancelAnimationFrame(frameId)
      context.clearRect(0, 0, width, height)
      fireworks = []
      particles = []
    }
  }, [duration])

  return visible ? <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" /> : null
}
