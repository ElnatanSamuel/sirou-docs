'use client'

import { useEffect, useRef } from 'react'

export function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    let animationId: number
    let time = 0

    const beams = Array.from({ length: 12 }, (_, i) => ({
      startX: (i / 12) * canvas.width,
      baseAngle: (Math.PI / 6) * (i - 6),
      speed: 0.5 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }))

    const drawBeams = () => {
      // Clear with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.016
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0)')
      gradient.addColorStop(0.4, 'rgba(6, 182, 212, 0.3)')
      gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.1)')
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)')

      beams.forEach((beam) => {
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.globalAlpha = 0.6

        // Create animated wave effect
        const waveOffset = Math.sin(time * beam.speed + beam.offset) * 0.15

        ctx.beginPath()
        ctx.moveTo(beam.startX, 0)

        // Draw curved beam using quadratic curve
        const endX = beam.startX + Math.tan(beam.baseAngle + waveOffset) * canvas.height
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()

        // Draw glow effect
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)'
        ctx.lineWidth = 8
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.moveTo(beam.startX, 0)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(drawBeams)
    }

    drawBeams()

    const handleResize = () => {
      updateCanvasSize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-20" />
}
