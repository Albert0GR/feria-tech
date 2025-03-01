// src/pages/index.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Bienvenido, {session.user?.name}</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 mb-4"
        >
          Cerrar sesión
        </button>
        <br />
        <Link href="/map" className="text-blue-600">
          Ir al Mapa 3D
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Registro Feria Tech</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
