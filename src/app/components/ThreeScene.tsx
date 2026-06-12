import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const shouldDisable = window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches;
    if (shouldDisable) return;

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
      return;
    }

    if (!context) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        antialias: context.getContextAttributes()?.antialias ?? false,
        alpha: true,
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Gold icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xC9971C, wireframe: true, transparent: true, opacity: 0.22 });
    group.add(new THREE.Mesh(icoGeo, icoMat));

    // Inner octahedron — bright gold
    const octGeo = new THREE.OctahedronGeometry(0.85, 0);
    const octMesh = new THREE.Mesh(octGeo, new THREE.MeshBasicMaterial({ color: 0xF0C040, wireframe: true, transparent: true, opacity: 0.3 }));
    group.add(octMesh);

    // Outer sphere shell
    const sphGeo = new THREE.SphereGeometry(2.1, 20, 14);
    const sphMat = new THREE.MeshBasicMaterial({ color: 0xC9971C, wireframe: true, transparent: true, opacity: 0.04 });
    group.add(new THREE.Mesh(sphGeo, sphMat));

    // Gold particles
    const N = 260;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.3 + Math.random() * 0.9;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0xF0C040, size: 0.022, transparent: true, opacity: 0.55 }));
    group.add(particles);

    // Copper ring
    const ringGeo = new THREE.TorusGeometry(1.9, 0.005, 2, 90);
    const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xD4834A, transparent: true, opacity: 0.4 }));
    ringMesh.rotation.x = Math.PI / 2.3;
    group.add(ringMesh);

    const onMM = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMM);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    let visible = !document.hidden;
    const tgt = { x: 0, y: 0 };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!visible) return;
      t += 0.004;
      tgt.x += (mouse.current.y * 0.3 - tgt.x) * 0.04;
      tgt.y += (mouse.current.x * 0.5 - tgt.y) * 0.04;
      group.rotation.x = tgt.x + t * 0.07;
      group.rotation.y = tgt.y + t * 0.11;
      octMesh.rotation.x = -t * 0.18;
      octMesh.rotation.z = t * 0.13;
      const pulse = 1 + Math.sin(t * 1.1) * 0.04;
      ringMesh.scale.set(pulse, pulse, pulse);
      particles.rotation.y = t * 0.045;
      renderer.render(scene, camera);
    };
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      octGeo.dispose();
      (octMesh.material as THREE.Material).dispose();
      sphGeo.dispose();
      sphMat.dispose();
      pgeo.dispose();
      particles.material.dispose();
      ringGeo.dispose();
      (ringMesh.material as THREE.Material).dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;
    const s = 1 - scrollProgress * 0.28;
    groupRef.current.scale.setScalar(Math.max(0.6, s));
    groupRef.current.position.z = -scrollProgress * 1.2;
  }, [scrollProgress]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}
