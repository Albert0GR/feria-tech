// src/pages/api/ticket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../supabaseClient';

// Define una interfaz para el ticket según la estructura de tu tabla
interface Ticket {
  id: number;
  parent_email: string;
  parent_name: string;
  child_name: string;
  ticket_id: string;
  created_at: string;
}

type Data = {
  message?: string;
  data?: Ticket[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { parentEmail, parentName, childName, ticketId } = req.body;
    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          parent_email: parentEmail,
          parent_name: parentName,
          child_name: childName,
          ticket_id: ticketId,
        },
      ])
      // Se agrega .select() para devolver los registros insertados
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res
      .status(200)
      .json({ message: "Ticket guardado exitosamente", data: data as Ticket[] });
  }
  return res.status(405).json({ error: "Método no permitido" });
}
