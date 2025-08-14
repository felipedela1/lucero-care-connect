import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Utilidad: tipo de Insert tipado por tabla
type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

function toHourISO(date: Date, hour: number): string {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function addHoursISO(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toInputDateValue(date: Date): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromInputDateValue(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date();
  dt.setFullYear(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export default function AdminAvailability() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [busy, setBusy] = useState(false);
  const [availableHours, setAvailableHours] = useState<Set<number>>(new Set());

  const fetchDaySlots = async (date: Date) => {
    setBusy(true);
    try {
      const startISO = startOfDay(date).toISOString();
      const end = new Date(startOfDay(date));
      end.setDate(end.getDate() + 1);
      const endISO = end.toISOString();

      const { data, error } = await supabase
        .from("availability_slots")
        .select("start_at, end_at")
        .gte("start_at", startISO)
        .lt("start_at", endISO)
        .eq("is_bookable", true);

      if (error) throw error;

      const hours = new Set<number>();
      for (const row of data ?? []) {
        const h = new Date(row.start_at).getHours();
        hours.add(h);
      }
      setAvailableHours(hours);
    } catch (e: unknown) {
      console.error("No se pudo cargar la disponibilidad:", e);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    fetchDaySlots(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const toggleHour = async (hour: number) => {
    if (busy) return;
    setBusy(true);
    try {
      const dayISO = toHourISO(selectedDate, hour);
      const nextISO = addHoursISO(dayISO, 1);

      if (availableHours.has(hour)) {
        const { error } = await supabase
          .from("availability_slots")
          .delete()
          .eq("start_at", dayISO);
        if (error) throw error;

        const updated = new Set(availableHours);
        updated.delete(hour);
        setAvailableHours(updated);
      } else {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) throw new Error("Debes iniciar sesión.");

        let caregiverId = import.meta.env.VITE_DEFAULT_CAREGIVER_ID as string | undefined;
        if (!caregiverId) caregiverId = auth.user.id;

        const newSlot: TablesInsert<"availability_slots"> = {
          caregiver_id: caregiverId,
          start_at: dayISO,
          end_at: nextISO,
          is_bookable: true,
        };

        const { error } = await supabase.from("availability_slots").insert(newSlot);
        if (error) throw error;

        const updated = new Set(availableHours);
        updated.add(hour);
        setAvailableHours(updated);
      }
    } catch (e: unknown) {
      console.error("No se pudo alternar la hora:", e);
      alert(e instanceof Error ? e.message : "No se pudo guardar el cambio.");
    } finally {
      setBusy(false);
    }
  };

  const HourButton = ({ h }: { h: number }) => {
    const enabled = availableHours.has(h);
    return (
      <button
        type="button"
        onClick={() => toggleHour(h)}
        className={`border rounded-md px-3 py-2 text-sm ${
          enabled ? "bg-green-100 border-green-400" : "bg-white border-gray-300"
        }`}
        aria-pressed={enabled}
      >
        {String(h).padStart(2, "0")}:00
      </button>
    );
  };

  return (
    <section className="p-4 grid gap-4">
      <header className="grid gap-2">
        <h1 className="font-heading text-2xl">Disponibilidad (Admin)</h1>
        <p className="text-sm text-muted-foreground">
          Activa/desactiva horas disponibles para reservas. Precisión: 1 hora (sin minutos).
        </p>
      </header>
      <div className="flex items-center gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Día</span>
          <input
            type="date"
            value={toInputDateValue(selectedDate)}
            onChange={e => setSelectedDate(fromInputDateValue(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          />
        </label>
      </div>
      <div className="grid grid-cols-6 gap-2 mt-4">
        {Array.from({ length: 24 }, (_, h) => (
          <HourButton key={h} h={h} />
        ))}
      </div>
    </section>
  );
}
