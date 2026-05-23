<template>
  <canvas ref="canvasRef" class="particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let animationId = null

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  const particles = []
  const PAW_COUNT = 14
  const DOT_COUNT = 25

  for (let i = 0; i < PAW_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 14 + Math.random() * 18,
      speed: 0.15 + Math.random() * 0.25,
      opacity: 0.04 + Math.random() * 0.06,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      type: 'paw',
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    })
  }

  const colors = ['#E8A87C', '#D4956A', '#FFD700', '#FFB5B5', '#C3A882']
  for (let i = 0; i < DOT_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 3 + Math.random() * 6,
      speed: 0.08 + Math.random() * 0.2,
      opacity: 0.05 + Math.random() * 0.08,
      rotation: 0,
      rotSpeed: 0,
      type: 'dot',
      drift: (Math.random() - 0.5) * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    })
  }

  const drawPaw = (x, y, size, rotation, opacity) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.globalAlpha = opacity
    ctx.fillStyle = '#E8A87C'

    ctx.beginPath()
    ctx.arc(0, size * 0.15, size * 0.35, 0, Math.PI * 2)
    ctx.fill()

    const toes = [
      [-size * 0.3, -size * 0.3],
      [-size * 0.1, -size * 0.48],
      [size * 0.1, -size * 0.48],
      [size * 0.3, -size * 0.3],
    ]
    toes.forEach(([tx, ty]) => {
      ctx.beginPath()
      ctx.arc(tx, ty, size * 0.14, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.y -= p.speed
      p.x += Math.sin(p.y * 0.008 + p.phase) * p.drift
      if (p.type === 'paw') p.rotation += p.rotSpeed

      if (p.y < -60) {
        p.y = canvas.height + 60
        p.x = Math.random() * canvas.width
      }
      if (p.x < -60) p.x = canvas.width + 60
      if (p.x > canvas.width + 60) p.x = -60

      if (p.type === 'paw') {
        drawPaw(p.x, p.y, p.size, p.rotation, p.opacity)
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()

  const handleMouseMove = (e) => {
    const mx = e.clientX
    const my = e.clientY
    particles.forEach(p => {
      const dx = p.x - mx
      const dy = p.y - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        p.x += dx * 0.03
        p.y += dy * 0.03
      }
    })
  }
  window.addEventListener('mousemove', handleMouseMove)

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', handleMouseMove)
  })
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}
</style>
