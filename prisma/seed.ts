import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const F = {
  rotary: [
    '100% Original, segel pabrik resmi distributor',
    'Teknologi rotary seimbang — getaran & suara rendah',
    'Oil ester premium khusus refrigerant modern',
    'Sudah termasuk baut karet anti-getas + gasket',
    'Uji 100% sebelum kirim oleh teknisi bersertifikat',
  ],
  scroll: [
    'Teknologi scroll — efisiensi energi maksimal untuk ruang komersial',
    'Desain semi-hermetik, awet operasi 24 jam nonstop',
    'Operasi halus, vibrasi minimal, ramah tenant',
    'Cocok untuk AC cassette, ducted, & VRV/VRF',
    'Garansi resmi distributor 1 tahun penuh',
  ],
  piston: [
    'Teknologi reciprocating semi-hermetic kelas industri',
    'Servis mudah: valve deck bisa dibongkar tanpa ganti unit',
    'Dibangun untuk kulkas ruangan, cold storage & freezing room',
    'Torsi awal besar, tahan beban berat terus-menerus',
    'Spare part valve & piston kit selalu ready',
  ],
  inverter: [
    'Kompresor inverter rotary — hemat listrik hingga 60%',
    'Rotasi variabel 12–120 Hz, suara sehalus bisikan (19 dB)',
    'Modul driver terintegrasi, kompatibel PCB inverter standar',
    'Mengurangi beban start — aman untuk listrik rumah',
    'Garansi resmi 1 tahun + garansi uang kembali 7 hari',
  ],
}

const main = async () => {
  // reset
  await db.quoteRequest.deleteMany()
  await db.product.deleteMany()
  await db.article.deleteMany()
  await db.testimonial.deleteMany()
  await db.faq.deleteMany()

  const sale = new Date(Date.now() + 1000 * 60 * 60 * 8) // flash sale 8 jam

  const p = (
    slug: string, name: string, brand: string, type: string, refrigerant: string,
    capacity: number, voltage: string, modelCode: string, category: string,
    price: number, oldPrice: number | null, stock: number, soldCount: number,
    rating: number, reviews: number, badge: string | null, warranty: string,
    image: string, compatible: string[], description: string,
    opts?: { featured?: boolean; sale?: boolean; tier?: Array<{ minQty: number; price: number }> }
  ) => ({
    slug, name, brand, type, refrigerant, capacity, voltage, modelCode, category,
    price, oldPrice, stock, soldCount, rating, reviews, badge, warranty, image,
    features: JSON.stringify(F[type.toLowerCase() as keyof typeof F] ?? F.rotary),
    compatible: JSON.stringify(compatible),
    tierPrices: JSON.stringify(opts?.tier ?? [
      { minQty: 1, price },
      { minQty: 3, price: Math.round(price * 0.96) },
      { minQty: 5, price: Math.round(price * 0.92) },
    ]),
    description,
    isFeatured: opts?.featured ?? false,
    saleEndsAt: opts?.sale ? sale : null,
  })

  const products = [
    // ==== ROTARY RESIDENTIAL ====
    p('daikin-jt90bcbby1l-1pk-r32', 'Kompresor AC Daikin Rotary JT90BCBY1L 1 PK R32', 'Daikin', 'ROTARY', 'R32', 1, '220V / 1 Fase', 'JT90BCBY1L', 'RESIDENTIAL', 1185000, 1450000, 42, 1284, 4.9, 214, 'Terlaris', 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Daikin FTV15AXV14 (1 PK)', 'Daikin FTV35AXV14 (1 PK)', 'Daikin SMV15AXV14', 'Daikin FTKQ15UVM4'],
      'Kompresor rotary legendaris Daikin untuk AC split 1 PK refrigerant R32. Suara super halus, efisiensi pendinginan maksimal, dan daya tahan yang sudah teruji puluhan tahun di iklim tropis Indonesia.', { featured: true }),
    p('daikin-jt125bcbby1l-15pk-r32', 'Kompresor AC Daikin Rotary JT125BCBY1L 1.5 PK R32', 'Daikin', 'ROTARY', 'R32', 1.5, '220V / 1 Fase', 'JT125BCBY1L', 'RESIDENTIAL', 1525000, 1790000, 31, 876, 4.9, 168, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Daikin FTV50AXV14 (1.5 PK)', 'Daikin FTKQ50UVM4', 'Daikin SMV50AXV14'],
      'Andalan teknisi untuk penggantian kompresor AC Daikin 1.5 PK. Rotasi stabil, konsumsi listrik hemat, langsung plug-and-play dengan pipa suction standar.', {}),
    p('daikin-jt212-2pk-r32', 'Kompresor AC Daikin Rotary JT212GAUY1L 2 PK R32', 'Daikin', 'ROTARY', 'R32', 2, '220V / 1 Fase', 'JT212GAUY1L', 'RESIDENTIAL', 2150000, 2490000, 18, 342, 4.8, 96, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Daikin FTV71AXV14 (2 PK)', 'Daikin FTKQ71UVM4', 'Daikin SMV71AXV14'],
      'Kompresor 2 PK R32 untuk ruangan besar dan ruang meeting. Pendinginan cepat, tahan dipakai seharian.', {}),
    p('panasonic-2v47w23101-1pk-r32', 'Kompresor AC Panasonic Rotary 2V47W23101 1 PK R32', 'Panasonic', 'ROTARY', 'R32', 1, '220V / 1 Fase', '2V47W23101', 'RESIDENTIAL', 1095000, 1320000, 57, 1105, 4.8, 189, 'Best Value', 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Panasonic CS-PU9YKW (1 PK)', 'Panasonic CS-XU9XKQ', 'Panasonic CS-C9PKH'],
      'Kompresor Panasonic seri Vegera & Standard Inverter 1 PK. Kualitas Jepang, harga bersahabat — favorit tukang AC se-Jabodetabek.', { featured: true }),
    p('panasonic-2ps104daa01-15pk-r32', 'Kompresor AC Panasonic Rotary 2PS104DAA01 1.5 PK R32', 'Panasonic', 'ROTARY', 'R32', 1.5, '220V / 1 Fase', '2PS104DAA01', 'RESIDENTIAL', 1420000, 1650000, 26, 521, 4.8, 112, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Panasonic CS-PU12YKW (1.5 PK)', 'Panasonic CS-XU12XKQ', 'Panasonic CS-C12PKH'],
      'Dingin cepat, listrik hemat. Pas untuk kamar ukuran besar, ruang tamu, dan kamar hotel 1.5 PK.', {}),
    p('lg-qk163hag-1pk-r32', 'Kompresor AC LG Rotary QK163HAG 1 PK R32', 'LG', 'ROTARY', 'R32', 1, '220V / 1 Fase', 'QK163HAG', 'RESIDENTIAL', 1050000, 1280000, 63, 964, 4.8, 176, 'Harga Juragan', 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['LG T09EV4 (1 PK)', 'LG T10EV4', 'LG T09IV4 Dual Inverter'],
      'Kompresor OEM LG untuk AC split 1 PK. Presisi tinggi, nyaris tanpa getaran — bawaan pabrik LG Electronics.', {}),
    p('lg-qk093lg-inverter-075pk-r32', 'Kompresor AC LG Inverter QK093LG 0.75 PK R32', 'LG', 'INVERTER', 'R32', 0.75, '220V / 1 Fase', 'QK093LG', 'RESIDENTIAL', 1340000, 1590000, 22, 289, 4.9, 87, 'Baru', 'Garansi Resmi 1 Tahun', '/images/product-inverter.png',
      ['LG T07IV4 Dual Inverter', 'LG T07EV4', 'LG T08IV4'],
      'Kompresor inverter Dual Inverter LG untuk kamar kecil. Hemat listrik hingga 60%, suara 19 dB seperti perpustakaan.', { featured: true }),
    p('gree-qx-b192j030-1pk-r32', 'Kompresor AC Gree Rotary QX-B192J030 1 PK R32', 'Gree', 'ROTARY', 'R32', 1, '220V / 1 Fase', 'QX-B192J030', 'RESIDENTIAL', 975000, 1190000, 48, 733, 4.7, 142, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Gree GP-09FIX (1 PK)', 'Gree GP-12FIX', 'Gree Pular 09'],
      'Produksi pabrik Gree Zhuhai — pabrik kompresor terbesar dunia. Kualitas OEM terbaik di kelas harga juragan.', {}),
    p('highly-shy33mc4u-1pk-r32', 'Kompresor AC Highly Rotary SHY33MC4-U 1 PK R32', 'Highly', 'ROTARY', 'R32', 1, '220V / 1 Fase', 'SHY33MC4-U', 'RESIDENTIAL', 985000, 1230000, 39, 418, 4.7, 98, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Sharp AH-A9UCYN (1 PK)', 'Midea MSAB-09CRDN1', 'AUX 09STD', 'Changhong 09SVC'],
      'Highly Shanghai — supplier kompresor OEM untuk puluhan merk dunia. Solusi cerdas pengganti kompresor multi-brand.', {}),
    p('mitsubishi-cb125p313-15pk-r22', 'Kompresor AC Mitsubishi Electric CB125P313 1.5 PK R22', 'Mitsubishi Electric', 'ROTARY', 'R22', 1.5, '220V / 1 Fase', 'CB125P313LUMC', 'RESIDENTIAL', 1650000, null, 12, 256, 4.9, 74, 'Klasik', 'Garansi Tukar 30 Hari', '/images/product-rotary.png',
      ['Mitsubishi SRK12CLS-S', 'Mitsubishi MS-GK12VA', 'AC lama R22 1.5 PK'],
      'Kompresor klasik R22 untuk unit lama Mitsubishi yang masih layak diselamatkan. Stok penutup — selama masih ada, AC lama kesayangan bisa hidup kembali.', { featured: true }),
    p('mitsubishi-cb205-2pk-r22', 'Kompresor AC Mitsubishi Electric CB205 2 PK R22', 'Mitsubishi Electric', 'ROTARY', 'R22', 2, '220V / 1 Fase', 'CB205LUMC', 'RESIDENTIAL', 2250000, null, 7, 143, 4.8, 51, 'Stok Terbatas', 'Garansi Tukar 30 Hari', '/images/product-rotary.png',
      ['Mitsubishi SRK18CLS-S', 'Mitsubishi MS-GK18VA', 'AC lama R22 2 PK'],
      'Andalan untuk proyek perbaikan AC R22 lama di gedung sekolah, kantor tua, dan ruko. Kualitas bantalan Mitsubishi terkenal tidak habis-habis.', {}),
    p('toshiba-ph240x1cs-1pk-r410a', 'Kompresor AC Toshiba Rotary PH240X1CS 1 PK R410A', 'Toshiba', 'ROTARY', 'R410A', 1, '220V / 1 Fase', 'PH240X1CS', 'RESIDENTIAL', 1230000, 1420000, 28, 312, 4.8, 89, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Toshiba RAS-H10QKSG-IND', 'Toshiba RAS-10J2AVG-IND'],
      'Kompresor R410A Toshiba — presisi Jepang dengan bantalan tahan aus. Pilihan aman untuk unit Toshiba 1 PK.', {}),
    p('sharp-ryd90-075pk-r32', 'Kompresor AC Sharp Rotary RYD90 0.75 PK R32', 'Sharp', 'ROTARY', 'R32', 0.75, '220V / 1 Fase', 'RYD90EQ-N', 'RESIDENTIAL', 940000, 1150000, 34, 267, 4.7, 78, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Sharp AH-A7UCYN (0.5 PK)', 'Sharp AH-A7SEC', 'Sharp 7TC-Y'],
      'Cocok untuk kamar kecil & kamar kost. Kompresor OEM Sharp dengan performa pendinginan konsisten.', {}),
    p('samsung-146dhag-15pk-r410a', 'Kompresor AC Samsung Rotary 146DHAG 1.5 PK R410A', 'Samsung', 'ROTARY', 'R410A', 1.5, '220V / 1 Fase', '146DHAGA1M', 'RESIDENTIAL', 1380000, 1600000, 21, 198, 4.7, 64, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Samsung AR12TRHGWKNTC', 'Samsung AR12JVFDGWKNTC Wind-Free'],
      'Kompresor Samsung Digital Inverter-ready — bisa jadi cadangan unit Wind-Free kamu.', {}),
    p('hitachi-thu33wc6u-1pk-r410a', 'Kompresor AC Hitachi Rotary THU33WC6-U 1 PK R410A', 'Hitachi', 'ROTARY', 'R410A', 1, '220V / 1 Fase', 'THU33WC6-U', 'RESIDENTIAL', 1290000, 1510000, 25, 231, 4.8, 71, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Hitachi RAK-10PPCD', 'Hitachi RAK-10PSC', 'Hitachi 1 PK R410A'],
      'Teknologi scroll-of-rotary khas Hitachi. Dinginnya dalam, listriknya irit.', {}),
    p('fujitsu-kb125-15pk-r32', 'Kompresor AC Fujitsu Rotary KB125 1.5 PK R32', 'Fujitsu General', 'ROTARY', 'R32', 1.5, '220V / 1 Fase', 'KB125FBBHT', 'RESIDENTIAL', 1475000, 1720000, 19, 187, 4.8, 66, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Fujitsu ASGG12CGTA', 'Fujitsu ASGG12LECA', 'Fujitsu 1.5 PK'],
      'Kompresor Fujitsu General — irit listrik kelas premium untuk rumah minimalis kamu.', {}),
    p('midea-pt154m1c8-15pk-r32', 'Kompresor AC Midea Rotary PT154M1C8 1.5 PK R32', 'Midea', 'ROTARY', 'R32', 1.5, '220V / 1 Fase', 'PT154M1C8', 'RESIDENTIAL', 1190000, 1390000, 44, 356, 4.6, 83, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Midea MSAGBU-12CRFN8', 'Midea MSMB-12CRN1', 'Toshiba TC12J2 (OEM Midea)'],
      'Produksi Midea Group — OEM resmi untuk banyak merk. Kompresor 1.5 PK dengan harga paling masuk akal.', {}),
    p('changhong-wk0911-05pk-r32', 'Kompresor AC Changhong Rotary WK0911 0.5 PK R32', 'Changhong', 'ROTARY', 'R32', 0.5, '220V / 1 Fase', 'WK0911QZFXF1', 'RESIDENTIAL', 820000, 990000, 36, 214, 4.6, 59, null, 'Garansi Resmi 1 Tahun', '/images/product-rotary.png',
      ['Changhong 07SVC', 'Changhong 09SVC', 'AC kecil 0.5 PK'],
      'Kompresor 0.5 PK paling ekonomis. Pahlawan untuk kamar kost sempit yang butuh dingin.', {}),
    p('sanyo-c-spr90-1pk-r22', 'Kompresor AC Sanyo Rotary C-SPR90 1 PK R22', 'Sanyo', 'ROTARY', 'R22', 1, '220V / 1 Fase', 'C-SPR90C58H', 'RESIDENTIAL', 1175000, null, 9, 128, 4.7, 47, 'Stok Terbatas', 'Garansi Tukar 30 Hari', '/images/product-rotary.png',
      ['Sanyo SAP-KC95GH', 'Sanyo ACS-09CP', 'AC lama R22 1 PK'],
      'Kompresor Sanyo R22 penyelamat unit lama. Sekali habis, selesai — amankan sekarang.', {}),

    // ==== INVERTER ====
    p('daikin-jt125ibv-15pk-inverter-r32', 'Kompresor AC Daikin Inverter JT125IBV 1.5 PK R32', 'Daikin', 'INVERTER', 'R32', 1.5, '220V / 1 Fase', 'JT125IBVBY1L', 'RESIDENTIAL', 1890000, 2190000, 17, 214, 4.9, 93, null, 'Garansi Resmi 1 Tahun', '/images/product-inverter.png',
      ['Daikin FTV50BXV14 Inverter', 'Daikin FTKM50UVM4', 'Daikin SMV50BXV16'],
      'Kompresor inverter Daikin Streamer series. PWM presisi tinggi, kompatibel PCB inverter Daikin generasi baru.', { featured: true }),
    p('panasonic-2ks184nba-1pk-inverter-r32', 'Kompresor AC Panasonic Inverter 2KS184NBA 1 PK R32', 'Panasonic', 'INVERTER', 'R32', 1, '220V / 1 Fase', '2KS184NBA3F4', 'RESIDENTIAL', 1560000, 1820000, 23, 178, 4.8, 76, null, 'Garansi Resmi 1 Tahun', '/images/product-inverter.png',
      ['Panasonic CS-XU9XKQ', 'Panasonic CS-PU9YKW Inverter', 'Panasonic nanoe-X 9'],
      'Seri KS terbaru Panasonic — rotasi 12-120 Hz super halus. Hemat listrik setara label 5 bintang.', {}),

    // ==== SCROLL LIGHT COMMERCIAL ====
    p('copeland-zp38k5e-3pk-scroll-r410a', 'Kompresor Copeland Scroll ZP38K5E-TFD 3 PK R410A', 'Copeland', 'SCROLL', 'R410A', 3, '220V / 1 Fase', 'ZP38K5E-TFD-522', 'LIGHT_COMMERCIAL', 4850000, 5490000, 14, 187, 4.9, 103, 'Terlaris', 'Garansi Resmi Distributor 1 Tahun', '/images/product-scroll.png',
      ['AC Cassette 3 PK', 'AC Ducted 3 PK', 'AC Standing Floor Commercial'],
      'Copeland (ex-Emerson) Scroll ZP series — standar dunia untuk AC komersial 3 PK. Efisiensi tinggi, operasi 24/7 tanpa drama.', { featured: true, tier: [{ minQty: 1, price: 4850000 }, { minQty: 3, price: 4610000 }, { minQty: 5, price: 4430000 }] }),
    p('copeland-zp61kce-5pk-scroll-r410a', 'Kompresor Copeland Scroll ZP61KCE-TFD 5 PK R410A', 'Copeland', 'SCROLL', 'R410A', 5, '380V / 3 Fase', 'ZP61KCE-TFD-933', 'LIGHT_COMMERCIAL', 7450000, 8290000, 8, 94, 4.9, 61, null, 'Garansi Resmi Distributor 1 Tahun', '/images/product-scroll.png',
      ['AC Cassette 5 PK', 'AC Ducted 5 PK', 'Rooftop Commercial'],
      'Workhorse ruang kuliah, resto, dan kantor open space. Scroll Copeland 5 PK siap bekerja keras bertahun-tahun.', { tier: [{ minQty: 1, price: 7450000 }, { minQty: 2, price: 7230000 }] }),
    p('copeland-zw61kwp-5pk-inverter-r410a', 'Kompresor Copeland Scroll Inverter ZW61KWP 5 PK R410A', 'Copeland', 'INVERTER', 'R410A', 5, '380V / 3 Fase', 'ZW61KWP-TFD-551', 'LIGHT_COMMERCIAL', 9800000, 11250000, 6, 47, 4.9, 38, 'Premium', 'Garansi Resmi Distributor 1 Tahun', '/images/product-inverter.png',
      ['VRV/VRF Komersial', 'Chiller Kecil', 'AC Ducted Inverter 5 PK'],
      'Scroll inverter Copeland ZW series — hemat energi hingga 30% untuk gedung komersial. Investasi yang balik modal dari tagihan listrik.', {}),
    p('danfoss-sh180a4abc-15pk-scroll-r410a', 'Kompresor Danfoss Scroll SH180A4ABC 15 PK R410A 380V', 'Danfoss', 'SCROLL', 'R410A', 15, '380V / 3 Fase', 'SH180A4ABC', 'INDUSTRIAL', 24500000, 27900000, 4, 31, 4.9, 22, 'Industrial', 'Garansi Resmi Distributor 1 Tahun', '/images/product-scroll.png',
      ['Sistem Chiller Industrial', 'Rooftop Packaged 15 PK', 'Cold Storage Medium'],
      'Danfoss SH series — tulang punggung pendinginan industri. Datasheet lengkap & pendampingan teknis Engineer-to-Order.', { tier: [{ minQty: 1, price: 24500000 }, { minQty: 2, price: 23800000 }] }),
    p('danfoss-sh140a4abc-12pk-scroll-r410a', 'Kompresor Danfoss Scroll SH140A4ABC 12 PK R410A 380V', 'Danfoss', 'SCROLL', 'R410A', 12, '380V / 3 Fase', 'SH140A4ABC', 'INDUSTRIAL', 19800000, null, 5, 27, 4.8, 19, 'Industrial', 'Garansi Resmi Distributor 1 Tahun', '/images/product-scroll.png',
      ['Chiller 12 PK', 'Packaged Unit Industri', 'Pendingin Ruang Server'],
      'Untuk ruang server dan fasilitas industri yang tidak boleh mati. Reliabilitas Danfoss teruji global.', {}),
    p('gmcc-wzb135x1-5pk-scroll-r410a', 'Kompresor GMCC Scroll WZB135X1 5 PK R410A', 'GMCC', 'SCROLL', 'R410A', 5, '380V / 3 Fase', 'WZB135X1DZ3', 'LIGHT_COMMERCIAL', 5650000, 6390000, 11, 76, 4.7, 42, 'Best Value', 'Garansi Resmi 1 Tahun', '/images/product-scroll.png',
      ['AC Cassette 5 PK OEM', 'AC Ducted 5 PK', 'Packaged Unit 5 PK'],
      'GMCC (Midea-Toshiba JV) — scroll 5 PK paling value-for-money untuk proyek tegangan 3 fase.', {}),

    // ==== PISTON / RECIPROCATING ====
    p('bitzer-4pc102-10pk-piston-r404a', 'Kompresor Bitzer 4PC-10.2 Semi-Hermetic 10 PK R404A', 'Bitzer', 'PISTON', 'R404A', 10, '380V / 3 Fase', '4PC-10.2', 'INDUSTRIAL', 32750000, 35900000, 3, 24, 5.0, 16, 'Industrial', 'Garansi Resmi Distributor 1 Tahun', '/images/product-piston.png',
      ['Cold Storage', 'Freezing Room -25°C', 'Kulkas Ruang Industri'],
      'Bitzer Jerman — raja kompresor cold storage. Valve deck bisa dibongkar untuk servis tanpa ganti unit.', { featured: true, tier: [{ minQty: 1, price: 32750000 }, { minQty: 2, price: 31800000 }] }),
    p('bitzer-2cc32-3pk-piston-r134a', 'Kompresor Bitzer 2CC-3.2 Semi-Hermetic 3 PK R134a', 'Bitzer', 'PISTON', 'R134a', 3, '380V / 3 Fase', '2CC-3.2Y-40P', 'INDUSTRIAL', 14950000, null, 5, 19, 4.9, 14, 'Industrial', 'Garansi Resmi Distributor 1 Tahun', '/images/product-piston.png',
      ['Showcase Chiller', 'Dispenser Minuman Industri', 'Cold Storage Kecil'],
      'Kompresor 2-silinder Bitzer untuk aplikasi chiller medium. Presisi Jerman untuk bisnis F&B kamu.', {}),
    p('kulthorn-ae4430y-2pk-piston-r134a', 'Kompresor Kulthorn AE4430Y 2 PK Piston R134a', 'Kulthorn Kirby', 'PISTON', 'R134a', 2, '220V / 1 Fase', 'AE4430Y-FZ1C', 'LIGHT_COMMERCIAL', 2950000, 3350000, 13, 87, 4.7, 39, null, 'Garansi Resmi 1 Tahun', '/images/product-piston.png',
      ['Freezer Horizontal 2 PK', 'Showcase Minuman', 'Ice Maker'],
      'Kulthorn Thailand — spesialis piston hermetic untuk bisnis es & frozen food. Harga terjangkau, umur panjang.', {}),
    p('tecumseh-cajt9513y-35pk-piston-r134a', 'Kompresor Tecumseh CAJT9513Y 3.5 PK Piston R134a', 'Tecumseh', 'PISTON', 'R134a', 3.5, '220V / 1 Fase', 'CAJT9513YHRH-FZ', 'LIGHT_COMMERCIAL', 4250000, 4790000, 9, 52, 4.7, 28, null, 'Garansi Resmi 1 Tahun', '/images/product-piston.png',
      ['Freezer Room 3.5 PK', 'Showcase Minuman Besar', 'Ice Cube Machine'],
      'Tecumseh — legenda kompresor piston dunia sejak 1934. Untuk usaha es & minuman dingin yang serius.', {}),
  ]

  for (const prod of products) {
    await db.product.create({ data: prod })
  }

  const articles = [
    {
      slug: 'cara-memilih-kompresor-ac-yang-tepat-panduan-lengkap',
      title: 'Cara Memilih Kompresor AC yang Tepat: Panduan Lengkap 2025',
      excerpt: 'Salah pilih kompresor = boncos listrik + dingin tidak maksimal. Ini panduan memilih kompresor AC berdasarkan PK, refrigerant, dan teknologi yang benar.',
      category: 'Panduan Membeli', readTime: 8,
      content: 'Kompresor adalah jantungnya AC. Kalau jantung salah pasang, seluruh sistem ikut kacau — listrik boros, ruangan tidak dingin, bahkan kompresor baru bisa langsung jebol dalam hitungan bulan.\n\n1. Sesuaikan kapasitas PK dengan kebutuhan ruangan\nRule of thumb: 1 m² butuh sekitar 550 BTU. Jadi ruangan 12 m² cukup 0.5 PK (7.000 BTU), ruangan 18 m² cukup 1 PK (9.000 BTU), dan ruangan 24 m² butuh 1.5 PK. Jangan memaksakan PK kecil untuk ruang besar — kompresor akan bekerja terus tanpa henti dan cepat rusak.\n\n2. Cocokkan refrigerant-nya\nKompresor R32 tidak bisa dipakai di unit R410A dan sebaliknya. Cek label indoor unit atau buku manual AC kamu. Untuk unit lama yang masih R22, pilih kompresor R22 asli atau konsultasikan konversi ke teknisi — salah freon bisa merusak kompresor dalam hitungan hari.\n\n3. Pahami teknologinya: Rotary vs Scroll vs Piston\n- Rotary: standar AC split rumahan 0.5-2 PK. Hemat, senyap, murah perawatan.\n- Scroll: untuk AC komersial 3-15 PK (cassette, ducted, rooftop). Efisiensi tinggi untuk operasi lama.\n- Piston/Reciprocating: untuk cold storage dan industri. Torsi besar, mudah diservis.\n\n4. Pastikan original dan bergaransi\nKompresor KW atau refurbish tanpa garansi adalah bom waktu. Kompresor original punya nomor seri yang bisa dicek ke distributor resmi. Di Juragan Kompresor, setiap unit disegel + diberi garansi resmi 1 tahun.\n\n5. Perhatikan voltase & fase\nAC rumah pakai 220V 1 fase. AC komersial 5 PK ke atas biasanya 380V 3 fase. Salah beli = kompresor tidak bisa menyala.\n\nKesimpulan: pilih berdasarkan PK, cocokkan refrigerant, pahami teknologinya, dan beli dari penjual yang memberi garansi jelas. Gunakan Kalkulator PK gratis di Juragan Kompresor untuk menghitung kebutuhan ruanganmu secara akurat.',
    },
    {
      slug: 'r32-vs-r410a-vs-r22-mana-yang-paling-hemat-listrik',
      title: 'R32 vs R410A vs R22: Mana Kompresor yang Paling Hemat Listrik?',
      excerpt: 'Refrigerant menentukan efisiensi kompresor. Kami bedah tiga refrigerant populer di Indonesia dan hitung real cost-nya per tahun.',
      category: 'Edukasi Teknis', readTime: 6,
      content: 'Refrigerant (freon) adalah darah sistem AC, dan kompresor adalah pompanya. Memilih kompresor dengan refrigerant yang tepat bisa menghemat ratusan ribu rupiah per bulan.\n\nR22 (Freon klasik)\nGenerasi lama, masih dipakai jutaan unit AC lama di Indonesia. Kekurangan: menghancurkan lapisan ozon dan mulai langka (fase-out global). Efisiensi terendah dari ketiganya.\n\nR410A (generasi transisi)\nLebih ramah lingkungan, tekanan kerja lebih tinggi, pendinginan lebih cepat. Masih mengandung GWP (Global Warming Potential) yang cukup tinggi sehingga juga mulai difase-out.\n\nR32 (generasi terkini)\nPemenangnya untuk rumah tangga: GWP hanya sepertiga R410A, kapasitas pendinginan lebih tinggi ±5-10%, dan lebih hemat listrik. Hampir semua AC baru 2020 ke atas memakai R32.\n\nHitungan kasar per tahun (AC 1 PK, pemakaian 8 jam/hari):\n- Kompresor R22: ±Rp 4.1 juta/tahun\n- Kompresor R410A: ±Rp 3.7 juta/tahun\n- Kompresor R32: ±Rp 3.2 juta/tahun\n\nCatatan penting: selalu gunakan refrigerant sesuai spesifikasi kompresor. Kompresor R32 yang diisi R410A bisa overheat dan jebol. Ragu? Chat Tanya Juragan (AI) di kanan bawah — gratis, 24 jam.',
    },
    {
      slug: '7-tanda-kompresor-ac-rusak-dan-cara-mengatasinya',
      title: '7 Tanda Kompresor AC Rusak dan Cara Mengatasinya',
      excerpt: 'AC tidak dingin belum tentu butuh freon. Kenali 7 gejala kompresor rusak sebelum kehabisan waktu untuk menyelamatkannya.',
      category: 'Perawatan', readTime: 7,
      content: 'Kompresor rusak biasanya memberi peringatan dini. Sayangnya banyak orang baru sadar saat AC sudah benar-benar mati. Kenali 7 tanda berikut:\n\n1. AC menyala tapi tidak dingin — kompresor berputar tanpa menghasilkan tekanan, atau refrigerant habis karena kebocoran.\n\n2. MCB sering jatuh saat AC menyala — arus start melonjak karena gulungan motor kompresor mulai lemah/short. Ini tanda bahaya paling sering diabaikan.\n\n3. Suara berisik, gemuruh, atau bergetar hebat — bearing aus, piston/scroll rusak, atau baut karet miring.\n\n4. outdoor unit panas luar biasa tapi tidak ada angin panas dari kondensor — sirkulasi refrigerant terhambat.\n\n5. Timbul bau gosong di outdoor unit — gulungan motor mulai terbakar. MATIKAN listrik segera.\n\n6. Pipa suction berembun parah atau membeku — kompresor menyedot terlalu keras karena refrigerant kurang atau filter kotor.\n\n7. Umur AC sudah 6-10 tahun dan performa menurun drastis — kompresor memang punya batas umur kerja.\n\nApa yang harus dilakukan?\nJangan panik dan jangan asal isi freon! Gunakan fitur Diagnosa Kompresor di Juragan Kompresor: centang gejala yang muncul, sistem AI akan menganalisis penyebabnya dan merekomendasikan kompresor pengganti yang cocok. Teknisi kami siap konfirmasi via WhatsApp sebelum kamu mengeluarkan uang.',
    },
    {
      slug: 'rotary-vs-scroll-vs-piston-beda-teknologi-kompresor',
      title: 'Rotary vs Scroll vs Piston: Beda Teknologi Kompresor AC yang Wajib Kamu Tahu',
      excerpt: 'Tiga teknologi kompresor, tiga dunia berbeda. Pahami cara kerja, kelebihan, dan aplikasi yang tepat agar tidak salah beli.',
      category: 'Edukasi Teknis', readTime: 6,
      content: 'Semua kompresor punya tugas yang sama: memampatkan refrigerant. Tapi cara kerjanya berbeda, dan perbedaan itu menentukan harga, ketahanan, dan penggunaannya.\n\nKompresor Rotary\nCara kerja: silinder berputar (roller) menekan refrigerant di dalam ruang kompresi kecil. Sederhana, ringan, murah.\nCocok untuk: AC split rumahan 0.5-2 PK. Merek umum: Daikin JT, Panasonic, LG QK, GMCC, Highly.\nKelebihan: senyap, hemat, gampang diganti. Kekurangan: tidak untuk beban komersial 24 jam.\n\nKompresor Scroll\nCara kerja: dua cakram spiral (scroll tetap + scroll bergerak) menguncian refrigerant ke tengah. Halus, efisien, minim getaran.\nCocok untuk: AC komersial 3-15 PK. Merek umum: Copeland ZP, Danfoss SH, GMCC WZB.\nKelebihan: efisiensi tinggi untuk operasi panjang, tahan lama. Kekurangan: lebih mahal, servis harus lewat teknisi khusus.\n\nKompresor Piston (Reciprocating)\nCara kerja: piston bergerak naik-turun seperti mesin mobil, memampatkan refrigerant di silinder. Sangat kuat.\nCocok untuk: cold storage, freezer room, industri. Merek umum: Bitzer, Kulthorn, Tecumseh.\nKelebihan: torsi besar, bisa dibongkar-servis per komponen. Kekurangan: paling berisik, butuh perawatan rutin.\n\nCheat sheet: kamar → rotary. Ruang meeting/resto → scroll. Bisnis es/frozen food → piston. Masih ragu? Fitur Cek Kompatibilitas dan AI Tanya Juragan siap membantu.',
    },
    {
      slug: 'panduan-ganti-kompresor-ac-biaya-tips-rekomendasi',
      title: 'Panduan Ganti Kompresor AC: Biaya, Tips & Rekomendasi Teknisi 2025',
      excerpt: 'Berapa biaya ganti kompresor AC? Kapan sebaiknya ganti unit? Semua pertanyaan dijawab dengan angka nyata.',
      category: 'Panduan Membeli', readTime: 9,
      content: 'Kompresor jebol bukan akhir dunia — dan biasanya masih jauh lebih murah daripada ganti AC baru. Ini panduan lengkapnya.\n\nBerapa biaya ganti kompresor AC?\n- AC 0.5-1 PK: kompresor Rp 800 ribu - 1.3 juta + jasa pasang Rp 350-500 ribu\n- AC 1.5-2 PK: kompresor Rp 1.2 - 2.4 juta + jasa Rp 450-650 ribu\n- AC 3-5 PK (scroll): kompresor Rp 4.5 - 7.5 juta + jasa Rp 800 ribu - 1.5 juta\n- Cold storage/industrial: custom, hubungi tim B2B kami untuk penawaran\n\nKapan ganti kompresor, kapan ganti unit?\nGanti kompresor kalau: unit AC lain (PCB, kipas, evaporator) masih sehat, AC umur di bawah 8 tahun, atau AC adalah unit premium/inverter.\nPertimbangkan ganti unit kalau: AC sudah 10+ tahun, nilai perbaikan lebih dari 50% harga unit baru, atau AC lama masih refrigerant R22 yang mahal perawatannya.\n\nTips biar tidak boncos:\n1. Selalu minta teknisi mengecek sebab kegagalan kompresor lama (kontaminasi, kebocoran, PCB) sebelum pasang yang baru — penyebabnya tidak diatasi, kompresor baru pun akan jebol.\n2. Wajib ganti drier/filter dan vacuum pump sebelum pengisian refrigerant. Ini yang paling sering dilewati teknisi nakal.\n3. Beli kompresor yang memberi garansi tertulis dan segel resmi.\n4. Minta sisa potongan pipa & freon lama dikembalikan sebagai bukti pengerjaan.\n\nDi Juragan Kompresor, setiap pembelian kompresor dapat konsultasi teknis gratis via WhatsApp dengan teknisi berpengalaman 15+ tahun. Kamu juga bisa pakai fitur Minta Penawaran untuk harga grosir teknisi.',
    },
    {
      slug: 'cara-merawat-kompresor-ac-agar-awet-10-tahun',
      title: 'Cara Merawat Kompresor AC Agar Awet 10 Tahun (Checklist Teknisi)',
      excerpt: 'Kompresor bisa awet 10-15 tahun kalau dirawat benar. Copy checklist perawatan dari 46 dewan pakar pendinginan kami.',
      category: 'Perawatan', readTime: 5,
      content: 'Kompresor AC bukan barang murah — makanya rawat sebaik mungkin. Ini checklist dari para teknisi senior kami:\n\n1. Cuci AC rutin 3 bulan sekali. Evaporator kotor membuat kompresor bekerja lebih keras dan overheat.\n\n2. Jangan set suhu terlalu rendah terus-menerus. 24-25°C adalah titik manis: dingin cukup, kompresor tidak kerja rodi.\n\n3. Cek tekanan freon setahun sekali. Freon kurang = kompresor menyedot panas berlebih = overheat. Freon berlebih = tekanan tinggi = juga merusak.\n\n4. Pastikan outdoor unit berventilasi. Kompresor yang dipeluk dinding/tertutup gorden adalah pembunuhan lambat.\n\n5. Gunakan stabilizer atau inverter-safe MCB. Lonjakan listrik PLN adalah musuh nomor satu kompresor.\n\n6. Jangan ON-OFF terus-menerus. Setelah mati, tunggu 3-5 menit sebelum menyala lagi (proteksi delay start).\n\n7. Dengerin suara. Gemuruh, dentum logam, atau getaran baru = segera panggil teknisi. Cepat terdeteksi = murah perbaikannya.\n\nBonus: kalau AC sudah umur 5+ tahun, lakukan penyegaran kompresor (flush + ganti oil) — murah dibanding ganti kompresor. Butuh oil kompresor atau sparepart pendukung? Tim kami menyediakan juga.',
    },
  ]

  for (const a of articles) {
    await db.article.create({ data: { ...a, publishedAt: new Date() } })
  }

  const testimonials = [
    { name: 'Rudi Hartono', city: 'Jakarta Timur', role: 'Teknisi AC Mandiri', rating: 5, message: 'Sudah 3 tahun langganan. Kompresor original semua, garansinya jalan terus. Pas klien komplain, tinggal klaim — diganti tanpa drama. Ini yang bikin nama baik teknisi terjaga.' },
    { name: 'Sinta Dewi', city: 'Bandung', role: 'Ibu Rumah Tangga', rating: 5, message: 'AC kami jebol di tengah Ramadan, panas banget rasanya nyari toko. Lewat Juragan Kompresor, dibantu AI-nya pilih kompresor 1 PK R32, besoknya sampai. Teknisi mereka juga bantu arahkan tukang AC kami via WA. Recommended!' },
    { name: 'Bpk. Hendra Wijaya', city: 'Surabaya', role: 'Owner Resto Seafood', rating: 5, message: 'Butuh 4 unit scroll Copeland 5 PK untuk ruang makan. Dapat harga grosir + penawaran resmi buat laporan pajak. Kirim cepat, packing kayu, aman. Langganan proyek berikutnya pasti di sini.' },
    { name: 'Maya Anggraini', city: 'Medan', role: 'Property Agent', rating: 5, message: 'Rumah listingan saya AC-nya mati semua. Diagnosa di website ini bilang kompresor R22 lama sudah beku, direkomendasiin penggantinya. Total 3 unit dibenerin, jadi dong rumahnya terjual harga bagus!' },
    { name: 'Agus Salim', city: 'Semarang', role: 'Teknisi Refrigerasi', rating: 5, message: 'Yang bikin beda: ada Kalkulator PK dan cek kompatibilitas model. Klien suka nanya "mas, yang cocok yang mana?" tinggal kasih lihat hasil di web ini. Kredibilitas naik, deal makin cepat.' },
    { name: 'Lina Kartika', city: 'Makassar', role: 'Owner Laundry', rating: 5, message: 'Pertama kali beli sparepart online dan takut ketipu. Ternyata kompresornya segel resmi, ada nomor seri, bisa dicek. Garansi 1 tahun ditulis jelas. Sudah repeat order 2x.' },
  ]

  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  const faqs = [
    { question: 'Apakah semua kompresor di Juragan Kompresor original?', answer: 'Ya, 100%. Semua kompresor kami disuplai dari distributor resmi (Copeland, Danfoss, Bitzer, GMCC, Highly, dan importir resmi brand Jepang). Setiap unit memiliki nomor seri yang dapat diverifikasi dan disegel sebelum dikirim. Jika terbukti tidak original, kami kembalikan uang 100% + ganti rugi.', order: 1 },
    { question: 'Bagaimana cara tahu kompresor mana yang cocok untuk AC saya?', answer: 'Ada 3 cara: (1) Gunakan Kalkulator PK untuk menghitung kebutuhan ruangan, (2) Gunakan Cek Kompatibilitas dengan memasukkan model AC kamu, (3) Chat Tanya Juragan — AI ahli kompresor kami yang aktif 24 jam. Untuk kasus rumit, teknisi senior kami siap bantu via WhatsApp gratis.', order: 2 },
    { question: 'Berapa lama pengiriman dan apakah packing aman?', answer: 'Jabodetabek: same-day sampai H+1. Luar Jawa: 2-4 hari via kargo terpercaya. Setiap kompresor dibungkus bubble wrap tebal + box double wall, opsi packing kayu untuk unit scroll & industrial. Seluruh kiriman diasuransikan penuh.', order: 3 },
    { question: 'Bagaimana klaim garansi jika kompresor bermasalah?', answer: 'Hubungi WhatsApp kami dengan video/foto gejala. Tim teknis akan triase dalam 1x24 jam. Jika terbukti cacat pabrik, unit diganti baru tanpa biaya, ongkir kami tanggung. Garansi resmi 1 tahun untuk kompresor baru, garansi tukar 30 hari untuk beberapa item stok terbatas.', order: 4 },
    { question: 'Apakah ada harga grosir untuk teknisi dan kontraktor?', answer: 'Ada! Setiap produk memiliki tiered pricing: beli 3+ unit otomatis diskon 4%, 5+ unit diskon 8%. Untuk proyek 10 unit ke atas atau kebutuhan industrial (scroll Copeland, Danfoss, Bitzer), gunakan fitur Minta Penawaran — tim B2B kami mengirim penawaran resmi dengan term pembayaran fleksibel.', order: 5 },
    { question: 'Kompresor inverter bisa dipasang di AC standar (non-inverter)?', answer: 'Tidak bisa, dan sebaliknya. Kompresor inverter membutuhkan PCB inverter untuk mengatur kecepatan putar (frekuensi variabel), sedangkan kompresor standar bekerja pada frekuensi tetap 50 Hz. Selalu cocokkan tipe kompresor dengan modul kontrol AC kamu — pakai Cek Kompatibilitas untuk memastikan.', order: 6 },
    { question: 'Apakah kompresor R22 untuk AC lama masih tersedia?', answer: 'Ya, kami menyimpan stok terbatas kompresor R22 original (Mitsubishi, Sanyo, dst) untuk menyelamatkan unit lama. Namun karena fase-out global, stok tidak bisa dipastikan tersedia terus. Kami sarankan juga konsultasi konversi ke R32/R410A dengan teknisi kami bila komponen lain mendukung.', order: 7 },
    { question: 'Metode pembayaran apa saja yang diterima?', answer: 'Transfer bank (BCA, Mandiri, BNI, BRI), QRIS, e-wallet, dan cicilan 0% hingga 12 bulan untuk pembelian tertentu. Untuk pembeli korporat/B2B tersedia term pembayaran (top) setelah verifikasi dokumen perusahaan.', order: 8 },
  ]

  for (const f of faqs) {
    await db.faq.create({ data: f })
  }

  console.log(`✅ Seed selesai: ${products.length} produk, ${articles.length} artikel, ${testimonials.length} testimoni, ${faqs.length} FAQ`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
