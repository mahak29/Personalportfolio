import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import * as THREE from "three";

type ThreeSceneProps = {
  scrollProgress: MotionValue<number>;
  onStatusChange?: (status: "ready" | "unavailable") => void;
};

export function ThreeScene({ scrollProgress, onStatusChange }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const shouldDisable = window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches;
    if (shouldDisable) {
      onStatusChange?.("unavailable");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const canvas = document.createElement("canvas");
    const preferredAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      depth: true,
      powerPreference: "default",
    };

    let context: WebGL2RenderingContext | null = null;
    try {
      context = canvas.getContext("webgl2", preferredAttributes);
      if (!context) {
        context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: false,
          depth: true,
          powerPreference: "low-power",
        });
      }
    } catch {
      onStatusChange?.("unavailable");
      return;
    }

    if (!context) {
      onStatusChange?.("unavailable");
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        antialias: context.getContextAttributes()?.antialias ?? false,
        alpha: true,
      });
    } catch {
      onStatusChange?.("unavailable");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const frameGeometries: THREE.EdgesGeometry[] = [];
    const frameMaterials: THREE.LineBasicMaterial[] = [];
    const frameScales = [
      [2.7, 1.8, 1.1],
      [2.05, 2.5, 1.55],
      [1.35, 1.35, 2.25],
    ];
    const frames = frameScales.map(([x, y, z], index) => {
      const source = new THREE.BoxGeometry(x, y, z);
      const geometry = new THREE.EdgesGeometry(source);
      source.dispose();
      const material = new THREE.LineBasicMaterial({
        color: index === 1 ? 0xD4834A : 0xC9971C,
        transparent: true,
        opacity: 0.13 + index * 0.055,
      });
      const frame = new THREE.LineSegments(geometry, material);
      frame.rotation.set(index * 0.28, index * -0.34, index * 0.18);
      frameGeometries.push(geometry);
      frameMaterials.push(material);
      group.add(frame);
      return frame;
    });

    const coreGeo = new THREE.TetrahedronGeometry(0.82, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xF0C040,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    const axisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.6, 0, 0),
      new THREE.Vector3(2.6, 0, 0),
      new THREE.Vector3(0, -2.1, 0),
      new THREE.Vector3(0, 2.1, 0),
      new THREE.Vector3(0, 0, -2.1),
      new THREE.Vector3(0, 0, 2.1),
    ]);
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0xF0C040,
      transparent: true,
      opacity: 0.13,
    });
    group.add(new THREE.LineSegments(axisGeometry, axisMaterial));

    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index++) {
      positions[index * 3] = (Math.random() - 0.5) * 5.4;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 4.1;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 3.4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xF0C040,
      size: 0.025,
      transparent: true,
      opacity: 0.48,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    const onMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let time = 0;
    let visible = !document.hidden;
    let inViewport = true;
    const target = { x: 0, y: 0 };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!visible || !inViewport) return;

      time += 0.004;
      target.x += (mouse.current.y * 0.3 - target.x) * 0.04;
      target.y += (mouse.current.x * 0.5 - target.y) * 0.04;
      group.rotation.x = target.x * 0.55 + Math.sin(time * 0.35) * 0.04;
      group.rotation.y = target.y * 0.65 + time * 0.045;
      coreMesh.rotation.x = -time * 0.22;
      coreMesh.rotation.y = time * 0.3;
      frames[0].position.y = Math.sin(time * 0.9) * 0.08;
      frames[1].position.x = Math.cos(time * 0.7) * 0.1;
      frames[2].rotation.z = 0.36 + Math.sin(time * 0.55) * 0.12;
      particles.rotation.y = -time * 0.025;
      renderer.render(scene, camera);
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      onStatusChange?.("unavailable");
    };
    const onVisibilityChange = () => {
      visible = !document.hidden;
    };
    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );

    document.addEventListener("visibilitychange", onVisibilityChange);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    viewportObserver.observe(mount);
    renderer.render(scene, camera);
    onStatusChange?.("ready");
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      viewportObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      frameGeometries.forEach((geometry) => geometry.dispose());
      frameMaterials.forEach((material) => material.dispose());
      coreGeo.dispose();
      coreMat.dispose();
      axisGeometry.dispose();
      axisMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [onStatusChange]);

  useEffect(() => {
    const updateDepth = (progress: number) => {
      if (!groupRef.current) return;
      const scale = 1 - progress * 0.28;
      groupRef.current.scale.setScalar(Math.max(0.6, scale));
      groupRef.current.position.z = -progress * 1.2;
    };

    updateDepth(scrollProgress.get());
    return scrollProgress.on("change", updateDepth);
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
