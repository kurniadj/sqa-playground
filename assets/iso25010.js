// ISO/IEC 25010:2011 — Data Karakteristik Kualitas Perangkat Lunak
const ISO25010 = [
  {
    id: "functional-suitability",
    name: "Functional Suitability",
    nameId: "Kesesuaian Fungsional",
    icon: "⚙️",
    color: "#3b82f6",
    description: "Kemampuan perangkat lunak untuk menyediakan fungsi yang memenuhi kebutuhan yang dinyatakan dan tersirat saat digunakan dalam kondisi tertentu.",
    subcharacteristics: [
      { name: "Functional Completeness", nameId: "Kelengkapan Fungsional", desc: "Fungsi-fungsi mencakup semua tugas dan tujuan pengguna yang ditentukan." },
      { name: "Functional Correctness", nameId: "Kebenaran Fungsional", desc: "Produk menghasilkan hasil yang benar dengan tingkat presisi yang diperlukan." },
      { name: "Functional Appropriateness", nameId: "Kesesuaian Fungsional", desc: "Fungsi memfasilitasi pencapaian tugas dan tujuan yang ditentukan." }
    ],
    contoh: "Aplikasi e-commerce memiliki fitur pencarian produk, keranjang belanja, dan pembayaran yang berfungsi dengan benar."
  },
  {
    id: "performance-efficiency",
    name: "Performance Efficiency",
    nameId: "Efisiensi Kinerja",
    icon: "⚡",
    color: "#f59e0b",
    description: "Kinerja relatif terhadap jumlah sumber daya yang digunakan dalam kondisi tertentu.",
    subcharacteristics: [
      { name: "Time Behaviour", nameId: "Perilaku Waktu", desc: "Waktu respon, pengolahan, dan throughput memenuhi persyaratan." },
      { name: "Resource Utilisation", nameId: "Pemanfaatan Sumber Daya", desc: "Jumlah dan jenis sumber daya yang digunakan dalam batas yang dipersyaratkan." },
      { name: "Capacity", nameId: "Kapasitas", desc: "Batas parameter produk atau sistem memenuhi persyaratan." }
    ],
    contoh: "Halaman web memuat dalam waktu kurang dari 3 detik dan mampu menangani 1000 pengguna secara bersamaan."
  },
  {
    id: "compatibility",
    name: "Compatibility",
    nameId: "Kompatibilitas",
    icon: "🔗",
    color: "#8b5cf6",
    description: "Kemampuan produk untuk bertukar informasi dengan produk, sistem, atau komponen lain, dan/atau menjalankan fungsi yang diperlukan sambil berbagi lingkungan dan sumber daya yang sama.",
    subcharacteristics: [
      { name: "Co-existence", nameId: "Ko-eksistensi", desc: "Dapat menjalankan fungsi yang diperlukan secara efisien sambagi berbagi lingkungan dan sumber daya umum dengan produk lain." },
      { name: "Interoperability", nameId: "Interoperabilitas", desc: "Dapat bertukar informasi dan menggunakan informasi yang dipertukarkan dengan sistem lain." }
    ],
    contoh: "Aplikasi mobile dapat berjalan di Android dan iOS, serta terintegrasi dengan sistem pembayaran pihak ketiga."
  },
  {
    id: "usability",
    name: "Usability",
    nameId: "Kegunaan",
    icon: "👤",
    color: "#10b981",
    description: "Kemampuan produk untuk dapat digunakan oleh pengguna tertentu untuk mencapai tujuan tertentu dengan efektivitas, efisiensi, dan kepuasan dalam konteks penggunaan tertentu.",
    subcharacteristics: [
      { name: "Appropriateness Recognisability", nameId: "Keterkenalan Kesesuaian", desc: "Pengguna dapat mengenali apakah produk sesuai untuk kebutuhannya." },
      { name: "Learnability", nameId: "Kemudahan Belajar", desc: "Pengguna dapat belajar menggunakan produk untuk tujuan tertentu secara efektif, efisien, bebas risiko, dan memuaskan." },
      { name: "Operability", nameId: "Kemudahan Operasi", desc: "Produk memiliki atribut yang memudahkan pengoperasian dan pengendalian." },
      { name: "User Error Protection", nameId: "Perlindungan Kesalahan Pengguna", desc: "Sistem melindungi pengguna dari membuat kesalahan." },
      { name: "User Interface Aesthetics", nameId: "Estetika Antarmuka Pengguna", desc: "Antarmuka pengguna memberikan interaksi yang menyenangkan dan memuaskan." },
      { name: "Accessibility", nameId: "Aksesibilitas", desc: "Produk dapat digunakan oleh orang dengan berbagai macam karakteristik dan kemampuan." }
    ],
    contoh: "Pengguna baru dapat melakukan pembelian pertama dalam aplikasi tanpa tutorial, dengan antarmuka yang intuitif."
  },
  {
    id: "reliability",
    name: "Reliability",
    nameId: "Keandalan",
    icon: "🛡️",
    color: "#ef4444",
    description: "Kemampuan sistem atau komponen untuk melakukan fungsi tertentu dalam kondisi tertentu selama jangka waktu tertentu.",
    subcharacteristics: [
      { name: "Maturity", nameId: "Kematangan", desc: "Sistem memenuhi kebutuhan keandalan dalam operasi normal." },
      { name: "Availability", nameId: "Ketersediaan", desc: "Sistem atau komponen dapat dioperasikan dan diakses saat diperlukan." },
      { name: "Fault Tolerance", nameId: "Toleransi Kesalahan", desc: "Sistem beroperasi sebagaimana mestinya meskipun ada kesalahan perangkat keras atau perangkat lunak." },
      { name: "Recoverability", nameId: "Kemampuan Pemulihan", desc: "Sistem dapat memulihkan data yang terpengaruh langsung dan membangun kembali kondisi yang diinginkan setelah gangguan atau kegagalan." }
    ],
    contoh: "Aplikasi banking memiliki uptime 99.9% dan data transaksi tidak pernah hilang saat terjadi gangguan jaringan."
  },
  {
    id: "security",
    name: "Security",
    nameId: "Keamanan",
    icon: "🔒",
    color: "#f97316",
    description: "Kemampuan produk untuk melindungi informasi dan data sehingga orang atau sistem lain memiliki tingkat akses data yang sesuai dengan jenis dan tingkat otorisasinya.",
    subcharacteristics: [
      { name: "Confidentiality", nameId: "Kerahasiaan", desc: "Produk memastikan bahwa data hanya dapat diakses oleh mereka yang berwenang untuk memiliki akses." },
      { name: "Integrity", nameId: "Integritas", desc: "Sistem mencegah akses atau modifikasi yang tidak sah terhadap program atau data komputer." },
      { name: "Non-repudiation", nameId: "Non-penolakan", desc: "Tindakan atau kejadian dapat dibuktikan telah terjadi sehingga tidak dapat disangkal di kemudian hari." },
      { name: "Accountability", nameId: "Akuntabilitas", desc: "Tindakan entitas dapat dilacak secara unik ke entitas tersebut." },
      { name: "Authenticity", nameId: "Keaslian", desc: "Identitas subjek atau sumber daya dapat terbukti sesuai dengan yang diklaim." }
    ],
    contoh: "Aplikasi menggunakan enkripsi HTTPS, autentikasi dua faktor, dan menyimpan password dengan hashing."
  },
  {
    id: "maintainability",
    name: "Maintainability",
    nameId: "Kemampuan Pemeliharaan",
    icon: "🔧",
    color: "#06b6d4",
    description: "Kemampuan produk untuk dimodifikasi secara efektif dan efisien oleh para pemelihara yang ditunjuk.",
    subcharacteristics: [
      { name: "Modularity", nameId: "Modularitas", desc: "Sistem terdiri dari komponen-komponen diskret sehingga perubahan pada satu komponen memiliki dampak minimal pada komponen lainnya." },
      { name: "Reusability", nameId: "Dapat Digunakan Kembali", desc: "Aset dapat digunakan di lebih dari satu sistem, atau dalam pembangunan aset lain." },
      { name: "Analysability", nameId: "Kemampuan Analisis", desc: "Dampak perubahan yang dimaksud pada produk, diagnosis kekurangan, atau penyebab kegagalan dapat dinilai secara efektif dan efisien." },
      { name: "Modifiability", nameId: "Kemampuan Modifikasi", desc: "Produk dapat dimodifikasi secara efektif dan efisien tanpa memperkenalkan kerusakan atau penurunan kualitas produk yang ada." },
      { name: "Testability", nameId: "Kemampuan Pengujian", desc: "Kriteria uji dapat dibuat untuk sistem, produk, atau komponen secara efektif dan efisien." }
    ],
    contoh: "Kode sumber terstruktur dengan baik, memiliki dokumentasi, dan memudahkan developer baru untuk menambah fitur."
  },
  {
    id: "portability",
    name: "Portability",
    nameId: "Portabilitas",
    icon: "📦",
    color: "#84cc16",
    description: "Kemampuan sistem atau komponen untuk dipindahkan secara efektif dan efisien dari satu perangkat keras, perangkat lunak, atau lingkungan operasional atau penggunaan lainnya ke yang lain.",
    subcharacteristics: [
      { name: "Adaptability", nameId: "Kemampuan Adaptasi", desc: "Produk dapat diadaptasi secara efektif dan efisien ke perangkat keras, perangkat lunak, atau lingkungan operasional atau penggunaan yang berbeda atau berkembang." },
      { name: "Installability", nameId: "Kemampuan Instalasi", desc: "Produk dapat diinstal dan/atau di-uninstall secara efektif dan efisien dalam lingkungan tertentu." },
      { name: "Replaceability", nameId: "Kemampuan Penggantian", desc: "Produk dapat menggantikan produk perangkat lunak lain yang ditentukan untuk tujuan yang sama dalam lingkungan yang sama." }
    ],
    contoh: "Aplikasi web dapat berjalan di semua browser modern (Chrome, Firefox, Safari, Edge) tanpa perbedaan tampilan signifikan."
  }
];
