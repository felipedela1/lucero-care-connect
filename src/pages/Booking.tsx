import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type Service = "Canguro tardes" | "Noches y fines de semana" | "Recogida del cole";

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

function pad(n: number) {
  return String(n).padStart(2,"0");
}

function buildLocalDateTime(year:number, month:number, day:number, hour:number) {
  // month 0-based internally, convert to local ISO compatible string YYYY-MM-DDTHH:MM
  return `${year}-${pad(month+1)}-${pad(day)}T${pad(hour)}:00`;
}

export default function Booking() {
  // Paso del formulario
  const [step, setStep] = useState(1);

  // Selección servicio
  const [service, setService] = useState<Service | "">("");

  // Calendario / disponibilidad
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [monthAvailability, setMonthAvailability] = useState<Record<number,string>>({});
  const [monthLoading, setMonthLoading] = useState(false);

  // Horas del día
  const [availableHoursForDay, setAvailableHoursForDay] = useState<number[]>([]);
  const [bookedHours, setBookedHours] = useState<Set<number>>(new Set());
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());

  // Datos familia
  const [family, setFamily] = useState({ name:"", email:"", phone:"", address:"", nearMetro:true, notes:"" });

  // Mensaje de éxito en pantalla (reemplaza el alert)
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Precargar nombre/email desde profiles cuando se entra en el Step 2
  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = (userData as any)?.user;
        if (!user) return;
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name,email")
          .eq("id", user.id)
          .single();
        if (!cancelled && !error && profile) {
          setFamily(prev => ({
            ...prev,
            name: prev.name || profile.full_name || "",
            email: prev.email || profile.email || ""
          }));
        }
      } catch (e) {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, [step]);
  
  // Errores / info
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Derivados start/end según horas seleccionadas (se mantienen para mostrar rango)
  const start = useMemo(() => {
    if (!selectedDay || selectedHours.size === 0) return "";
    const sorted = Array.from(selectedHours).sort((a,b)=>a-b);
    return buildLocalDateTime(year, month, selectedDay, sorted[0]);
  }, [selectedHours, selectedDay, year, month]);

  const end = useMemo(() => {
    if (!selectedDay || selectedHours.size === 0) return "";
    const sorted = Array.from(selectedHours).sort((a,b)=>a-b);
    // Se mantiene como la hora siguiente a la última seleccionada (visual)
    return buildLocalDateTime(year, month, selectedDay, sorted[sorted.length - 1] + 1);
  }, [selectedHours, selectedDay, year, month]);

  // NUEVO: cálculo de horas reales seleccionadas (no intervalo continuo)
  const hours = useMemo(() => selectedHours.size, [selectedHours]);
  const rate = family.nearMetro ? 10 : 12;
  const price = useMemo(() => (hours > 0 ? rate * hours : 0), [hours, rate]);

  // Cargar disponibilidad mensual
  const loadMonthAvailability = async () => {
    setMonthLoading(true);
    setMonthAvailability({});
    const { data, error } = await supabase
      .from("admin_available_days")
      .select("day,hours")
      .eq("month", month + 1)
      .eq("year", year); // <-- AÑADIDO
    if (!error && data) {
      const map: Record<number,string> = {};
      data.forEach(r => { map[r.day] = r.hours; });
      setMonthAvailability(map);
    }
    setMonthLoading(false);
  };

  useEffect(() => {
    loadMonthAvailability();
    setSelectedDay(null);
    setAvailableHoursForDay([]);
    setSelectedHours(new Set());
    setBookedHours(new Set());
  }, [month, year]);

  // Cargar horas del día seleccionado
  useEffect(() => {
    if (!selectedDay) {
      setAvailableHoursForDay([]);
      setSelectedHours(new Set());
      setBookedHours(new Set());
      return;
    }
    const hoursStr = monthAvailability[selectedDay]; // ya filtrado por año
    if (!hoursStr) {
      setAvailableHoursForDay([]);
      setSelectedHours(new Set());
      setBookedHours(new Set());
      return;
    }
    // Horas definidas por admin
    const hoursArray = hoursStr.split("-").map(h => parseInt(h,10)).filter(h=>!Number.isNaN(h));
    setAvailableHoursForDay(hoursArray);
    setSelectedHours(new Set());
    // Cargar reservas que ocupan esas horas (simplificación: truncamos a horas)
    (async () => {
      const dayStart = new Date(year, month, selectedDay, 0,0,0);
      const dayEnd = new Date(year, month, selectedDay, 23,59,59);
      const isoStart = dayStart.toISOString();
      const isoEnd = dayEnd.toISOString();
      // Booking simple: traer las reservas que se solapan con ese día
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("start_at,end_at,status")
        .gte("start_at", isoStart)
        .lte("end_at", isoEnd);
      if (bookingsError || !bookings) {
        setBookedHours(new Set());
        return;
      }
      const taken = new Set<number>();
      bookings.forEach(b => {
        if (b.status === "cancelled") return;
        const s = new Date(b.start_at);
        const e = new Date(b.end_at);
        // Marcamos cada hora entera cubierta
        for (let h = s.getHours(); h < e.getHours(); h++) {
          taken.add(h);
        }
      });
      setBookedHours(taken);
    })();
  }, [selectedDay, monthAvailability, month, year]);

  // Seleccionar horas (solo entre las disponibles y no reservadas)
  const toggleHour = (h: number) => {
    if (!availableHoursForDay.includes(h)) return;
    if (bookedHours.has(h)) return;
    setSelectedHours(prev => {
      const next = new Set(prev);
      if (next.has(h)) next.delete(h); else next.add(h);
      return next;
    });
  };

  // Validación paso 1
  const canProceedStep1 =
    Boolean(service) &&
    selectedDay !== null &&
    selectedHours.size > 0;

  // UI del calendario
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Añadir función para ajustar admin_available_days tras crear la reserva
  const removeReservedFromAdminAvailability = async (day: number, monthIndex: number, yearNum: number, reserved: Set<number>) => {
    try {
      const { data: avail, error: availError } = await supabase
        .from("admin_available_days")
        .select("hours")
        .eq("day", day)
        .eq("month", monthIndex + 1)
        .eq("year", yearNum)
        .single();

      // Si no existe disponibilidad o error no crítico, no hacemos nada
      if (availError) {
        // PGRST116 = no rows (single() no encontró)
        if ((availError as any).code !== "PGRST116") {
          console.warn("Error consultando admin_available_days tras reserva:", availError);
        }
        return;
      }
      const existingArr: number[] = avail?.hours
        ? (avail.hours as string).split("-").map((h: string) => parseInt(h, 10)).filter(n => !Number.isNaN(n))
        : [];

      const remaining = existingArr.filter(h => !reserved.has(h));

      if (remaining.length === 0) {
        const { error: delError } = await supabase
          .from("admin_available_days")
          .delete()
          .eq("day", day)
          .eq("month", monthIndex + 1)
          .eq("year", yearNum);
        if (delError) console.warn("No se pudo eliminar admin_available_days tras reserva:", delError);
      } else {
        const hoursStr = remaining.map(h => pad(h)).join("-");
        const { error: updError } = await supabase
          .from("admin_available_days")
          .update({ hours: hoursStr })
          .eq("day", day)
          .eq("month", monthIndex + 1)
          .eq("year", yearNum);
        if (updError) console.warn("No se pudo actualizar admin_available_days tras reserva:", updError);
      }
    } catch (e) {
      console.warn("Error al ajustar admin_available_days tras reserva:", e);
    } finally {
      // refrescar disponibilidad en UI
      try { await loadMonthAvailability(); } catch (_) { /* ignore */ }
    }
  };

  // reemplazamos el inline onClick de "Confirmar" por la función:
  const handleConfirm = async () => {
    // derivar día si selectedDay es null (por si el calendario no lo mantuvo)
    const dayNum = selectedDay ?? (start ? new Date(start).getDate() : null);

    console.debug("handleConfirm:", { selectedDay, dayNum, selectedHours: Array.from(selectedHours) });

    if (dayNum === null || selectedHours.size === 0) {
      setError("Seleccione un día y al menos una hora antes de confirmar.");
      return;
    }

    // exige sesión (si tu tabla bookings requiere family_id)
    const { data: userData } = await supabase.auth.getUser();
    const user = (userData as any)?.user;
    if (!user) {
      setError("Debes iniciar sesión para confirmar la reserva.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // construir string de horas y contar horas reales
      const hoursStr = Array.from(selectedHours).sort((a,b)=>a-b).map(h => pad(h)).join("-");
      const hoursCount = selectedHours.size;

      const payload: any = {
        family_id: user.id,
        start_at: new Date(start).toISOString(),
        end_at: new Date(end).toISOString(),
        is_near_metro: family.nearMetro,
        hours: hoursStr,               // ahora texto: "02-04" / "01-03-05"
        rate_applied: rate,
        price_estimated: hoursCount * rate, // precio calculado con el recuento real
        status: "pending",
        address: family.address,
        notes: family.notes
      };

      const { error: insertError } = await supabase
        .from("bookings")
        .insert(payload);

      if (insertError) {
        setError(insertError.message || "Error al crear la reserva.");
        return;
      }

      // Actualizar disponibilidad admin (usar dayNum derivado)
      await removeReservedFromAdminAvailability(dayNum, month, year, selectedHours);

      // Mostrar mensaje de éxito en la propia pantalla (sin pop-up)
      const hoursList = Array.from(selectedHours).sort((a,b)=>a-b).map(h=>pad(h)+":00").join(", ");
      setSuccessInfo(`Reserva creada correctamente para ${pad(dayNum)}/${pad(month+1)}/${year}. Horas: ${hoursList}`);
      // reset parcial del formulario
      setStep(1);
      setService("");
      setSelectedHours(new Set());
      setSelectedDay(null);
      // opcional: limpiar bookedHours / availability ya hecho por loadMonthAvailability en removeReserved...
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="app-gradient-bg min-h-screen py-14 px-4 flex flex-col items-center w-full">
      <Helmet><title>Reservar</title></Helmet>
      <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float mb-8">
        Reservas
      </h1>

      {successInfo && (
        <div className="w-full max-w-4xl mb-6">
          <div className="glass-card rounded-xl p-4 border-green-300/40 bg-green-50/70 dark:bg-green-400/10 text-sm text-green-700 dark:text-green-300 flex items-start gap-3">
            <span className="text-lg leading-none">✅</span>
            <span>{successInfo}</span>
          </div>
        </div>
      )}

      <ol className="flex items-center gap-3 mb-10 w-full max-w-4xl justify-center" aria-label="Progreso de reserva">
        {[1,2,3].map(n => (
          <li key={n} className={`flex items-center gap-2 ${step===n ? "text-primary":"text-muted-foreground"}`}>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold
              ${step===n ? "bg-primary text-white border-primary shadow-md" : "bg-white/60 dark:bg-white/10 backdrop-blur border-white/40 dark:border-white/10"}`}>
              {n}
            </span>
            <span className="hidden sm:inline text-xs tracking-wide uppercase">
              {n===1?"Disponibilidad": n===2?"Datos":"Resumen"}
            </span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <form
          onSubmit={(e)=>{
            e.preventDefault();
            if (!canProceedStep1) {
              setError("Selecciona servicio, día y al menos una hora.");
              return;
            }
            setError(null);
            setStep(2);
          }}
          className="glass-card rounded-2xl p-6 md:p-8 grid gap-8 w-full max-w-4xl shadow-lg"
          aria-label="Paso 1: Selección disponibilidad"
        >
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <label className="flex items-center gap-2 text-sm">
              <span>Mes</span>
              <select
                value={month}
                onChange={e=>setMonth(Number(e.target.value))}
                className="input-modern !py-1 !px-2"
              >
                {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span>Año</span>
              <input
                type="number"
                className="input-modern w-24 !py-1 !px-2"
                value={year}
                min={now.getFullYear()-2}
                max={now.getFullYear()+2}
                onChange={e=>setYear(Number(e.target.value))}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span>Servicio</span>
              <select
                required
                value={service}
                onChange={e=>setService(e.target.value as Service)}
                className="input-modern !py-1 !px-2"
              >
                <option value="" disabled>Selecciona</option>
                <option>Canguro tardes</option>
                <option>Noches y fines de semana</option>
                <option>Recogida del cole</option>
              </select>
            </label>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({length: daysInMonth}, (_,i)=>i+1).map(day=>{
                const isSelected = selectedDay === day;
                const hasAvail = !!monthAvailability[day];
                const cls = isSelected
                  ? "bg-primary text-white border-primary shadow"
                  : hasAvail
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-500 shadow-sm"
                    : "bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-white/40 dark:border-white/10";
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!hasAvail}
                    onClick={()=>{ setSelectedDay(day); }}
                    className={`rounded-full h-10 w-10 flex items-center justify-center text-sm font-semibold border backdrop-blur
                      transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 ${cls}`}
                    title={hasAvail ? `Horas: ${monthAvailability[day]}` : "Sin disponibilidad"}
                  >
                    {pad(day)}
                  </button>
                );
              })}
            </div>
            {monthLoading && <p className="text-xs text-muted-foreground">Cargando…</p>}
            {selectedDay && (
              <div className="text-sm text-muted-foreground mb-2">
                Día seleccionado: <strong>{pad(selectedDay)}/{pad(month+1)}/{year}</strong>
              </div>
            )}
          </div>

          {selectedDay && availableHoursForDay.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {availableHoursForDay.map(h=>{
                const selected = selectedHours.has(h);
                const disabled = bookedHours.has(h);
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={disabled}
                    onClick={()=>toggleHour(h)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition border
                      backdrop-blur shadow-sm
                      ${
                        disabled
                          ? "bg-red-200/40 dark:bg-red-400/10 border-red-300/50 text-red-600 cursor-not-allowed line-through"
                          : selected
                            ? "bg-gradient-to-r from-primary to-accent text-white border-primary shadow"
                            : "bg-white/60 dark:bg-white/10 border-white/40 dark:border-white/10 hover:bg-primary/10"
                      }`}
                    title={disabled ? "Hora ya reservada" : selected ? "Quitar hora" : "Añadir hora"}
                  >
                    {pad(h)}:00
                  </button>
                );
              })}
            </div>
          )}

          {selectedHours.size > 0 && (
            <div className="text-sm mt-4 p-3 rounded-lg bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 backdrop-blur">
               Horas seleccionadas: <span className="font-medium">{Array.from(selectedHours).sort((a,b)=>a-b).map(h=>pad(h)+":00").join(", ")}</span>
               <br/>
               Inicio (primera): {start && start.replace("T"," ")} — Última: {end && end.replace("T"," ")}
               <br/>
               Total horas reales: <strong>{hours}</strong> h (Tarifa provisional: {rate} €/h → <strong>{(hours * rate).toFixed(2)} €</strong>)
             </div>
           )}

           {error && <div className="text-red-500 text-sm">{error}</div>}

           <div className="flex mt-4 justify-end">
            <Button
              type="submit"
              disabled={!canProceedStep1}
              className="btn-gradient rounded-xl px-6 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </Button>
           </div>
         </form>
       )}

       {step === 2 && (
         <form
           className="glass-card rounded-2xl p-6 md:p-8 grid gap-5 w-full max-w-4xl shadow-lg"
           aria-label="Paso 2: Datos familia"
           onSubmit={e=>{ e.preventDefault(); setStep(3); }}
         >
           <label className="grid gap-1">
             <span>Nombre</span>
            <input required value={family.name} onChange={e=>setFamily({...family,name:e.target.value})} className="input-modern" />
           </label>
           <label className="grid gap-1">
             <span>Email</span>
            <input required type="email" value={family.email} onChange={e=>setFamily({...family,email:e.target.value})} className="input-modern" />
           </label>
           <label className="grid gap-1">
             <span>Teléfono</span>
            <input required value={family.phone} onChange={e=>setFamily({...family,phone:e.target.value})} className="input-modern" />
           </label>
           <label className="grid gap-1">
             <span>Dirección</span>
            <input required value={family.address} onChange={e=>setFamily({...family,address:e.target.value})} className="input-modern" />
           </label>
           <label className="inline-flex items-center gap-2">
             <input type="checkbox" checked={family.nearMetro} onChange={e=>setFamily({...family,nearMetro:e.target.checked})}/>
             <span>¿Cerca del metro?</span>
           </label>
           <label className="grid gap-1">
             <span>Información de los peques</span>
            <textarea className="input-modern resize-none" rows={4} value={family.notes} onChange={e=>setFamily({...family,notes:e.target.value})} placeholder="Edades, alergias, rutinas" />
           </label>
           <div className="flex gap-3 justify-end mt-2">
             <Button type="button" variant="secondary" onClick={()=>setStep(1)} className="rounded-xl px-6">Atrás</Button>
             <Button type="submit" className="btn-gradient rounded-xl px-6">Siguiente</Button>
           </div>
         </form>
       )}

       {step === 3 && (
        <div className="grid gap-6 w-full max-w-4xl" aria-label="Paso 3: Resumen">
          <div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg">
            <h2 className="font-heading text-2xl mb-4 gradient-text">Resumen de la reserva</h2>
             <ul className="text-sm grid gap-1">
               <li><strong>Servicio:</strong> {service}</li>
               <li><strong>Día:</strong> {selectedDay && `${pad(selectedDay)}/${pad(month+1)}/${year}`}</li>
               <li><strong>Horas seleccionadas:</strong> {Array.from(selectedHours).sort((a,b)=>a-b).map(h=>pad(h)+":00").join(", ")}</li>
               <li><strong>Total horas:</strong> {hours}</li>
               <li><strong>Tarifa:</strong> {rate} €/h</li>
               <li><strong>Precio estimado:</strong> {(hours * rate).toFixed(2)} €</li>
               <li><strong>Zona:</strong> {family.nearMetro ? "Cerca del metro" : "Lejos del metro"}</li>
               <li><strong>Contacto:</strong> {family.name} — {family.email}</li>
             </ul>
           </div>
           <div className="flex gap-3">
            <Button variant="secondary" onClick={()=>setStep(2)} className="rounded-xl px-6">Atrás</Button>
            <Button
              disabled={saving}
              onClick={handleConfirm}
              className="btn-gradient rounded-xl px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : "Confirmar"}
            </Button>
           </div>
           {error && <div className="text-red-500 text-sm">{error}</div>}
         </div>
       )}
     </section>
   );
}
