import { useEffect, useRef, useState } from 'react';
import { FileUp, Plus, Save, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import { Input, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { getEpkInfo, updateEpkInfo } from '@/lib/repositories/epk';
import { uploadImage } from '@/lib/repositories/gallery';
import { env } from '@/lib/config';
import type { EpkInfo, Member } from '@/types';

export default function EpkAdminPage() {
  const { push } = useToast();
  const riderRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [epk, setEpk] = useState<EpkInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEpkInfo().then(setEpk).catch(() => push('No pudimos cargar el EPK', 'error'));
  }, [push]);

  if (!epk) {
    return (
      <div>
        <AdminPageHeader title="EPK y contacto" />
        <p className="text-sm text-[var(--muted)]">Cargando…</p>
      </div>
    );
  }

  const set = <K extends keyof EpkInfo>(key: K, value: EpkInfo[K]) =>
    setEpk((current) => (current ? { ...current, [key]: value } : current));

  const setMember = (index: number, key: keyof Member, value: string) =>
    setEpk((current) => {
      if (!current) return current;
      const members = current.members.map((member, i) => (i === index ? { ...member, [key]: value } : member));
      return { ...current, members };
    });

  const addMember = () =>
    setEpk((current) =>
      current ? { ...current, members: [...current.members, { name: '', instrument: '' }] } : current
    );

  const removeMember = (index: number) =>
    setEpk((current) =>
      current ? { ...current, members: current.members.filter((_, i) => i !== index) } : current
    );

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateEpkInfo({
        bio: epk.bio,
        short_bio: epk.short_bio,
        members: epk.members.filter((m) => m.name.trim().length > 0),
        press_quotes: epk.press_quotes,
        press_photo_url: epk.press_photo_url,
        press_kit_url: epk.press_kit_url,
        rider_url: epk.rider_url,
        booking_name: epk.booking_name,
        booking_email: epk.booking_email,
        booking_phone: epk.booking_phone,
        press_name: epk.press_name,
        press_email: epk.press_email,
        press_phone: epk.press_phone,
        transfer_alias: epk.transfer_alias,
        transfer_cbu: epk.transfer_cbu,
        transfer_holder: epk.transfer_holder,
        transfer_bank: epk.transfer_bank,
        instagram_url: epk.instagram_url,
        spotify_url: epk.spotify_url,
        youtube_url: epk.youtube_url,
      });
      setEpk(updated);
      push('EPK guardado', 'success');
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos guardar el EPK', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRiderUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const { url } = await uploadImage(file, 'epk');
      set('rider_url', url);
      set('press_kit_url', url);
      push('Archivo subido. Guardá los cambios para aplicarlo.', 'success');
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos subir el archivo', 'error');
    }
  };

  const handlePhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const { url } = await uploadImage(file, 'epk');
      set('press_photo_url', url);
      push('Foto subida. Guardá los cambios para aplicarlo.', 'success');
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos subir la foto', 'error');
    }
  };

  return (
    <form onSubmit={handleSave}>
      <AdminPageHeader
        title="EPK y contacto"
        description="Textos, conformación, datos de booking y prensa, redes y los datos bancarios que ve el comprador en el checkout."
        action={
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        }
      />

      <div className="grid xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-8">
          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5 space-y-4">
            <h2 className="display text-lg font-bold text-[var(--paper)]">Biografía</h2>
            <Textarea
              label="Biografía oficial"
              value={epk.bio}
              onChange={(e) => set('bio', e.target.value)}
              className="min-h-[280px]"
              hint="Separá los párrafos con una línea en blanco."
            />
            <Textarea
              label="Bajada corta"
              value={epk.short_bio ?? ''}
              onChange={(e) => set('short_bio', e.target.value)}
            />
          </section>

          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="display text-lg font-bold text-[var(--paper)]">Conformación</h2>
              <Button type="button" variant="outline" size="sm" onClick={addMember}>
                <Plus className="h-3.5 w-3.5" /> Integrante
              </Button>
            </div>
            <div className="space-y-3">
              {epk.members.map((member, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      label="Nombre"
                      value={member.name}
                      onChange={(e) => setMember(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Instrumento"
                      value={member.instrument}
                      onChange={(e) => setMember(index, 'instrument', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="mb-1 p-2 border border-[var(--line-light)] hover:border-[var(--terracota)] hover:text-[var(--terracota)] transition-colors"
                    aria-label="Quitar integrante"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5 space-y-4">
            <h2 className="display text-lg font-bold text-[var(--paper)]">Redes</h2>
            <Input
              label="Instagram"
              value={epk.instagram_url ?? ''}
              onChange={(e) => set('instagram_url', e.target.value)}
            />
            <Input
              label="Spotify"
              value={epk.spotify_url ?? ''}
              onChange={(e) => set('spotify_url', e.target.value)}
            />
            <Input
              label="YouTube"
              value={epk.youtube_url ?? ''}
              onChange={(e) => set('youtube_url', e.target.value)}
            />
          </section>
        </div>

        <div className="xl:col-span-5 space-y-8">
          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5 space-y-4">
            <h2 className="display text-lg font-bold text-[var(--paper)]">Booking y prensa</h2>
            <Input
              label="Nombre"
              value={epk.booking_name ?? ''}
              onChange={(e) => set('booking_name', e.target.value)}
            />
            <Input
              label="Email de booking"
              type="email"
              value={epk.booking_email ?? ''}
              onChange={(e) => set('booking_email', e.target.value)}
            />
            <Input
              label="Teléfono de booking"
              value={epk.booking_phone ?? ''}
              onChange={(e) => set('booking_phone', e.target.value)}
            />
            <Input
              label="Email de prensa"
              type="email"
              value={epk.press_email ?? ''}
              onChange={(e) => set('press_email', e.target.value)}
            />
            <Input
              label="Teléfono de prensa"
              value={epk.press_phone ?? ''}
              onChange={(e) => set('press_phone', e.target.value)}
            />
            <p className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)] leading-relaxed">
              WhatsApp configurado en variables de entorno: {env.WHATSAPP_NUMBER}
            </p>
          </section>

          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5 space-y-4">
            <h2 className="display text-lg font-bold text-[var(--paper)]">Datos bancarios</h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Aparecen en el checkout y en la confirmación del pedido, junto al botón de WhatsApp.
            </p>
            <Input
              label="Alias de transferencia"
              value={epk.transfer_alias ?? ''}
              onChange={(e) => set('transfer_alias', e.target.value)}
              placeholder={env.ALIAS_TRANSFERENCIA}
            />
            <Input
              label="CBU"
              value={epk.transfer_cbu ?? ''}
              onChange={(e) => set('transfer_cbu', e.target.value)}
            />
            <Input
              label="Titular"
              value={epk.transfer_holder ?? ''}
              onChange={(e) => set('transfer_holder', e.target.value)}
            />
            <Input
              label="Banco"
              value={epk.transfer_bank ?? ''}
              onChange={(e) => set('transfer_bank', e.target.value)}
            />
          </section>

          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5 space-y-4">
            <h2 className="display text-lg font-bold text-[var(--paper)]">Archivos de prensa</h2>

            <div className="space-y-2">
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)]">Rider técnico (PDF)</p>
              <Input
                label="Link del rider"
                value={epk.rider_url ?? ''}
                onChange={(e) => set('rider_url', e.target.value)}
                placeholder="/demo/rider-suma-paciencia.pdf"
              />
              <input
                ref={riderRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleRiderUpload(e.target.files?.[0])}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => riderRef.current?.click()}>
                <FileUp className="h-3.5 w-3.5" /> Subir rider
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)]">Press kit (PDF)</p>
              <Input
                label="Link del press kit"
                value={epk.press_kit_url ?? ''}
                onChange={(e) => set('press_kit_url', e.target.value)}
              />
            </div>

            <div className="space-y-2 pt-2">
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)]">Foto de prensa</p>
              <Input
                label="Link de la foto"
                value={epk.press_photo_url ?? ''}
                onChange={(e) => set('press_photo_url', e.target.value)}
              />
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => photoRef.current?.click()}>
                <FileUp className="h-3.5 w-3.5" /> Subir foto
              </Button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
