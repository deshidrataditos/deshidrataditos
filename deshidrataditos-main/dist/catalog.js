/* Catalog data, shared by all views and checkout. */
(() => {
"use strict";
const PRODUCTS = [
  {
    id: "jerky-res",
    name: "Jerky de res",
    category: "jerky",
    type: "Cecina tipo jerky",
    description: "Carne de res con finas hierbas y sal ahumada. Picante bajo a intermedio.",
    availability: "Disponible",
    prices: { "50 g": 89, "100 g": 169, "250 g": 399, "1 kg": 1490 },
    bg: "#ead2bc",
    color: "#542311"
  },
  {
    id: "jerky-conejo",
    name: "Jerky de conejo",
    category: "jerky",
    type: "Cecina tipo jerky",
    description: "Carne de conejo con finas hierbas y sal ahumada. Elaboración sobre pedido.",
    availability: "Sobre pedido",
    prices: { "50 g": 119, "100 g": 219, "250 g": 519, "1 kg": 1990 },
    bg: "#e7ddd3",
    color: "#6b442c"
  },
  {
    id: "pina-chile",
    name: "Piña con chile",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Dulce y tropical con chile en polvo, sal y un picante amable.",
    availability: "Disponible",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#f7d45d",
    color: "#b64a1d"
  },
  {
    id: "fresa-chile",
    name: "Fresa con chile",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Notas dulces y ácidas con chile en polvo y una pizca de sal.",
    availability: "Disponible",
    prices: { "50 g": 49, "100 g": 89, "250 g": 209, "1 kg": 749 },
    bg: "#f5b1a6",
    color: "#a62622"
  },
  {
    id: "mango-chile",
    name: "Mango con chile",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Mango de sabor concentrado con chile y sal. Disponible sobre pedido.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#ffc447",
    color: "#a74319"
  },
  {
    id: "manzana-canela",
    name: "Manzana con canela",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Crujiente, aromática y naturalmente dulce. Una opción sin picante.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#ead39f",
    color: "#75401e"
  },
  {
    id: "platano-natural",
    name: "Plátano natural",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Práctico, dulce y listo para llevar. Sin chile y sobre pedido.",
    availability: "Sobre pedido",
    prices: { "50 g": 29, "100 g": 49, "250 g": 109, "1 kg": 399 },
    bg: "#f1dc7f",
    color: "#725819"
  },
  {
    id: "betabel",
    name: "Chips de betabel",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Láminas crujientes con chile en polvo, sal y un color naturalmente intenso.",
    availability: "Disponible",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#d7a0b3",
    color: "#7a193d"
  },
  {
    id: "jicama",
    name: "Jícama deshidratada",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Ligera y crujiente, con chile en polvo y sal. Picante bajo a intermedio.",
    availability: "Disponible",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#efe6d5",
    color: "#6f5135"
  },
  {
    id: "pepino",
    name: "Pepino deshidratado",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Una botana fresca de sabor con chile en polvo y sal.",
    availability: "Disponible",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#b8db9d",
    color: "#295f2d"
  },
  {
    id: "camote",
    name: "Chips de camote",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Dulzor natural, textura crujiente y un toque de chile con sal.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#efb17d",
    color: "#8d3e19"
  },
  {
    id: "mix-vegetales",
    name: "Mix de vegetales",
    category: "vegetable",
    type: "Selección mixta",
    description: "Una mezcla para probar diferentes sabores y texturas en una sola bolsa.",
    availability: "Sobre pedido",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#c7dc75",
    color: "#3b6728"
  },
  {
    id: "tisana-floral",
    name: "Tisana floral",
    category: "flower",
    type: "Mezcla para infusión",
    description: "Mezcla aromática de flores deshidratadas para preparar una bebida caliente o fría.",
    availability: "Sobre pedido",
    prices: { "50 g": 55, "100 g": 99, "250 g": 229, "1 kg": 849 },
    bg: "#f2b7c6",
    color: "#8b3151"
  },
  {
    id: "flor-jamaica",
    name: "Flor de jamaica",
    category: "flower",
    type: "Flor deshidratada",
    description: "De sabor ácido y color intenso, ideal para preparar infusiones calientes o agua fresca.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 129, "1 kg": 449 },
    bg: "#d895aa",
    color: "#731d3d"
  },
  {
    id: "manzanilla",
    name: "Manzanilla",
    category: "flower",
    type: "Flor para infusión",
    description: "Flores deshidratadas de aroma suave y delicado para preparar una infusión reconfortante.",
    availability: "Sobre pedido",
    prices: { "50 g": 45, "100 g": 79, "250 g": 179, "1 kg": 649 },
    bg: "#f4df80",
    color: "#7a5d16"
  },
  {
    id: "petalos-rosa",
    name: "Pétalos de rosa",
    category: "flower",
    type: "Flor para infusión",
    description: "Pétalos deshidratados de aroma floral, pensados para tisanas y mezclas especiales.",
    availability: "Sobre pedido",
    prices: { "50 g": 65, "100 g": 119, "250 g": 279, "1 kg": 999 },
    bg: "#efb0bc",
    color: "#862f48"
  }
];

const PRODUCT_PHOTOS = {
  "jerky-res": { src: "assets/product-jerky-temp.webp", position: "left center", scale: 1.45 },
  "jerky-conejo": { src: "assets/product-jerky-temp.webp", position: "right center", scale: 1.45 },
  "pina-chile": { src: "assets/product-fruits-temp.webp", position: "center top", scale: 1.55 },
  "fresa-chile": { src: "assets/product-fruits-temp.webp", position: "left top", scale: 1.55 },
  "mango-chile": { src: "assets/product-fruits-temp.webp", position: "right top", scale: 1.55 },
  "manzana-canela": { src: "assets/product-fruits-temp.webp", position: "left bottom", scale: 1.55 },
  "platano-natural": { src: "assets/product-fruits-temp.webp", position: "right bottom", scale: 1.55 },
  "betabel": { src: "assets/product-vegetables-temp.webp", position: "left top", scale: 1.55 },
  "jicama": { src: "assets/product-vegetables-temp.webp", position: "center top", scale: 1.55 },
  "pepino": { src: "assets/product-vegetables-temp.webp", position: "right top", scale: 1.55 },
  "camote": { src: "assets/product-vegetables-temp.webp", position: "left bottom", scale: 1.55 },
  "mix-vegetales": { src: "assets/product-vegetables-temp.webp", position: "right bottom", scale: 1.55 },
  "tisana-floral": { src: "assets/product-flowers-temp.webp", position: "right bottom", scale: 1.55 },
  "flor-jamaica": { src: "assets/product-flowers-temp.webp", position: "left top", scale: 1.55 },
  "manzanilla": { src: "assets/product-flowers-temp.webp", position: "center top", scale: 1.55 },
  "petalos-rosa": { src: "assets/product-flowers-temp.webp", position: "left bottom", scale: 1.55 }
};


const ADDITIONS = [
  {
    "id": "naranja-rodajas",
    "name": "Naranja en rodajas",
    "category": "citrus",
    "type": "Cítricos para bebidas",
    "description": "Rodajas aromáticas para darle un toque cítrico a tus bebidas y a la mesa.",
    "prices": {
      "50 g": 55,
      "100 g": 99,
      "250 g": 229
    },
    "tags": [
      "Cítrico",
      "Sin chile",
      "Coctelería"
    ],
    "use": "Añade una rodaja a un cóctel, agua mineral o infusión. También puedes usarla para decorar postres.",
    "rank": 1
  },
  {
    "id": "limon-rodajas",
    "name": "Limón en rodajas",
    "category": "citrus",
    "type": "Cítricos para bebidas",
    "description": "Un acento ácido y aromático para agua mineral, infusiones y coctelería.",
    "prices": {
      "50 g": 55,
      "100 g": 99,
      "250 g": 229
    },
    "tags": [
      "Ácido",
      "Sin chile",
      "Coctelería"
    ],
    "use": "Acompaña agua mineral o una bebida preparada. Ajusta la cantidad según la intensidad que prefieras.",
    "rank": 8
  },
  {
    "id": "toronja-rodajas",
    "name": "Toronja en rodajas",
    "category": "citrus",
    "type": "Cítricos para bebidas",
    "description": "Notas cítricas y ligeramente amargas para bebidas con personalidad.",
    "prices": {
      "50 g": 59,
      "100 g": 109,
      "250 g": 249
    },
    "tags": [
      "Cítrico",
      "Sin chile",
      "Coctelería"
    ],
    "use": "Úsala como acompañamiento en coctelería y bebidas frías; su cáscara aporta notas amargas.",
    "rank": 9
  },
  {
    "id": "tisana-jamaica-pina",
    "name": "Tisana jamaica y piña",
    "category": "flower",
    "type": "Tisana frutal",
    "description": "La acidez de la jamaica y el sabor tropical de la piña, para disfrutar caliente o con hielo.",
    "prices": {
      "50 g": 59,
      "100 g": 109,
      "250 g": 249
    },
    "tags": [
      "Frutal",
      "Sin chile",
      "Bebidas frías y calientes"
    ],
    "use": "Infusiona en agua caliente, cuela y ajusta la intensidad a tu gusto. Para servir fría, deja enfriar y añade hielo.",
    "rank": 2
  },
  {
    "id": "tisana-manzana-naranja",
    "name": "Tisana manzana, canela y naranja",
    "category": "flower",
    "type": "Tisana frutal",
    "description": "Una mezcla de fruta y especias con aroma cálido y un toque cítrico.",
    "prices": {
      "50 g": 65,
      "100 g": 119,
      "250 g": 279
    },
    "tags": [
      "Frutal",
      "Sin chile",
      "Con canela"
    ],
    "use": "Prepárala como infusión y cuela antes de servir. Pruébala caliente o fría.",
    "rank": 7
  },
  {
    "id": "mix-tropical",
    "name": "Mix tropical enchilado",
    "category": "fruit",
    "type": "Mezcla de frutas",
    "description": "Mango, piña y plátano con chile en una sola bolsa. Tres sabores para compartir o llevar.",
    "prices": {
      "50 g": 39,
      "100 g": 69,
      "250 g": 159
    },
    "tags": [
      "Con chile",
      "Tropical",
      "Para compartir"
    ],
    "use": "Disfrútalo directamente como botana. La proporción y apariencia de las frutas pueden variar por lote.",
    "rank": 3
  },
  {
    "id": "sazonador-hierbas",
    "name": "Sazonador ajo, cebolla y hierbas",
    "category": "pantry",
    "type": "Sazonador de cocina",
    "description": "Una mezcla aromática para darle sabor a vegetales, papas, pastas y marinados.",
    "prices": {
      "60 g": 59,
      "120 g": 109
    },
    "tags": [
      "Salado",
      "Sin chile",
      "Cocina"
    ],
    "use": "Añade poco a poco durante la preparación y ajusta al gusto. Consulta la composición del lote si necesitas controlar la sal.",
    "rank": 10
  },
  {
    "id": "sazonador-chile-citricos",
    "name": "Sazonador chile y cítricos",
    "category": "pantry",
    "type": "Sazonador de cocina",
    "description": "Un toque picosito y cítrico para fruta, botanas, vegetales y bebidas preparadas.",
    "prices": {
      "60 g": 59,
      "120 g": 109
    },
    "tags": [
      "Con chile",
      "Cítrico",
      "Cocina"
    ],
    "use": "Espolvorea sobre tu botana o úsalo para escarchar un vaso. Ajusta la cantidad al gusto.",
    "rank": 11
  },
  {
    "id": "rollito-mango",
    "name": "Rollito de mango con chile",
    "category": "fruit",
    "type": "Rollito de fruta",
    "description": "Fruta en una lámina enrollada, de textura flexible y sabor dulce con chile.",
    "prices": {
      "25 g": 25,
      "4 × 25 g": 89
    },
    "tags": [
      "Con chile",
      "Individual",
      "Mango"
    ],
    "use": "Listo para disfrutar. El paquete de cuatro contiene cuatro porciones individuales de 25 g.",
    "rank": 12
  },
  {
    "id": "rollito-guayaba",
    "name": "Rollito de guayaba con canela",
    "category": "fruit",
    "type": "Rollito de fruta",
    "description": "Guayaba y canela en una lámina enrollada: una pausa dulce, aromática y sin picante.",
    "prices": {
      "25 g": 25,
      "4 × 25 g": 89
    },
    "tags": [
      "Sin chile",
      "Individual",
      "Guayaba"
    ],
    "use": "Disfrútalo directamente o acompaña una tabla de quesos. El paquete de cuatro contiene cuatro porciones de 25 g.",
    "rank": 13
  },
  {
    "id": "jitomate-hierbas",
    "name": "Jitomate deshidratado con hierbas",
    "category": "pantry",
    "type": "Ingrediente de cocina",
    "description": "Sabor concentrado para pastas, pizzas y ensaladas. Presentación seca en bolsa.",
    "prices": {
      "50 g": 45,
      "100 g": 79,
      "250 g": 179
    },
    "tags": [
      "Salado",
      "Sin chile",
      "Cocina"
    ],
    "use": "Corta y añade durante la cocción, o rehidrata la porción que vayas a utilizar siguiendo las indicaciones del envase.",
    "rank": 14
  },
  {
    "id": "pack-degustacion",
    "name": "Paquete descubre Deshidrataditos",
    "category": "bundle",
    "type": "Paquete degustación",
    "description": "Tres bolsas para conocer nuestros sabores: mango con chile, piña con chile y manzana con canela.",
    "prices": {
      "3 × 50 g": 99
    },
    "tags": [
      "Tres sabores",
      "Para regalar",
      "150 g en total"
    ],
    "use": "Incluye tres bolsas separadas de 50 g. Dos opciones con chile y una de manzana con canela.",
    "rank": 4,
    "bundle": [
      {
        "id": "mango-chile",
        "label": "50 g",
        "quantity": 1
      },
      {
        "id": "pina-chile",
        "label": "50 g",
        "quantity": 1
      },
      {
        "id": "manzana-canela",
        "label": "50 g",
        "quantity": 1
      }
    ]
  }
];
const CATEGORY_NAMES = {jerky:'Cecina jerky',fruit:'Frutas y rollitos',vegetable:'Vegetales',flower:'Flores y tisanas',citrus:'Cítricos',pantry:'Sazonadores y cocina',bundle:'Paquetes'};
const occasionMap = {jerky:['snack'],fruit:['snack'],vegetable:['snack'],flower:['bebidas'],citrus:['bebidas'],pantry:['cocina'],bundle:['snack','regalo']};
const gramsFor = label => label === '1 kg' ? 1000 : label === '4 × 25 g' ? 100 : label === '3 × 50 g' ? 150 : Number.parseInt(label,10);
const newPhotos = {
 citrus:{src:'assets/citricos-editorial.jpg',position:'center',scale:1,alt:'Selección ilustrativa de cítricos deshidratados'},
 pantry:{src:'assets/sazonadores-editorial.jpg',position:'center',scale:1,alt:'Selección ilustrativa de jitomate y sazonadores'},
 fruit:{src:'assets/rollitos-editorial.jpg',position:'center',scale:1,alt:'Selección ilustrativa de rollitos y frutas deshidratadas'},
 flower:{src:'assets/product-flowers-temp.webp',position:'center',scale:1,alt:'Selección ilustrativa de flores para infusión'},
 bundle:{src:'assets/product-fruits-temp.webp',position:'center',scale:1,alt:'Selección ilustrativa de frutas deshidratadas'}
};
const originalUses = {jerky:'Disfrútalo directamente como botana. Sigue las indicaciones de conservación y la fecha del envase.',fruit:'Disfruta la fruta directamente, sola o para acompañar tu botana favorita.',vegetable:'Listos para acompañar una pausa o compartir como botana.',flower:'Prepara una infusión siguiendo las indicaciones del envase y cuela antes de servir.'};
const products = [...PRODUCTS.map((product,index) => ({...product,rank:20+index,isNew:false,use:originalUses[product.category],tags:[product.category === 'flower' ? 'Para infusión' : /chile|picante|sal/.test(product.description) ? 'Sazonado' : 'Sabor natural'],photo:{...PRODUCT_PHOTOS[product.id],alt:'Selección ilustrativa de '+CATEGORY_NAMES[product.category].toLowerCase()}})),...ADDITIONS.map(product => ({...product,availability:'Sobre pedido',isNew:true,bg:'#fff0d7',color:'#542311',photo:newPhotos[product.category]}))].map(product => ({...product,occasions:occasionMap[product.category],variants:Object.entries(product.prices).map(([label,price]) => ({label,price,grams:gramsFor(label)}))}));
globalThis.DeshidrataditosCatalog = {products,categories:CATEGORY_NAMES};
})();
