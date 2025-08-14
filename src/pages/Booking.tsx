import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { supabase } from '../integrations/supabase/client';
import { generateICS } from "@/lib/ics";

type Service = "Canguro tardes" | "Noches y fines de semana" | "Recogida del cole";

function roundToHalfHour(hours: number) {
  return Math.max(0.5, Math.round(hours * 2) / 2);
}

export default function Booking() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | "">("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [family, setFamily] = useState({ name: "", email: "", phone: "", address: "", nearMetro: true, notes: "" });

  const rate = family.nearMetro ? 10 : 12;
  const hours = useMemo(() => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    return roundToHalfHour(diff);
  }, [start, end]);
  const price = useMemo(() => (hours > 0 ? rate * hours : 0), [hours, rate]);

  return (
    <section className="py-10">
      <Helmet>
        <title>Reservas | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="Reserva en 3 pasos. Precio dinámico: 10€/h cerca del metro, 12€/h lejos del metro." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-6">Reservas</h1>

      <ol className="flex items-center gap-3 mb-6" aria-label="Progreso de reserva">
        {[1,2,3].map((n) => (
          <li key={n} className={`flex items-center gap-2 ${step===n?"text-primary":"text-muted-foreground"}`}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border">{n}</span>
            <span className="hidden sm:inline">{n===1?"Servicio":n===2?"Datos" : "Resumen"}</span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <form
          aria-label="Paso 1: Servicio y fecha"
          className="grid gap-3 max-w-xl"
          onSubmit={(e)=>{e.preventDefault(); setStep(2);}}
        >
          <label className="grid gap-1">
            <span>Servicio</span>
            <select required value={service} onChange={(e)=>setService(e.target.value as Service)} className="border rounded-md p-2">
              <option value="" disabled>Selecciona un servicio</option>
              <option>Canguro tardes</option>
              <option>Noches y fines de semana</option>
              <option>Recogida del cole</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span>Inicio</span>
            <input required type="datetime-local" value={start} onChange={(e)=>setStart(e.target.value)} className="border rounded-md p-2" />
          </label>
          <label className="grid gap-1">
            <span>Fin</span>
            <input required type="datetime-local" value={end} onChange={(e)=>setEnd(e.target.value)} className="border rounded-md p-2" />
          </label>
          <div className="text-sm text-muted-foreground">Las horas se redondean a 0,5 h</div>
          <div className="flex gap-3">
            <Button type="submit">Siguiente</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          aria-label="Paso 2: Datos de la familia"
          className="grid gap-3 max-w-xl"
          onSubmit={(e)=>{e.preventDefault(); setStep(3);}}
        >
          <label className="grid gap-1">
            <span>Nombre</span>
            <input required value={family.name} onChange={(e)=>setFamily({...family, name: e.target.value})} className="border rounded-md p-2" />
          </label>
          <label className="grid gap-1">
            <span>Email</span>
            <input required type="email" value={family.email} onChange={(e)=>setFamily({...family, email: e.target.value})} className="border rounded-md p-2" />
          </label>
          <label className="grid gap-1">
            <span>Teléfono</span>
            <input required value={family.phone} onChange={(e)=>setFamily({...family, phone: e.target.value})} className="border rounded-md p-2" />
          </label>
          <label className="grid gap-1">
            <span>Dirección</span>
            <input required value={family.address} onChange={(e)=>setFamily({...family, address: e.target.value})} className="border rounded-md p-2" />
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={family.nearMetro} onChange={(e)=>setFamily({...family, nearMetro: e.target.checked})} />
            <span>¿Cerca del metro?</span>
          </label>
          <label className="grid gap-1">
            <span>Información de los peques</span>
            <textarea value={family.notes} onChange={(e)=>setFamily({...family, notes: e.target.value})} className="border rounded-md p-2" placeholder="Edades, alergias, rutinas" />
          </label>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={()=>setStep(1)}>Atrás</Button>
            <Button type="submit">Siguiente</Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div aria-label="Paso 3: Resumen" className="grid gap-3 max-w-xl">
          <div className="border rounded-xl p-4">
            <h2 className="font-heading text-xl mb-2">Resumen de la reserva</h2>
            <ul className="text-sm grid gap-1">
              <li><strong>Servicio:</strong> {service}</li>
              <li><strong>Inicio:</strong> {start.replace('T',' ')}</li>
              <li><strong>Fin:</strong> {end.replace('T',' ')}</li>
              <li><strong>Horas estimadas:</strong> {hours.toFixed(1)} h</li>
              <li><strong>Tarifa aplicada:</strong> {rate} €/h</li>
              <li><strong>Precio estimado:</strong> {price.toFixed(2)} €</li>
              <li><strong>Zona:</strong> {family.nearMetro ? 'Cerca del metro' : 'Lejos del metro'}</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={()=>setStep(2)}>Atrás</Button>
            <Button
              onClick={async () => {
                const { data, error } = await supabase
                  .from('bookings')
                  .insert({
                    family_id: 'uuid-de-la-familia', // p.ej. auth.user().id
                    caregiver_id: 'uuid-de-la-cuidadora',
                    service_id: 'uuid-del-servicio', // no el nombre, el id real en la tabla services
                    start_at: start,
                    end_at: end,
                    is_near_metro: family.nearMetro,
                    hours,
                    rate_applied: rate,
                    price_estimated: price,
                    status: 'pending',
                    address: family.address,
                    notes: family.notes
                  });

                if (error) {
                  console.error('Error al crear la reserva:', error);
                } else {
                  alert('Reserva creada exitosamente');
                }
              }}
            >
              Confirmar y descargar .ics
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
