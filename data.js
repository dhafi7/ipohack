// Mock database of Indonesian IPOs - Updated to match current state and formulas
export const ipoData = [
  {
    id: "rans",
    ticker: "RANS",
    name: "PT Rans Entertainmen Indonesia Tbk",
    sector: "Consumer Cyclical",
    status: "allocation",
    priceRange: [135, 170],
    price: 170,
    sharesOffered: 2525000000,
    totalRaisedRange: [300, 420], // Billion IDR belum disesuaikan
    totalRaised: 429.95,
    bookBuildingDate: "23 Jun - 25 Jun 2026",
    offeringDate: "02 Jul - 08 Jul 2026",
    listingDate: "10 Jul 2026",
    underwriters: ["Trimegah Sekuritas Indonesia (LG)"],
    underwriterTrackRecord: "Rata-rata performa IPO: +9% di hari pertama (Historis moderat, rawan aksi profit taking)",
    description: "PT Rans Entertainment Indonesia Tbk adalah perusahaan media kreatif, agensi talenta digital, rumah produksi (production house), dan bisnis gaya hidup (F&B serta olahraga) terintegrasi terkemuka di Indonesia yang dipimpin oleh tokoh publik ternama.",
    useOfProceeds: [
      { purpose: "Pembayaran lebih awal pokok utang ke bank BNI", percentage: 6.98, category: "bayar-utang" },
      { purpose: "Belanja modal pembangunan Cipungland", percentage: 18.64, category: "modal-kerja" },
      { purpose: "Capex untuk penyelenggaraan konser di berbagai kota", percentage: 37.61, category: "modal-kerja" },
      { purpose: "Entitas baru dengan PT Feedloop Global Teknologi", percentage: 8.15, category: "ekspansi" },
      { purpose: "Ekspansi usaha melalui akuisisi saham PT Rans Kosmetika Indonesia", percentage: 19.80, category: "ekspansi" }
    ],
    financials: [
      { year: "2023", revenue: 438, netProfit: 84, assets: 517, liabilities: 199 },
      { year: "2024", revenue: 411, netProfit: 97, assets: 591, liabilities: 157 },
      { year: "2025", revenue: 353, netProfit: 57, assets: 461, liabilities: 120 }
    ],
    valuation: {
      peRatio: 31.0, // At midpoint price
      pbvRatio: 2.6,
      der: 0.26
    },
    sectorAverages: {
      peRatio: 22.0,
      pbvRatio: 2.8,
      der: 0.8
    },
    riskFactor: "Medium",
    riskDetails: "Ketergantungan yang tinggi pada popularitas dan reputasi figur kunci/tokoh utama emiten.",
    prospectusUrl: "https://e-ipo.co.id/id/pipeline/get-propectus-file?id=354&type=",
    oversubscribed: 38.5,
    owner: {
      name: "Raffi Ahmad & Nagita Slavina (RANS Group)",
      reputationScore: 4.0,
      notes: "Sangat populer dengan jangkauan pemasaran media sosial raksasa, namun pengawasan korporasi bergantung pada figur utama."
    }
  },
  {
    id: "prdl",
    ticker: "PRDL",
    name: "PT Prodia Diagnostic Line Tbk",
    sector: "Healthcare",
    status: "listed",
    priceRange: [100, 120],
    price: 120,
    sharesOffered: 522900000,
    totalRaisedRange: [270, 270],
    totalRaised: 62.75, // Billion IDR
    bookBuildingDate: "18 Jun - 23 Jun 2026",
    offeringDate: "01 Jul - 07 Jul 2026",
    listingDate: "09 Jul 2026",
    underwriters: ["Sucor Sekuritas (AZ)"],
    underwriterTrackRecord: "Rata-rata performa IPO: +19.8% di hari pertama (Sangat kuat mengawal emiten retail/teknologi, likuiditas tinggi)",
    description: "PT Prodia Diagnostic Line Tbk mengoperasikan ekosistem perdagangan logistik kesehatan.",
    useOfProceeds: [
      { purpose: "Pelunasan pokok fasilitas kredit ke BCA dan PNBN", percentage: 62.57, category: "bayar-utang" },
      { purpose: "Belanja Modal", percentage: 28.92, category: "modal-kerja" },
      { purpose: "Modal Kerja Perseroan", percentage: 8.51, category: "modal-kerja" }
    ],
    financials: [
      { year: "2023", revenue: 117.78, netProfit: 35.78, assets: 125, liabilities: 68.96 },
      { year: "2024", revenue: 58.66, netProfit: 10, assets: 184, liabilities: 117.90 },
      { year: "2025", revenue: 74.37, netProfit: 16.99, assets: 194, liabilities: 111.37 }
    ],
    valuation: {
      peRatio: 11.0,
      pbvRatio: 1.35,
      der: 0.25
    },
    sectorAverages: {
      peRatio: 22.0,
      pbvRatio: 2.8,
      der: 0.8
    },
    riskFactor: "Low",
    riskDetails: "Perubahan tren belanja konsumen dan kenaikan biaya akuisisi pelanggan (CAC) di ranah digital.",
    prospectusUrl: "https://e-ipo.co.id/id/pipeline/get-propectus-file?id=350&type=",
    oversubscribed: 42.1,
    owner: {
      name: "Prodia Group & Founders",
      reputationScore: 4.5,
      notes: "Grup Kesehatan Prodia."
    },
    actualPerformance: {
      day1Return: 20.0,
      day1Status: "ARA"
    }
  },
  {
    id: "emmi",
    ticker: "EMMI",
    name: "PT Esa Medika Mandiri Tbk",
    sector: "Healthcare",
    status: "listed",
    priceRange: [446, 515],
    price: 470,
    sharesOffered: 522857000,
    totalRaisedRange: [96, 120], // Billion IDR
    totalRaised: 245.74,
    bookBuildingDate: "22 Jun - 24 Jun 2026",
    offeringDate: "02 Jul - 06 Jul 2026",
    listingDate: "08 Jul 2026",
    underwriters: ["BRI Danareksa Sekuritas Indonesia (OD)"],
    underwriterTrackRecord: "Rata-rata performa IPO: +8.5% di hari pertama (Volatilitas tinggi, basis retail kuat sering langsung profit taking)",
    description: "PT Esa Medika Mandiri Tbk bergerak di bidang industri Kesehatan.",
    useOfProceeds: [
      { purpose: "Pembayaran sebagian pokok pinjaman", percentage: 18.3, category: "bayar-utang" },
      { purpose: "Pembiayaan modal pembangunan gedung pabrik Cikupa", percentage: 11.8, category: "ekspansi" },
      { purpose: "Modal kerja perseroan", percentage: 68.7, category: "modal-kerja" }
    ],
    financials: [
      { year: "2023", revenue: 173, netProfit: 1, assets: 341, liabilities: 285 },
      { year: "2024", revenue: 385, netProfit: 11, assets: 714, liabilities: 641 },
      { year: "2025", revenue: 455, netProfit: 32, assets: 564, liabilities: 419 }
    ],
    valuation: {
      peRatio: 25.8, // At midpoint price
      pbvRatio: 2.15,
      der: 0.32
    },
    sectorAverages: {
      peRatio: 15.0,
      pbvRatio: 1.8,
      der: 0.6
    },
    riskFactor: "Medium",
    riskDetails: "Fluktuasi harga bahan baku daging & tepung serta persaingan dengan brand lokal besar.",
    prospectusUrl: "https://e-ipo.co.id/id/pipeline/get-propectus-file?id=351&type=",
    oversubscribed: 8.2,
    owner: {
      name: "Grup Esa Makmur",
      reputationScore: 3.5,
      notes: "Kesehatan."
    },
    actualPerformance: {
      day1Return: 8.5,
      day1Status: "Naik"
    }
  },
  {
    id: "jecx",
    ticker: "JECX",
    name: "PT Nitrasanata Dharma Tbk",
    sector: "Healthcare",
    status: "listed",
    priceRange: [1200, 1400],
    price: 1250,
    sharesOffered: 487983500,
    totalRaisedRange: [352, 352],
    totalRaised: 609.98, // Billion IDR
    bookBuildingDate: "22 Jun - 24 Jun 2026",
    offeringDate: "01 Jul - 03 Jul 2026",
    listingDate: "07 Jul 2026",
    underwriters: ["Trimegah Sekuritas Indonesia (LG)"],
    underwriterTrackRecord: "Rata-rata performa IPO: +16.5% di hari pertama (Sangat stabil, didukung institusi besar, jarang longsor)",
    description: "PT Nitrasanata Dharma Tbk Menyediakan jasa dan layanan kesehatan rumah sakit mata premium di Indonesia.",
    useOfProceeds: [
      { purpose: "Penambahan 200 armada kurir listrik (EV)", percentage: 50, category: "ekspansi" },
      { purpose: "Otomatisasi 5 hub pergudangan transit utama", percentage: 35, category: "ekspansi" },
      { purpose: "Pengembangan sistem tracking AI real-time", percentage: 15, category: "modal-kerja" }
    ],
    financials: [
      { year: "2023", revenue: 310, netProfit: -10, assets: 220, liabilities: 140 },
      { year: "2024", revenue: 420, netProfit: 11, assets: 280, liabilities: 165 },
      { year: "2025", revenue: 580, netProfit: 28, assets: 390, liabilities: 190 }
    ],
    valuation: {
      peRatio: 57.0,
      pbvRatio: 3.45,
      der: 0.48
    },
    sectorAverages: {
      peRatio: 18.0,
      pbvRatio: 2.1,
      der: 1.2
    },
    riskFactor: "High",
    riskDetails: "Perang tarif jasa logistik kurir domestik yang ketat dan fluktuasi harga bahan bakar.",
    prospectusUrl: "https://e-ipo.co.id/id/pipeline/get-propectus-file?id=352&type=",
    oversubscribed: 18.3,
    owner: {
      name: "AI Logistics Group & Founders",
      reputationScore: 3.0,
      notes: "Perusahaan yang sedang merintis otomatisasi logistik pintar. Manajemen diisi oleh profesional kurir kawakan."
    },
    actualPerformance: {
      day1Return: 16.5,
      day1Status: "Naik"
    }
  },
  {
    id: "jeli",
    ticker: "JELI",
    name: "PT Niramas Utama Tbk",
    sector: "Consumer Non-Cyclical",
    status: "listed",
    priceRange: [900, 1120],
    price: 900,
    sharesOffered: 266000000,
    totalRaisedRange: [180, 180],
    totalRaised: 315, // Billion IDR
    bookBuildingDate: "15 Jun - 22 Jun 2026",
    offeringDate: "01 Jul - 03 Jul 2026",
    listingDate: "07 Jul 2026",
    underwriters: ["Sucor Sekuritas (AZ)"],
    underwriterTrackRecord: "Rata-rata performa IPO: +15.2% di hari pertama (Sangat terjaga, jarang ARB)",
    description: "PT Jeli Food Indonesia Tbk adalah produsen makanan ringan berbasis gelatin buah (jelly cup/straw) berkarakter kartun dengan penetrasi ekspor hingga ke Filipina dan Vietnam.",
    useOfProceeds: [
      { purpose: "Investasi mesin manufaktur cetak jelly otomatis baru", percentage: 55, category: "ekspansi" },
      { purpose: "Kampanye pemasaran terintegrasi", percentage: 25, category: "modal-kerja" },
      { purpose: "Modal kerja umum pembelian bahan baku", percentage: 20, category: "modal-kerja" }
    ],
    financials: [
      { year: "2023", revenue: 140, netProfit: 9, assets: 120, liabilities: 40 },
      { year: "2024", revenue: 180, netProfit: 13, assets: 150, liabilities: 45 },
      { year: "2025", revenue: 225, netProfit: 17, assets: 190, liabilities: 50 }
    ],
    valuation: {
      peRatio: 31.1,
      pbvRatio: 2.6,
      der: 0.26
    },
    sectorAverages: {
      peRatio: 15.0,
      pbvRatio: 1.8,
      der: 0.6
    },
    riskFactor: "Low",
    riskDetails: "Ketergantungan pada rantai pasok gula impor dan regulasi sertifikasi BPOM/Halal produk baru.",
    prospectusUrl: "https://e-ipo.co.id/id/pipeline/get-propectus-file?id=349&type=",
    oversubscribed: 12.5,
    owner: {
      name: "Keluarga Cendana Food (Bapak Jeli)",
      reputationScore: 3.5,
      notes: "Dikenal memiliki loyalitas merek yang baik di kalangan anak-anak. Manajemen cukup solid."
    },
    actualPerformance: {
      day1Return: 24.5,
      day1Status: "ARA"
    }
  },
  {
    id: "bach",
    ticker: "BACH",
    name: "PT Bach Multi Global Tbk",
    sector: "Infrastructure",
    status: "listed",
    priceRange: [400, 500],
    price: 442,
    sharesOffered: 615000000,
    totalRaisedRange: [225, 225],
    totalRaised: 271.83, // Billion IDR
    bookBuildingDate: "22 Jun - 24 Jun 2026",
    offeringDate: "02 Jul - 06 Jul 2026",
    listingDate: "08 Jul 2026",
    underwriters: ["Erdikha Elit Sekuritas (AO)"],
    underwriterTrackRecord: "Rata-rata performa IPO: -4.5% di hari pertama (Historis underwrite sering langsung ARB)",
    description: "PT Bach Multi Global Tbk merupakan emiten kontraktor infrastruktur telekomunikasi nasional yang berfokus pada instalasi kabel serat optik bawah laut serta pemeliharaan menara seluler.",
    useOfProceeds: [
      { purpose: "Pembelian kabel fiber optik bawah laut dari Jepang", percentage: 65, category: "ekspansi" },
      { purpose: "Pelunasan utang obligasi jangka pendek sekuritas", percentage: 20, category: "bayar-utang" },
      { purpose: "Modal kerja proyek operasional", percentage: 15, category: "modal-kerja" }
    ],
    financials: [
      { year: "2023", revenue: 210, netProfit: 12, assets: 320, liabilities: 190 },
      { year: "2024", revenue: 250, netProfit: 16, assets: 345, liabilities: 200 },
      { year: "2025", revenue: 295, netProfit: 21, assets: 380, liabilities: 210 }
    ],
    valuation: {
      peRatio: 11.5,
      pbvRatio: 2.25,
      der: 1.23
    },
    sectorAverages: {
      peRatio: 12.0,
      pbvRatio: 1.5,
      der: 0.9
    },
    riskFactor: "High",
    riskDetails: "Utang modal kerja tinggi dan keterlambatan pencairan anggaran proyek infrastruktur dari BUMN.",
    prospectusUrl: "https://e-ipo.co.id/id/pipeline/get-propectus-file?id=353&type=",
    oversubscribed: 2.1,
    owner: {
      name: "Grup Bach Telecommunication & Swasta",
      reputationScore: 2.5,
      notes: "Sektor kontraktor yang memiliki DER tinggi. Struktur kepemilikan rumit dan beban keuangan besar."
    },
    actualPerformance: {
      day1Return: -10.0,
      day1Status: "ARB"
    }
  },
];

// Database of Securities Underwriters and their historical IPO track records
export const underwriterData = [
  {
    code: "LG",
    name: "PT Trimegah Sekuritas",
    totalIpos: 22,
    winRate: 95,
    avgAra: 2.3,
    avgGain: 24.81,
    reputationScore: 5.0
  },
  {
    code: "PD",
    name: "PT Indo Premier Sekuritas",
    totalIpos: 11,
    winRate: 73,
    avgAra: 1.2,
    avgGain: 16.41,
    reputationScore: 4.5
  },
  {
    code: "SQ",
    name: "PT BCA Sekuritas",
    totalIpos: 10,
    winRate: 90,
    avgAra: 3.6,
    avgGain: 27.42,
    reputationScore: 4.0
  },
  {
    code: "CC",
    name: "PT Mandiri Sekuritas",
    totalIpos: 18,
    winRate: 67,
    avgAra: 0.5,
    avgGain: 11.0,
    reputationScore: 4.0
  },
  {
    code: "YP",
    name: "PT Mirae Asset Sekuritas Indonesia",
    totalIpos: 31,
    winRate: 84,
    avgAra: 2.6,
    avgGain: 21.06,
    reputationScore: 3.0
  },
  {
    code: "IF",
    name: "PT Samuel Sekuritas Indonesia",
    totalIpos: 16,
    winRate: 81,
    avgAra: 1.9,
    avgGain: 18.39,
    reputationScore: 3.0
  },
  {
    code: "AH",
    name: "PT Shinhan Sekuritas Indonesia",
    totalIpos: 16,
    winRate: 75,
    avgAra: 0.9,
    avgGain: 15.60,
    reputationScore: 1.5
  },
  {
    code: "AZ",
    name: "PT Sucor Sekuritas",
    totalIpos: 16,
    winRate: 88,
    avgAra: 1.9,
    avgGain: 17.81,
    reputationScore: 4.8
  },
  {
    code: "OD",
    name: "PT BRI Danareksa Sekuritas",
    totalIpos: 16,
    winRate: 75,
    avgAra: 1.6,
    avgGain: 13.70,
    reputationScore: 3.8
  },
  {
    code: "AO",
    name: "PT Erdikha Elit Sekuritas",
    totalIpos: 18,
    winRate: 78,
    avgAra: 1.6,
    avgGain: 13.70,
    reputationScore: 2.0
  },
  {
    code: "AI",
    name: "PT Kay Hian Sekuritas",
    totalIpos: 39,
    winRate: 92,
    avgAra: 1.8,
    avgGain: 26.34,
    reputationScore: 5.0
  }
];
