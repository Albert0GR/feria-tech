// src/pages/map.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Link from "next/link";

export default function MapPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountRef.current) {
      // Crear la escena y definir el color de fondo
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb); // azul claro, como cielo
      
      // Configurar la cámara
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      
      // Configurar el renderizador
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Agregar luz ambiental para iluminar la escena
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      // Crear un plano que simule el suelo
      const planeGeometry = new THREE.PlaneGeometry(20, 20);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);

      // Crear el cuerpo de la casa (una caja)
      const houseGeometry = new THREE.BoxGeometry(2, 1.5, 2);
      const houseMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
      const houseBody = new THREE.Mesh(houseGeometry, houseMaterial);
      houseBody.position.y = 0.75; // eleva la caja para que se apoye sobre el plano
      scene.add(houseBody);

      // Crear el techo de la casa (una pirámide usando ConeGeometry con 4 segmentos)
      const roofGeometry = new THREE.ConeGeometry(1.5, 1, 4);
      const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 1.75; // ubica el techo sobre la parte superior de la caja
      roof.rotation.y = Math.PI / 4; // alinea el techo con los bordes de la caja
      scene.add(roof);

      // Posicionar la cámara para ver la casa
      camera.position.set(5, 5, 5);
      camera.lookAt(new THREE.Vector3(0, 1, 0));

      // Función de animación
      const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // Limpieza al desmontar el componente
      return () => {
        if (mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Mapa 3D - Feria Tech</h1>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "500px" }}
        className="border mb-4"
      />
      <Link href="/terms" className="text-blue-600">
        Continuar al Formulario
      </Link>
    </div>
  );
}
