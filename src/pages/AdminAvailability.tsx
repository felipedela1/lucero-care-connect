import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function pad(num: number) {
  return String(num).padStart(2, "0");
}

export default function AdminAvailability() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [availableHours, setAvailableHours] = useState<Set<number>>(new Set());
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveInfo, setSaveInfo] = useState<string | null>(null);
  const [monthAvailability, setMonthAvailability] = useState<Record<number,string>>({});
  const [monthLoading, setMonthLoading] = useState(false);

  // Cargar horas del día seleccionado
  useEffect(() => {
    const fetchDay = async () => {
      setAvailableHours(new Set());
      setSaveInfo(null);
      if (!selectedDay) return;
      const { data, error } = await supabase
        .from("admin_available_days")
        .select("hours")
        .eq("day", selectedDay)
        .eq("month", month + 1)
        .eq("year", year)
        .single();
      if (error) return;
      if (data?.hours) {
        const hoursSet = new Set(
          data.hours.split("-").map((h: string) => parseInt(h, 10))
        );
        setAvailableHours(hoursSet);
      }
    };
    fetchDay();
  }, [selectedDay, month, year]);

  const loadMonthAvailability = async () => {
    setMonthLoading(true);
    setMonthAvailability({});
    const { data, error } = await supabase
      .from("admin_available_days")
      .select("day,hours")
      .eq("month", month + 1)
      .eq("year", year);
    if (!error && data) {
      const map: Record<number,string> = {};
      data.forEach(r => { map[r.day] = r.hours; });
      setMonthAvailability(map);
    }
    setMonthLoading(false);
  };
  useEffect(() => { loadMonthAvailability(); }, [month, year]);

  const toggleHour = (hour: number) => {
    setAvailableHours(prev => {
      const next = new Set(prev);
      if (next.has(hour)) next.delete(hour); else next.add(hour);
      return next;
    });
  };

  const handleSaveDay = async () => {
    if (!selectedDay) return;
    setSaveBusy(true);
    setSaveInfo(null);
    try {
      const hoursArr = Array.from(availableHours).sort((a,b)=>a-b);
      const hoursStr = hoursArr.map(pad).join("-");
      if (!hoursStr) throw new Error("Selecciona al menos una hora.");
      const { data: existing, error: fetchError } = await supabase
        .from("admin_available_days")
        .select("hours")
        .eq("day", selectedDay)
        .eq("month", month + 1)
        .eq("year", year)
        .single();
      if (fetchError && fetchError.code !== "PGRST116") {
        setSaveInfo("Error al consultar: " + (fetchError.message || fetchError.details));
        return;
      }
      if (existing) {
        if (existing.hours === hoursStr) {
          setSaveInfo("No hay cambios.");
        } else {
          const { error: updateError } = await supabase
            .from("admin_available_days")
            .update({ hours: hoursStr })
            .eq("day", selectedDay)
            .eq("month", month + 1)
            .eq("year", year);
          if (updateError) setSaveInfo("Error al actualizar: " + (updateError.message || updateError.details));
          else {
            setSaveInfo(`Actualizado: Día ${pad(selectedDay)}/${pad(month+1)} Horas: ${hoursStr}`);
            await loadMonthAvailability();
          }
        }
      } else {
        const { error: insertError } = await supabase
          .from("admin_available_days")
          .insert({ day: selectedDay, month: month + 1, year, hours: hoursStr });
        if (insertError) setSaveInfo("Error al guardar: " + (insertError.message || insertError.details));
        else {
          setSaveInfo(`Guardado: Día ${pad(selectedDay)}/${pad(month+1)} Horas: ${hoursStr}`);
          await loadMonthAvailability();
        }
      }
    } catch (e: any) {
      setSaveInfo(e.message || String(e));
    } finally {
      setSaveBusy(false);
    }
  };

  const daysInMonth = getDaysInMonth(year, month);

  return (
    <section className="app-gradient-bg min-h-screen py-14 px-4 flex flex-col items-center w-full">
      <div className="w-full max-w-5xl grid gap-10">
        <header className="text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float">
            Disponibilidad (Admin)
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Gestiona los días y horas que estarán visibles para las reservas. Colores y estado en tiempo real.
          </p>
        </header>

        {/* Controles mes/año */}
        <div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg grid gap-6">
          <div className="flex flex-wrap gap-4 items-end justify-center">
            <label className="grid gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mes</span>
              <select
                value={month}
                onChange={e=>setMonth(Number(e.target.value))}
                className="input-modern !py-2 !px-3"
              >
                {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Año</span>
              <input
                type="number"
                value={year}
                min={now.getFullYear()-2}
                max={now.getFullYear()+2}
                onChange={e=>setYear(Number(e.target.value))}
                className="input-modern !py-2 !px-3 w-28"
              />
            </label>
            <div className="text-xs text-muted-foreground flex flex-col gap-1">
              <span><span className="inline-block w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mr-1" /> Día con horas</span>
              <span><span className="inline-block w-3 h-3 rounded-full bg-primary mr-1" /> Día seleccionado</span>
            </div>
          </div>

          {/* Calendario */}
          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({length: daysInMonth}, (_,i)=>i+1).map(day=>{
                const isSelected = selectedDay === day;
                const hasHours = !!monthAvailability[day];
                const cls = isSelected
                  ? "bg-primary text-white border-primary shadow"
                  : hasHours
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-500 shadow-sm"
                    : "bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-white/40 dark:border-white/10";
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={()=>setSelectedDay(day)}
                    className={`h-10 w-10 rounded-full text-sm font-semibold border backdrop-blur transition
                      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 ${cls}`}
                    title={hasHours ? `Horas: ${monthAvailability[day]}` : "Sin horas"}
                  >
                    {pad(day)}
                  </button>
                );
              })}
            </div>
            {monthLoading && <p className="text-xs text-muted-foreground">Cargando días…</p>}
            {selectedDay && (
              <div className="text-sm text-muted-foreground">
                Día seleccionado: <strong>{pad(selectedDay)}/{pad(month+1)}/{year}</strong>
              </div>
            )}
          </div>

          {/* Horas */}
          {selectedDay && (
            <div className="grid gap-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                Horas disponibles (clic para alternar)
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {Array.from({length:24}, (_,h)=>h).map(h=>{
                  const active = availableHours.has(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={()=>toggleHour(h)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border transition backdrop-blur
                        ${active
                          ? "bg-gradient-to-r from-primary to-accent text-white border-primary shadow"
                          : "bg-white/60 dark:bg-white/10 border-white/40 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-primary/10"
                        }`}
                      aria-pressed={active}
                    >
                      {pad(h)}:00
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                Total horas marcadas: <strong>{availableHours.size}</strong>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveDay}
                  disabled={saveBusy || !availableHours.size}
                  className="btn-gradient rounded-xl px-6 py-2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saveBusy ? "Guardando..." : "Guardar horarios"}
                </button>
              </div>
              {saveInfo && (
                <div className="text-xs mt-1 text-center text-muted-foreground">
                  {saveInfo}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-muted-foreground">
          Los cambios son visibles inmediatamente para usuarios en la página de reservas.
        </div>
      </div>
    </section>
  );
}
