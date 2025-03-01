// src/pages/terms.tsx
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "../supabaseClient";
import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Child {
  id: number;
  name: string;
  parent_email: string;
}

export default function Terms() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [childrenOptions, setChildrenOptions] = useState<Child[]>([]);
  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    childName: "",
    acceptTerms: false,
  });
  const [ticket, setTicket] = useState<string | null>(null);

  // Redirige si no hay sesión y, si existe, establece los valores por defecto
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      setFormData((prev) => ({
        ...prev,
        parentName: session.user?.name || "",
        parentEmail: session.user?.email || "",
      }));
    }
  }, [session, status, router]);

  // Busca los hijos asociados al correo del padre
  useEffect(() => {
    async function fetchChildren() {
      if (formData.parentEmail) {
        const { data, error } = await supabase
          .from("children")
          .select("*")
          .eq("parent_email", formData.parentEmail);
        if (error) {
          console.error("Error al obtener los hijos:", error);
        } else {
          setChildrenOptions(data as Child[]);
        }
      }
    }
    fetchChildren();
  }, [formData.parentEmail]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }
    // Genera un ID único para el ticket
    const ticketId = `${formData.parentEmail}-${Date.now()}`;
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parentEmail: formData.parentEmail,
        parentName: formData.parentName,
        childName: formData.childName,
        ticketId,
      }),
    });
    if (res.ok) {
      setTicket(ticketId);
    } else {
      alert("Error al guardar el ticket");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Formulario de Aceptación</h1>
      {ticket ? (
        <div>
          <h2 className="text-xl mb-2">Ticket generado: {ticket}</h2>
          <QRCode value={ticket} size={128} />
          <p className="mt-2">Este ticket ha sido guardado en la base de datos.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Nombre del padre:</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block">Correo del padre:</label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block">Selecciona a tu hijo:</label>
            <select
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            >
              <option value="">--Selecciona--</option>
              {childrenOptions.map((child) => (
                <option key={child.id} value={child.name}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
              />
              Acepto términos y condiciones.
            </label>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2">
            Generar Ticket
          </button>
        </form>
      )}
    </div>
  );
}
