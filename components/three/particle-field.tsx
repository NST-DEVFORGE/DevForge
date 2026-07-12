"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 130;
const LINK_DIST = 2.1;
const BOUNDS = { x: 11, y: 6.5 };

function accentColor(): THREE.Color {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--ac-400").trim();
    const [r, g, b] = raw.split(/\s+/).map(Number);
    return new THREE.Color(r / 255, g / 255, b / 255);
}

/**
 * Cursor-reactive particle network for the hero. Drifting points connect
 * to near neighbours; the pointer gently repels them. Colors track the
 * active theme via the --ac-400 variable; rendering pauses offscreen.
 */
export default function ParticleField() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 50);
        camera.position.z = 9;

        const positions = new Float32Array(COUNT * 3);
        const velocities = new Float32Array(COUNT * 2);
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2 * BOUNDS.x;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS.y;
            positions[i * 3 + 2] = 0;
            velocities[i * 2] = (Math.random() - 0.5) * 0.008;
            velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.008;
        }

        const pointsGeo = new THREE.BufferGeometry();
        pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const pointsMat = new THREE.PointsMaterial({
            color: accentColor(),
            size: 0.055,
            transparent: true,
            opacity: 0.85,
        });
        scene.add(new THREE.Points(pointsGeo, pointsMat));

        // worst-case segment buffer; drawRange trims per frame
        const maxLinks = COUNT * 8;
        const linePositions = new Float32Array(maxLinks * 6);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({ color: accentColor(), transparent: true, opacity: 0.14 });
        scene.add(new THREE.LineSegments(lineGeo, lineMat));

        const themeObserver = new MutationObserver(() => {
            const c = accentColor();
            pointsMat.color.copy(c);
            lineMat.color.copy(c);
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        const pointer = new THREE.Vector2(999, 999);
        const onPointer = (e: PointerEvent) => {
            const rect = mount.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            // unproject onto z=0 plane
            const half = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
            pointer.set(nx * half * camera.aspect, ny * half);
        };
        const onLeave = () => pointer.set(999, 999);
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerleave", onLeave);

        let visible = true;
        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        io.observe(mount);

        let raf = 0;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (!visible || document.hidden) return;

            for (let i = 0; i < COUNT; i++) {
                let px = positions[i * 3];
                let py = positions[i * 3 + 1];

                const dx = px - pointer.x;
                const dy = py - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 4 && d2 > 0.0001) {
                    const f = 0.012 / d2;
                    velocities[i * 2] += dx * f;
                    velocities[i * 2 + 1] += dy * f;
                }

                velocities[i * 2] *= 0.985;
                velocities[i * 2 + 1] *= 0.985;
                px += velocities[i * 2];
                py += velocities[i * 2 + 1];

                if (px > BOUNDS.x) px = -BOUNDS.x; else if (px < -BOUNDS.x) px = BOUNDS.x;
                if (py > BOUNDS.y) py = -BOUNDS.y; else if (py < -BOUNDS.y) py = BOUNDS.y;

                positions[i * 3] = px;
                positions[i * 3 + 1] = py;
            }
            pointsGeo.attributes.position.needsUpdate = true;

            let seg = 0;
            for (let i = 0; i < COUNT && seg < maxLinks; i++) {
                for (let j = i + 1; j < COUNT && seg < maxLinks; j++) {
                    const dx = positions[i * 3] - positions[j * 3];
                    const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                    if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
                        linePositions[seg * 6] = positions[i * 3];
                        linePositions[seg * 6 + 1] = positions[i * 3 + 1];
                        linePositions[seg * 6 + 2] = 0;
                        linePositions[seg * 6 + 3] = positions[j * 3];
                        linePositions[seg * 6 + 4] = positions[j * 3 + 1];
                        linePositions[seg * 6 + 5] = 0;
                        seg++;
                    }
                }
            }
            lineGeo.setDrawRange(0, seg * 2);
            lineGeo.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(tick);

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            themeObserver.disconnect();
            window.removeEventListener("pointermove", onPointer);
            window.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("resize", onResize);
            pointsGeo.dispose();
            lineGeo.dispose();
            pointsMat.dispose();
            lineMat.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
