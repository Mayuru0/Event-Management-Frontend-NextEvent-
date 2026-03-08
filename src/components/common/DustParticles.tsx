"use client"
import { useEffect, useRef } from "react"

interface Props {
  count?: number
  className?: string
}

export default function DustParticles({ count = 65, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const setSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setSize()

    const resizeObserver = new ResizeObserver(setSize)
    resizeObserver.observe(canvas)

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number; c: string }
    const palette = ["255,255,255", "3,218,198", "98,0,238", "176,176,210"]

    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.32 + 0.06),
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.42 + 0.04,
      da: (Math.random() - 0.5) * 0.003,
      c: palette[Math.floor(Math.random() * palette.length)],
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.a = Math.max(0.02, Math.min(0.52, p.a + p.da))
        p.vx += (Math.random() - 0.5) * 0.012

        if (p.y < -4) {
          p.y = canvas.height + 4
          p.x = Math.random() * canvas.width
        }
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},${p.a})`
        ctx.fill()
      }
      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-[1] ${className}`}
    />
  )
}
