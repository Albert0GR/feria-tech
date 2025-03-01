// src/pages/api/ticket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../supabaseClient';

type Data = {
  message?: string;
  data?: any;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { parentEmail, parentName, childName, ticketId } = req.body;
    const { data, error } = await supabase
      .from("tickets")
      .insert([{ parent_email: parentEmail, parent_name: parentName, child_name: childName, ticket_id: ticketId }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Ticket guardado exitosamente", data });
  }
  return res.status(405).json({ error: "Método no permitido" });
}
