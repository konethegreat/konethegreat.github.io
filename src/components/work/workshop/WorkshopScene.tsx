import * as THREE from "three"
import { useEffect, useRef } from "react"
import { stations, type StationId } from "@/data/work"

interface Props {
  active: StationId | null
  onSelect: (station: StationId) => void
}

const ACCENT: Record<StationId, "brass" | "copper" | "teal"> = {
  agents: "brass",
  retrieval: "copper",
  product: "teal",
  "local-first": "brass",
  cloud: "copper",
  quality: "teal",
}

const SPIN: Record<StationId, number> = {
  agents: 0.34,
  retrieval: 0.22,
  product: 0,
  "local-first": 0.42,
  cloud: 0.2,
  quality: 0.55,
}

const DUST_COUNT = 110

type Palette = Record<"brass" | "copper" | "teal", THREE.Color>

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement)
  const read = (token: string, fallback: string) =>
    new THREE.Color(styles.getPropertyValue(token).trim() || fallback)
  return {
    brass: read("--brass", "#d8a24a"),
    copper: read("--copper", "#c0653b"),
    teal: read("--teal", "#2f7a72"),
  }
}

interface Unit {
  id: StationId
  group: THREE.Group
  sculpture: THREE.Group
  baseX: number
  baseY: number
  phase: number
  spin: number
  oscillate: boolean
  hoverMaterials: THREE.MeshStandardMaterial[]
  paletteMaterials: THREE.MeshStandardMaterial[]
  ringMaterial: THREE.MeshStandardMaterial
}

export default function WorkshopScene({ active, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect

  useEffect(() => {
    const element = host.current
    if (!element) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 5.4, 7.4)
    camera.lookAt(0, 0.5, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    const canvas = renderer.domElement
    canvas.setAttribute("aria-hidden", "true")
    canvas.style.display = "block"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.touchAction = "none"
    element.appendChild(canvas)

    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const units: Unit[] = []
    const hits: THREE.Mesh[] = []

    const palette = readPalette()

    scene.add(new THREE.HemisphereLight(0xfff4de, 0x2a2520, 1.5))
    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(4, 8.5, 5)
    scene.add(key)
    const warm = new THREE.PointLight(palette.brass.getHex(), 22, 12, 2)
    warm.position.set(-4.5, 3.2, 2.5)
    scene.add(warm)
    const cool = new THREE.PointLight(palette.teal.getHex(), 16, 12, 2)
    cool.position.set(4.5, 2.6, -2.5)
    scene.add(cool)
    const overhead = new THREE.PointLight(0xfff1dc, 18, 16, 2)
    overhead.position.set(0, 7, 1.5)
    scene.add(overhead)

    const floorGeometry = new THREE.CircleGeometry(6.6, 96)
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0x1d1923,
      transparent: true,
      opacity: 0.96,
    })
    geometries.add(floorGeometry)
    materials.add(floorMaterial)
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.01
    scene.add(floor)

    const outerRingGeometry = new THREE.RingGeometry(5.2, 5.24, 128)
    const outerRingMaterial = new THREE.MeshBasicMaterial({
      color: palette.brass.clone(),
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
    })
    geometries.add(outerRingGeometry)
    materials.add(outerRingMaterial)
    const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial)
    outerRing.rotation.x = -Math.PI / 2
    outerRing.position.y = 0.005
    scene.add(outerRing)

    const innerRingGeometry = new THREE.RingGeometry(2.1, 2.13, 96)
    const innerRingMaterial = new THREE.MeshBasicMaterial({
      color: palette.teal.clone(),
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
    })
    geometries.add(innerRingGeometry)
    materials.add(innerRingMaterial)
    const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial)
    innerRing.rotation.x = -Math.PI / 2
    innerRing.position.y = 0.005
    scene.add(innerRing)

    const baseGeometry = new THREE.CylinderGeometry(0.62, 0.74, 0.22, 40)
    const plateGeometry = new THREE.CylinderGeometry(0.58, 0.62, 0.06, 40)
    const ringGeometry = new THREE.TorusGeometry(0.55, 0.018, 8, 48)
    const hitGeometry = new THREE.CylinderGeometry(0.95, 1.0, 2.3, 12)
    geometries.add(baseGeometry)
    geometries.add(plateGeometry)
    geometries.add(ringGeometry)
    geometries.add(hitGeometry)

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3442,
      roughness: 0.55,
      metalness: 0.32,
    })
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x46404f,
      roughness: 0.4,
      metalness: 0.4,
    })
    const hitMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    materials.add(baseMaterial)
    materials.add(plateMaterial)
    materials.add(hitMaterial)

    const addMesh = (
      parent: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      position: [number, number, number] = [0, 0, 0],
    ) => {
      geometries.add(geometry)
      materials.add(material)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...position)
      parent.add(mesh)
      return mesh
    }

    for (const station of stations) {
      const accent = palette[ACCENT[station.id]]
      const hoverMaterials: THREE.MeshStandardMaterial[] = []
      const paletteMaterials: THREE.MeshStandardMaterial[] = []

      const body = new THREE.Group()
      body.position.set(station.position[0], 0, station.position[2])

      addMesh(body, baseGeometry, baseMaterial, [0, 0.11, 0])
      addMesh(body, plateGeometry, plateMaterial, [0, 0.25, 0])

      const ringMaterial = new THREE.MeshStandardMaterial({
        color: accent.clone(),
        emissive: accent.clone(),
        emissiveIntensity: 0.35,
        roughness: 0.4,
        metalness: 0.3,
      })
      materials.add(ringMaterial)
      paletteMaterials.push(ringMaterial)
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.29
      body.add(ring)

      const sculpture = new THREE.Group()
      sculpture.position.y = 0.32
      body.add(sculpture)

      const metal = (intensity = 0.22) => {
        const material = new THREE.MeshStandardMaterial({
          color: accent.clone(),
          emissive: accent.clone(),
          emissiveIntensity: intensity,
          roughness: 0.3,
          metalness: 0.55,
        })
        hoverMaterials.push(material)
        paletteMaterials.push(material)
        return material
      }

      switch (station.id) {
        case "agents": {
          const sphere = new THREE.SphereGeometry(1, 28, 20)
          const small = addMesh(sculpture, sphere, metal(), [0, 0.18, 0])
          small.scale.setScalar(0.16)
          const mid = addMesh(sculpture, sphere, metal(), [0.2, 0.44, 0.03])
          mid.scale.setScalar(0.13)
          const top = addMesh(sculpture, sphere, metal(), [-0.17, 0.58, 0.08])
          top.scale.setScalar(0.1)
          break
        }
        case "retrieval": {
          const disc = new THREE.CylinderGeometry(0.31, 0.31, 0.05, 40)
          addMesh(sculpture, disc, metal(0.18), [0, 0.16, 0])
          addMesh(sculpture, disc, metal(0.26), [0.04, 0.3, -0.02])
          addMesh(sculpture, disc, metal(0.34), [-0.03, 0.44, 0.02])
          break
        }
        case "product": {
          const screenGroup = new THREE.Group()
          screenGroup.position.y = 0.44
          screenGroup.rotation.z = -0.12
          sculpture.add(screenGroup)
          const slab = new THREE.BoxGeometry(0.64, 0.44, 0.05)
          addMesh(screenGroup, slab, metal(0.16))
          const screen = new THREE.BoxGeometry(0.48, 0.3, 0.02)
          const screenMaterial = new THREE.MeshStandardMaterial({
            color: accent.clone(),
            emissive: accent.clone(),
            emissiveIntensity: 0.95,
            roughness: 0.25,
            metalness: 0.1,
          })
          paletteMaterials.push(screenMaterial)
          addMesh(screenGroup, screen, screenMaterial, [0, 0, 0.035])
          break
        }
        case "local-first": {
          const cube = new THREE.BoxGeometry(0.42, 0.42, 0.42)
          const wire = new THREE.MeshStandardMaterial({
            color: accent.clone(),
            emissive: accent.clone(),
            emissiveIntensity: 0.4,
            wireframe: true,
            transparent: true,
            opacity: 0.95,
          })
          hoverMaterials.push(wire)
          paletteMaterials.push(wire)
          const frame = addMesh(sculpture, cube, wire, [0, 0.56, 0])
          frame.rotation.set(0.22, 0.62, 0.08)
          const core = new THREE.SphereGeometry(0.07, 20, 14)
          addMesh(sculpture, core, metal(0.9), [0, 0.56, 0])
          break
        }
        case "cloud": {
          const shell = new THREE.IcosahedronGeometry(0.3, 0)
          addMesh(sculpture, shell, metal(0.34), [0, 0.56, 0]).rotation.set(0.15, 0.5, 0)
          const wireGeometry = new THREE.IcosahedronGeometry(0.34, 0)
          const wireMaterial = new THREE.MeshStandardMaterial({
            color: accent.clone(),
            emissive: accent.clone(),
            emissiveIntensity: 0.25,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
          })
          paletteMaterials.push(wireMaterial)
          addMesh(sculpture, wireGeometry, wireMaterial, [0, 0.56, 0]).rotation.set(0.15, 0.5, 0)
          break
        }
        case "quality": {
          const torus = new THREE.TorusGeometry(0.27, 0.09, 18, 48)
          const hoop = addMesh(sculpture, torus, metal(0.4), [0, 0.56, 0])
          hoop.rotation.set(0.42, 0.38, 0)
          break
        }
      }

      const hit = new THREE.Mesh(hitGeometry, hitMaterial)
      hit.position.y = 1.15
      hit.userData.station = station.id
      body.add(hit)
      hits.push(hit)

      scene.add(body)
      units.push({
        id: station.id,
        group: body,
        sculpture,
        baseX: station.position[0],
        baseY: sculpture.position.y,
        phase: units.length * 1.15,
        spin: SPIN[station.id],
        oscillate: station.id === "product",
        hoverMaterials,
        paletteMaterials,
        ringMaterial,
      })
    }

    const dustPositions = new Float32Array(DUST_COUNT * 3)
    const dustSpeeds = new Float32Array(DUST_COUNT)
    for (let i = 0; i < DUST_COUNT; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * 4.8
      dustPositions[i * 3] = Math.cos(angle) * radius
      dustPositions[i * 3 + 1] = Math.random() * 2.3
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius
      dustSpeeds[i] = 0.5 + Math.random()
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))
    const dustMaterial = new THREE.PointsMaterial({
      color: palette.brass.clone(),
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const dust = new THREE.Points(dustGeometry, dustMaterial)
    scene.add(dust)
    geometries.add(dustGeometry)
    materials.add(dustMaterial)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered: StationId | null = null
    let visible = true
    let needsRender = true
    let lastActive: StationId | null = activeRef.current

    const pointAt = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const pick = (): StationId | undefined => {
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(hits, false)[0]
      return hit?.object.userData.station as StationId | undefined
    }

    const onPointerMove = (event: PointerEvent) => {
      pointAt(event)
      const next = pick() ?? null
      canvas.style.cursor = next ? "pointer" : "default"
      if (next !== hovered) {
        hovered = next
        needsRender = true
      }
    }

    const onPointerLeave = () => {
      hovered = null
      canvas.style.cursor = "default"
      needsRender = true
    }

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return
      pointAt(event)
      const id = pick()
      if (id) selectRef.current(id)
    }

    const onThemeChange = () => {
      const next = readPalette()
      for (const unit of units) {
        const accent = next[ACCENT[unit.id]]
        for (const material of unit.paletteMaterials) {
          material.color.copy(accent)
          material.emissive.copy(accent)
        }
      }
      warm.color.copy(next.brass)
      cool.color.copy(next.teal)
      outerRingMaterial.color.copy(next.brass)
      innerRingMaterial.color.copy(next.teal)
      dustMaterial.color.copy(next.brass)
      needsRender = true
    }

    const onVisibility = () => {
      needsRender = true
    }

    const resize = () => {
      const width = element.clientWidth
      const height = element.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      const stretch = THREE.MathUtils.clamp(camera.aspect * 0.62, 1, 1.9)
      for (const unit of units) unit.group.position.x = unit.baseX * stretch
      needsRender = true
    }

    const clock = new THREE.Clock()
    let frame = 0

    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (!visible || document.hidden) return

      const delta = Math.min(clock.getDelta(), 0.1)
      const time = clock.elapsedTime
      const ambient = document.documentElement.dataset.fx !== "off"
      const current = activeRef.current
      if (current !== lastActive) {
        lastActive = current
        needsRender = true
      }

      let settling = false
      for (const unit of units) {
        const lit = unit.id === hovered || unit.id === current
        const targetScale = lit ? 1.08 : 1
        const scale = THREE.MathUtils.damp(unit.group.scale.x, targetScale, 14, delta)
        unit.group.scale.setScalar(scale)
        if (Math.abs(scale - targetScale) > 0.0008) settling = true

        if (ambient) {
          unit.sculpture.position.y = unit.baseY + Math.sin(time * 0.9 + unit.phase) * 0.028
          if (unit.oscillate) {
            unit.sculpture.rotation.y = Math.sin(time * 0.5 + unit.phase) * 0.42
          } else {
            unit.sculpture.rotation.y += delta * unit.spin
          }
        }

        const targetGlow =
          (lit ? 0.85 : 0.2) + (ambient ? Math.sin(time * 1.1 + unit.phase) * 0.06 : 0)
        for (const material of unit.hoverMaterials) {
          material.emissiveIntensity = THREE.MathUtils.damp(
            material.emissiveIntensity,
            targetGlow,
            12,
            delta,
          )
          if (Math.abs(material.emissiveIntensity - targetGlow) > 0.004) settling = true
        }

        const targetRing =
          (lit ? 1 : 0.35) + (ambient ? Math.sin(time * 1.4 + unit.phase) * 0.1 : 0)
        unit.ringMaterial.emissiveIntensity = THREE.MathUtils.damp(
          unit.ringMaterial.emissiveIntensity,
          targetRing,
          12,
          delta,
        )
        if (Math.abs(unit.ringMaterial.emissiveIntensity - targetRing) > 0.004) settling = true
      }

      warm.intensity = ambient ? 22 + Math.sin(time * 0.7) * 2.4 : 22
      cool.intensity = ambient ? 16 + Math.cos(time * 0.55) * 1.8 : 16

      if (ambient) {
        for (let i = 0; i < DUST_COUNT; i += 1) {
          const y = dustPositions[i * 3 + 1] + delta * 0.09 * dustSpeeds[i]
          dustPositions[i * 3 + 1] = y > 2.3 ? 0.02 : y
        }
        dustGeometry.attributes.position.needsUpdate = true
        dust.rotation.y += delta * 0.02
      }

      if (needsRender || settling || ambient) {
        renderer.render(scene, camera)
        needsRender = false
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
        needsRender = true
      },
      { threshold: 0.1 },
    )
    const themeObserver = new MutationObserver(onThemeChange)

    resizeObserver.observe(element)
    intersectionObserver.observe(element)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-fx"],
    })
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerleave", onPointerLeave)
    canvas.addEventListener("click", onClick)
    document.addEventListener("visibilitychange", onVisibility)

    resize()
    animate()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerleave", onPointerLeave)
      canvas.removeEventListener("click", onClick)
      document.removeEventListener("visibilitychange", onVisibility)
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }, [])

  return <div ref={host} className="h-[22rem] w-full sm:h-[26rem]" />
}
