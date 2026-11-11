-- =====================================================================
--  SUMA PACIENCIA · Seed idempotente de demostración
--  Ejecutar después de supabase/schema.sql.
--  No crea usuarios de Authentication.
-- =====================================================================

-- ---------------------------------------------------------------------
-- SHOWS
-- ---------------------------------------------------------------------
insert into public.shows (id, show_date, city, venue, province, country, ticket_url, status, is_published)
values
  ('11111111-1111-4111-8111-000000000001', '2026-11-14T21:00:00-03:00', 'Concepción del Uruguay', 'Salón Comedor del Mercado', 'Entre Ríos', 'Argentina', null, 'available', true),
  ('11111111-1111-4111-8111-000000000002', '2026-11-22T20:00:00-03:00', 'Gualeguaychú', 'Ciclo Costa Reggae', 'Entre Ríos', 'Argentina', null, 'available', true),
  ('11111111-1111-4111-8111-000000000003', '2027-01-10T21:00:00-03:00', 'Paraná', 'Sala de Conciertos', 'Entre Ríos', 'Argentina', null, 'free', true),
  ('11111111-1111-4111-8111-000000000004', '2027-02-05T20:30:00-03:00', 'Rosario', 'Sala Astros', 'Santa Fe', 'Argentina', null, 'sold_out', true),
  ('11111111-1111-4111-8111-000000000005', '2027-03-20T21:00:00-03:00', 'CABA', 'Lisandro de la Torre', 'Buenos Aires', 'Argentina', 'https://example.com/entradas', 'available', true)
on conflict (id) do update set
  show_date = excluded.show_date,
  city = excluded.city,
  venue = excluded.venue,
  province = excluded.province,
  country = excluded.country,
  ticket_url = excluded.ticket_url,
  status = excluded.status,
  is_published = excluded.is_published,
  updated_at = now();

-- ---------------------------------------------------------------------
-- GALLERY
-- ---------------------------------------------------------------------
insert into public.gallery (id, title, category, image_url, storage_path, sort_order, is_published)
values
  ('22222222-2222-4222-8222-000000000001', 'Concierto en Concepción del Uruguay', 'vivo', '/demo/gallery/vivo-1.svg', null, 0, true),
  ('22222222-2222-4222-8222-000000000002', 'Backstage en Gualeguaychú', 'backstage', '/demo/gallery/backstage-1.svg', null, 1, true),
  ('22222222-2222-4222-8222-000000000003', 'Ensayo general', 'ensayo', '/demo/gallery/ensayo-1.svg', null, 2, true),
  ('22222222-2222-4222-8222-000000000004', 'Barra y sonido en vivo', 'vivo', '/demo/gallery/vivo-2.svg', null, 3, true),
  ('22222222-2222-4222-8222-000000000005', 'Fotografía de prensa', 'prensa', '/demo/gallery/prensa-1.svg', null, 4, true),
  ('22222222-2222-4222-8222-000000000006', 'Pista de audio', 'estudio', '/demo/gallery/estudio-1.svg', null, 5, true)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

-- ---------------------------------------------------------------------
-- EPK_INFO
-- ---------------------------------------------------------------------
insert into public.epk_info (
  id, bio, short_bio, members, press_quotes, press_photo_url, press_kit_url, rider_url,
  booking_name, booking_email, booking_phone, press_name, press_email, press_phone,
  transfer_alias, transfer_cbu, transfer_holder, transfer_bank,
  instagram_url, spotify_url, youtube_url
)
values (
  1,
  $bio$Suma Paciencia nació en 2009 en Concepción del Uruguay, Entre Ríos, y desde su primer recital —6 de junio de 2009— sostuvo un camino de crecimiento constante, autogestión y canciones propias. La banda está liderada por Pablo Glezer y encontró en el reggae su raíz, pero nunca se quedó quieta: soul, ska, fusion, rock y electrónica atraviesan su discografía.

El primer álbum homónimo (2016) se grabó en Salas Gallo y contó con Pablo Molina en “Celebra” y Hugo Lobo en “Depende de mí”. En 2018 llegaron a los estudios Romaphonic para registrar un EP en vivo, uno de los espacios de grabación más importantes de Latinoamérica. Desde entonces el sonido se abrió y la banda compartió escenarios con Los Cafres, Nonpalidece, Gondwana, Eruca Sativa, Kapanga, Riddim, Kameleba, Natty Combo y Alika y la Nueva Alianza, entre otros.

En 2026 publicaron “Todo queda acá”, un disco que expande su paleta sonora y confirma la madurez compositiva del grupo. El álbum reúne nueve canciones con colaboraciones de Néstor Ramljak (Nonpalidece) en “La Nueva Generación” y Ras Kuko en “Nos Subestiman”. La base de esta etapa se apoya en Pablo Glezer, Agustín Anselmino, Franco Traverso y Matías Gómez. “No me representan” concentra la mirada crítica y social de la banda, mientras que el amor, la celebración y los afectos aparecen en “Cosas Buenas”, “Claro que te extraño” y “Casual”.

Suma Paciencia funciona de forma autogestionada: su equipo técnico, el manager, la logística de las giras y el diseño de cada producto forman parte del trabajo cotidiano.$bio$,
  'Banda de reggae de Concepción del Uruguay, Entre Ríos, formada en 2009 y liderada por Pablo Glezer. En 2026 presenta “Todo queda acá”, un disco de nueve canciones que amplía su sonido con soul, electrónica y colaboraciones.',
  '[{"name":"Pablo Glezer","instrument":"voz y liderazgo"},{"name":"Agustín Anselmino","instrument":"saxo"},{"name":"Franco Traverso","instrument":"guitarra"},{"name":"Matías Gómez","instrument":"batería"}]'::jsonb,
  '[{"source":"La Mala","quote":"Un camino de 16 años: nunca dejaron de crecer y de tocar.","link":"https://lamalarevista.com.ar/articulo/suma-paciencia-un-camino-de-16-anos/"},{"source":"Indie Hoy","quote":"Suma Paciencia amplía su propuesta de reggae con cruces de soul.","link":"https://indiehoy.com/noticias/10-lanzamientos-para-escuchar-esta-semana-2026-10-26/"},{"source":"Reggae.es","quote":"Influenciados por el sonido jamaicano de los 70, fiddlearon un proyecto de canciones propias.","link":"http://www.reggae.es/2016/08/26/suma-paciencia-debuta-con-su-primer-album/"}]'::jsonb,
  '/demo/gallery/prensa-1.svg',
  '/demo/press-kit-suma-paciencia.pdf',
  '/demo/rider-suma-paciencia.pdf',
  'Booking Suma Paciencia', 'booking@sumapaciencia.com.ar', '+54 9 344 200 0000',
  'Prensa Suma Paciencia', 'prensa@sumapaciencia.com.ar', '+54 9 344 200 0000',
  'SUMA.PACIENCIA.MP', '0000000000000000000000', 'Suma Paciencia', 'Banco del Litoral',
  'https://www.instagram.com/sumapaciencia/', 'https://open.spotify.com/album/37LeAk80CuwFd9tViKaHys', 'https://www.youtube.com/@sumapaciencia'
)
on conflict (id) do update set
  bio = excluded.bio,
  short_bio = excluded.short_bio,
  members = excluded.members,
  press_quotes = excluded.press_quotes,
  press_photo_url = excluded.press_photo_url,
  press_kit_url = excluded.press_kit_url,
  rider_url = excluded.rider_url,
  booking_name = excluded.booking_name,
  booking_email = excluded.booking_email,
  booking_phone = excluded.booking_phone,
  press_name = excluded.press_name,
  press_email = excluded.press_email,
  press_phone = excluded.press_phone,
  transfer_alias = excluded.transfer_alias,
  transfer_cbu = excluded.transfer_cbu,
  transfer_holder = excluded.transfer_holder,
  transfer_bank = excluded.transfer_bank,
  instagram_url = excluded.instagram_url,
  spotify_url = excluded.spotify_url,
  youtube_url = excluded.youtube_url,
  updated_at = now();

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
insert into public.products (id, slug, name, description, category, price, images, is_active, sort_order)
values
  ('33333333-3333-4333-8333-000000000001', 'remera-todo-queda-aca', 'Remera Todo queda acá', 'Algodón peinado 24/1, serigrafía a una tinta en el frente y bordado chico en el pecho. Unisex, corte amplio.', 'indumentaria', 28000, '[{"url":"/demo/products/remera-tqca.svg","path":"/demo/products/remera-tqca.svg"}]'::jsonb, true, 0),
  ('33333333-3333-4333-8333-000000000002', 'remera-suma-paciencia', 'Remera Suma Paciencia', 'Modelo clásico color crema con el logo en serigrafía verde monte. Tela liviana para summer.', 'indumentaria', 22000, '[{"url":"/demo/products/remera-clasica.svg","path":"/demo/products/remera-clasica.svg"}]'::jsonb, true, 1),
  ('33333333-3333-4333-8333-000000000003', 'vinilo-todo-queda-aca', 'Vinilo Todo queda acá', 'LP 12" 180g en preventa. Incluye copia firmada por la banda.', 'discos', 42000, '[{"url":"/demo/products/vinilo.svg","path":"/demo/products/vinilo.svg"}]'::jsonb, true, 2),
  ('33333333-3333-4333-8333-000000000004', 'cd-todo-queda-aca', 'CD Todo queda acá', 'Compact disc del nuevo álbum, con booklet de 16 páginas.', 'discos', 18000, '[{"url":"/demo/products/cd.svg","path":"/demo/products/cd.svg"}]'::jsonb, true, 3),
  ('33333333-3333-4333-8333-000000000005', 'gorra-suma-paciencia', 'Gorra bordada', 'Gorra de cotton regulable con frontal bordado y logo lateral en tono sobre tono.', 'accesorios', 25000, '[{"url":"/demo/products/gorra.svg","path":"/demo/products/gorra.svg"}]'::jsonb, true, 4),
  ('33333333-3333-4333-8333-000000000006', 'mate-acero', 'Mate de acero', 'Mate de acero con envoltura de cuero y grabado del logo. El companion del playlist.', 'accesorios', 35000, '[{"url":"/demo/products/mate.svg","path":"/demo/products/mate.svg"}]'::jsonb, true, 5),
  ('33333333-3333-4333-8333-000000000007', 'stickers-todo-queda-aca', 'Pack stickers', 'Set de 5 stickers en vinilofosforescente con el arte del álbum.', 'accesorios', 8000, '[{"url":"/demo/products/stickers.svg","path":"/demo/products/stickers.svg"}]'::jsonb, true, 6)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price = excluded.price,
  images = excluded.images,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------
-- PRODUCT_VARIANTS
-- ---------------------------------------------------------------------
insert into public.product_variants (id, product_id, size, stock, sku)
values
  ('44444444-4444-4444-8444-000000000001', '33333333-3333-4333-8333-000000000001', 'S', 12, 'RQ-S'),
  ('44444444-4444-4444-8444-000000000002', '33333333-3333-4333-8333-000000000001', 'M', 24, 'RQ-M'),
  ('44444444-4444-4444-8444-000000000003', '33333333-3333-4333-8333-000000000001', 'L', 18, 'RQ-L'),
  ('44444444-4444-4444-8444-000000000004', '33333333-3333-4333-8333-000000000001', 'XL', 7, 'RQ-XL'),
  ('44444444-4444-4444-8444-000000000005', '33333333-3333-4333-8333-000000000001', 'XXL', 0, 'RQ-XXL'),
  ('44444444-4444-4444-8444-000000000006', '33333333-3333-4333-8333-000000000002', 'S', 8, 'RC-S'),
  ('44444444-4444-4444-8444-000000000007', '33333333-3333-4333-8333-000000000002', 'M', 16, 'RC-M'),
  ('44444444-4444-4444-8444-000000000008', '33333333-3333-4333-8333-000000000002', 'L', 11, 'RC-L'),
  ('44444444-4444-4444-8444-000000000009', '33333333-3333-4333-8333-000000000002', 'XL', 4, 'RC-XL'),
  ('44444444-4444-4444-8444-000000000010', '33333333-3333-4333-8333-000000000003', 'Único', 40, 'VIN-12'),
  ('44444444-4444-4444-8444-000000000011', '33333333-3333-4333-8333-000000000004', 'Único', 30, 'CD-TQ'),
  ('44444444-4444-4444-8444-000000000012', '33333333-3333-4333-8333-000000000005', 'Único', 14, 'GOR-01'),
  ('44444444-4444-4444-8444-000000000013', '33333333-3333-4333-8333-000000000006', 'Único', 9, 'MAT-01'),
  ('44444444-4444-4444-8444-000000000014', '33333333-3333-4333-8333-000000000007', 'Único', 25, 'STI-05')
on conflict (id) do update set
  product_id = excluded.product_id,
  size = excluded.size,
  stock = excluded.stock,
  sku = excluded.sku,
  updated_at = now();
