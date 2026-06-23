/*
  ===================================================================
  ملف المنتجات - مجد الدين
  ===================================================================

  هذا الملف هو المكان الوحيد اللي تحتاج تعدل فيه عشان:
  - تضيف منتج جديد
  - تحذف منتج
  - تغير سعر
  - تضيف أو تغير صورة
  - تغير التصنيف

  ما تحتاج تلمس أي ملف آخر. اتبع نفس الشكل بالضبط لكل منتج.

  ===================================================================
  كيف تضيف منتج جديد؟
  ===================================================================
  انسخ هذا القالب وضعه داخل التصنيف المناسب، وعدل القيم:

  {
    name: "اسم المنتج",
    price: 39,
    unit: "كيلو",
    image: "images/products/اسم-الصورة.jpg",
    available: true
  },

  ===================================================================
  كيف تحذف منتج؟
  ===================================================================
  احذف الكتلة كاملة من { إلى }, الخاصة بهذا المنتج.

  ===================================================================
  كيف تضيف صورة لمنتج؟
  ===================================================================
  1. ضع ملف الصورة داخل مجلد images/products/
  2. اكتب اسم الملف بالضبط في خانة image، مثلاً:
     image: "images/products/بسبوسة-قشطة.jpg"
  3. لو لسا ما عندك صورة، اترك القيمة فاضية: image: ""
     وبيظهر شعار مكان الصورة بشكل أنيق تلقائياً.

  ===================================================================
  كيف توقف منتج مؤقتاً بدون حذفه؟
  ===================================================================
  غيّر available: true إلى available: false
  وبيظهر المنتج باهت مكتوب عليه "غير متوفر حالياً" بدل ما تحذفه.

  ===================================================================
*/

const STORE_INFO = {
  name: "مجد الدين",
  nameEn: "MAJDEDDIN",
  whatsapp: "966566909707", // رقم الواتساب بصيغة دولية بدون + أو صفر بالبداية
  tagline: "حلويات شامية أصيلة"
};

const CATEGORIES = [
  { id: "harisa", name: "الهريسة" },
  { id: "basbousa", name: "البسبوسة" },
  { id: "cakes", name: "الكيك" },
  { id: "cheese", name: "حلويات الجبن" },
  { id: "knafeh", name: "الكنافة" },
  { id: "pieces", name: "حلويات بالحبة" },
  { id: "specials", name: "تشكيلات خاصة" }
];

const PRODUCTS = [

  // ---------------- الهريسة ----------------
  {
    name: "هريسة سادة",
    price: 28,
    unit: "كيلو",
    category: "harisa",
    image: "",
    available: true
  },
  {
    name: "هريسة قشطة",
    price: 38,
    unit: "كيلو",
    category: "harisa",
    image: "",
    available: true
  },
  {
    name: "هريسة قرفة",
    price: 29,
    unit: "كيلو",
    category: "harisa",
    image: "",
    available: true
  },
  {
    name: "هريسة باشا",
    price: 47,
    unit: "كيلو",
    category: "harisa",
    image: "",
    available: true
  },
  {
    name: "هريسة بالشوكولا",
    price: null,
    unit: "كيلو",
    category: "harisa",
    image: "",
    available: true
  },

  // ---------------- البسبوسة ----------------
  {
    name: "بسبوسة سادة",
    price: 39,
    unit: "كيلو",
    category: "basbousa",
    image: "",
    available: true
  },
  {
    name: "بسبوسة قشطة",
    price: 39,
    unit: "كيلو",
    category: "basbousa",
    image: "",
    available: true
  },
  {
    name: "بسبوسة أوريو",
    price: 39,
    unit: "كيلو",
    category: "basbousa",
    image: "",
    available: true
  },
  {
    name: "بسبوسة توفي",
    price: 39,
    unit: "كيلو",
    category: "basbousa",
    image: "",
    available: true
  },

  // ---------------- الكيك ----------------
  {
    name: "كيكة الجزر",
    price: 39,
    unit: "كيلو",
    category: "cakes",
    image: "",
    available: true
  },
  {
    name: "كيكة الحليب",
    price: null,
    unit: "كيلو",
    category: "cakes",
    image: "",
    available: true
  },
  {
    name: "كيكة الزعفران",
    price: null,
    unit: "كيلو",
    category: "cakes",
    image: "",
    available: true
  },

  // ---------------- حلويات الجبن ----------------
  {
    name: "حلا تشيز",
    price: 65,
    unit: "كيلو",
    category: "cheese",
    image: "",
    available: true
  },
  {
    name: "حلاوة الجبن",
    price: 39,
    unit: "كيلو",
    category: "cheese",
    image: "",
    available: true
  },

  // ---------------- الكنافة ----------------
  {
    name: "كنافة عثملية",
    price: null,
    unit: "كيلو",
    category: "knafeh",
    image: "",
    available: true
  },
  {
    name: "كنافة رول",
    price: null,
    unit: "كيلو",
    category: "knafeh",
    image: "",
    available: true
  },
  {
    name: "كنافة أم النارين",
    price: null,
    unit: "كيلو",
    category: "knafeh",
    image: "",
    available: true
  },

  // ---------------- حلويات بالحبة ----------------
  {
    name: "شعيبيات",
    price: 7,
    unit: "حبة",
    category: "pieces",
    image: "",
    available: true
  },
  {
    name: "سينابون",
    price: 7.5,
    unit: "حبة",
    category: "pieces",
    image: "",
    available: true
  },
  {
    name: "كوكيز",
    price: null,
    unit: "حبة",
    category: "pieces",
    image: "",
    available: true
  },
  {
    name: "تمر محشي",
    price: null,
    unit: "كيلو",
    category: "pieces",
    image: "",
    available: true
  },

  // ---------------- تشكيلات خاصة ----------------
  {
    name: "معجوقة",
    price: 58,
    unit: "كيلو",
    category: "specials",
    image: "",
    available: true
  },
  {
    name: "مدلوقة",
    price: 80,
    unit: "كيلو",
    category: "specials",
    image: "",
    available: true
  },
  {
    name: "ورد الشام",
    price: null,
    unit: "كيلو",
    category: "specials",
    image: "",
    available: true
  },
  {
    name: "صفوف",
    price: null,
    unit: "كيلو",
    category: "specials",
    image: "",
    available: true
  },
  {
    name: "وربات قشطة عالبارد",
    price: null,
    unit: "كيلو",
    category: "specials",
    image: "",
    available: true
  }

];
