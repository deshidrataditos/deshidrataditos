/* Catalog data, shared by all views and checkout. */
(() => {
"use strict";
const PRODUCTS = [
  {
    "id": "jerky-res",
    "name": "Jerky de res",
    "category": "jerky",
    "type": "Cecina tipo jerky",
    "description": "Carne de res con finas hierbas y sal ahumada. Picante bajo a intermedio.",
    "availability": "Disponible",
    "prices": {
      "50 g": 89,
      "100 g": 169,
      "250 g": 399,
      "1 kg": 1490
    },
    "bg": "#ead2bc",
    "color": "#542311"
  },
  {
    "id": "jerky-conejo",
    "name": "Jerky de conejo",
    "category": "jerky",
    "type": "Cecina tipo jerky",
    "description": "Carne de conejo con finas hierbas y sal ahumada. Elaboración sobre pedido.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 119,
      "100 g": 219,
      "250 g": 519,
      "1 kg": 1990
    },
    "bg": "#e7ddd3",
    "color": "#6b442c"
  },
  {
    "id": "fruta-temporada",
    "name": "Frutas de temporada",
    "category": "fruit",
    "type": "Selección de temporada",
    "description": "Una selección que cambia con la cosecha y la disponibilidad local. Escríbenos para conocer la fruta, la preparación y las presentaciones de esta temporada.",
    "availability": "Según temporada",
    "quoteOnly": true,
    "variants": [
      {
        "label": "Selección de temporada",
        "price": null,
        "grams": null
      }
    ],
    "tags": [
      "De temporada",
      "Selección variable"
    ],
    "use": "Consulta qué fruta estamos preparando y cómo disfrutarla. Confirmamos la selección y el precio antes de tu pedido.",
    "bg": "#f7d45d",
    "color": "#b64a1d"
  },
  {
    "id": "fresa-chile",
    "name": "Fresa con chile",
    "category": "fruit",
    "type": "Fruta deshidratada",
    "description": "Notas dulces y ácidas con chile en polvo y una pizca de sal.",
    "availability": "Disponible",
    "prices": {
      "50 g": 49,
      "100 g": 89,
      "250 g": 209,
      "1 kg": 749
    },
    "bg": "#f5b1a6",
    "color": "#a62622"
  },
  {
    "id": "manzana-canela",
    "name": "Manzana con canela",
    "category": "fruit",
    "type": "Fruta deshidratada",
    "description": "Crujiente, aromática y naturalmente dulce. Una opción sin picante.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 35,
      "100 g": 59,
      "250 g": 139,
      "1 kg": 499
    },
    "bg": "#ead39f",
    "color": "#75401e"
  },
  {
    "id": "platano-macho",
    "name": "Plátano macho deshidratado",
    "tags": ["Sin chile", "Dulzor natural"],
    "category": "fruit",
    "type": "Fruta deshidratada",
    "description": "Rodajas de plátano macho maduro, de sabor concentrado y dulzor natural. Una botana sin chile para disfrutar donde quieras.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 29,
      "100 g": 49,
      "250 g": 109,
      "1 kg": 399
    },
    "bg": "#f1dc7f",
    "color": "#725819"
  },
  {
    "id": "betabel",
    "name": "Chips de betabel",
    "category": "vegetable",
    "type": "Vegetal deshidratado",
    "description": "Láminas crujientes con chile en polvo, sal y un color naturalmente intenso.",
    "availability": "Disponible",
    "prices": {
      "50 g": 39,
      "100 g": 69,
      "250 g": 159,
      "1 kg": 549
    },
    "bg": "#d7a0b3",
    "color": "#7a193d"
  },
  {
    "id": "jicama",
    "name": "Jícama deshidratada",
    "category": "vegetable",
    "type": "Vegetal deshidratado",
    "description": "Ligera y crujiente, con chile en polvo y sal. Picante bajo a intermedio.",
    "availability": "Disponible",
    "prices": {
      "50 g": 39,
      "100 g": 69,
      "250 g": 159,
      "1 kg": 549
    },
    "bg": "#efe6d5",
    "color": "#6f5135"
  },
  {
    "id": "pepino",
    "name": "Pepino deshidratado",
    "category": "vegetable",
    "type": "Vegetal deshidratado",
    "description": "Una botana fresca de sabor con chile en polvo y sal.",
    "availability": "Disponible",
    "prices": {
      "50 g": 39,
      "100 g": 69,
      "250 g": 159,
      "1 kg": 549
    },
    "bg": "#b8db9d",
    "color": "#295f2d"
  },
  {
    "id": "camote",
    "name": "Chips de camote",
    "category": "vegetable",
    "type": "Vegetal deshidratado",
    "description": "Dulzor natural, textura crujiente y un toque de chile con sal.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 35,
      "100 g": 59,
      "250 g": 139,
      "1 kg": 499
    },
    "bg": "#efb17d",
    "color": "#8d3e19"
  },
  {
    "id": "mix-vegetales",
    "name": "Mix de vegetales",
    "category": "vegetable",
    "type": "Selección mixta",
    "description": "Una mezcla para probar diferentes sabores y texturas en una sola bolsa.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 39,
      "100 g": 69,
      "250 g": 159,
      "1 kg": 549
    },
    "bg": "#c7dc75",
    "color": "#3b6728"
  },
  {
    "id": "tisana-floral",
    "name": "Tisana floral",
    "category": "flower",
    "type": "Mezcla para infusión",
    "description": "Mezcla aromática de flores deshidratadas para preparar una bebida caliente o fría.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 55,
      "100 g": 99,
      "250 g": 229,
      "1 kg": 849
    },
    "bg": "#f2b7c6",
    "color": "#8b3151"
  },
  {
    "id": "flor-jamaica",
    "name": "Flor de jamaica",
    "category": "flower",
    "type": "Flor deshidratada",
    "description": "De sabor ácido y color intenso, ideal para preparar infusiones calientes o agua fresca.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 35,
      "100 g": 59,
      "250 g": 129,
      "1 kg": 449
    },
    "bg": "#d895aa",
    "color": "#731d3d"
  },
  {
    "id": "manzanilla",
    "name": "Manzanilla",
    "category": "flower",
    "type": "Flor para infusión",
    "description": "Flores deshidratadas de aroma suave y delicado para preparar una infusión reconfortante.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 45,
      "100 g": 79,
      "250 g": 179,
      "1 kg": 649
    },
    "bg": "#f4df80",
    "color": "#7a5d16"
  },
  {
    "id": "petalos-rosa",
    "name": "Pétalos de rosa",
    "category": "flower",
    "type": "Flor para infusión",
    "description": "Pétalos deshidratados de aroma floral, pensados para tisanas y mezclas especiales.",
    "availability": "Sobre pedido",
    "prices": {
      "50 g": 65,
      "100 g": 119,
      "250 g": 279,
      "1 kg": 999
    },
    "bg": "#efb0bc",
    "color": "#862f48"
  }
];
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
    "description": "Tres bolsas para conocer nuestros sabores: fresa con chile, plátano macho deshidratado y manzana con canela.",
    "prices": {
      "3 × 50 g": 99
    },
    "tags": [
      "Tres sabores",
      "Para regalar",
      "150 g en total"
    ],
    "use": "Incluye tres bolsas separadas de 50 g: una de fresa con chile y dos opciones sin picante, plátano macho y manzana con canela.",
    "rank": 4,
    "bundle": [
      {
        "id": "fresa-chile",
        "label": "50 g",
        "quantity": 1
      },
      {
        "id": "platano-macho",
        "label": "50 g",
        "quantity": 1
      },
      {
        "id": "manzana-canela",
        "label": "50 g",
        "quantity": 1
      }
    ]
  },
  {
    "id": "tomate-cherry",
    "name": "Tomate cherry deshidratado",
    "category": "pantry",
    "type": "Ingrediente de cocina",
    "description": "Tomates cherry de sabor concentrado, en presentación seca. Elige natural o con finas hierbas para acompañar pastas, pizzas y ensaladas.",
    "quoteOnly": true,
    "variants": [
      {
        "label": "Natural",
        "price": null,
        "grams": null
      },
      {
        "label": "Finas hierbas",
        "price": null,
        "grams": null
      }
    ],
    "tags": [
      "Natural o finas hierbas",
      "Cocina"
    ],
    "use": "Añade durante la cocción o rehidrata la porción que vayas a utilizar siguiendo las indicaciones del envase. Consulta gramaje y precio de tu opción favorita.",
    "rank": 3
  },
  {
    "id": "ajo-hojuelas",
    "name": "Ajo deshidratado en hojuelas",
    "category": "pantry",
    "type": "Ingrediente de cocina",
    "description": "Láminas de ajo de sabor intenso para dar un toque especial a pastas, sopas, salsas y marinados. Elaboración sobre pedido.",
    "quoteOnly": true,
    "variants": [
      {
        "label": "Hojuelas",
        "price": null,
        "grams": null
      }
    ],
    "tags": [
      "Aromático",
      "Cocina"
    ],
    "use": "Agrégalas durante la preparación o tritúralas para sazonar a tu gusto. Consulta presentación, precio y disponibilidad.",
    "rank": 10
  }
];
const CATEGORY_NAMES = {jerky:'Cecina jerky',fruit:'Frutas de temporada y favoritos',vegetable:'Vegetales',flower:'Flores y tisanas',citrus:'Cítricos',pantry:'Sazonadores y cocina',bundle:'Paquetes'};
const occasionMap = {jerky:['snack'],fruit:['snack'],vegetable:['snack'],flower:['bebidas'],citrus:['bebidas'],pantry:['cocina'],bundle:['snack','regalo']};
const gramsFor = label => label === '1 kg' ? 1000 : label === '4 × 25 g' ? 100 : label === '3 × 50 g' ? 150 : Number.parseInt(label,10);
const originalUses = {jerky:'Disfrútalo directamente como botana. Sigue las indicaciones de conservación y la fecha del envase.',fruit:'Disfruta la fruta directamente, sola o para acompañar tu botana favorita.',vegetable:'Listos para acompañar una pausa o compartir como botana.',flower:'Prepara una infusión siguiendo las indicaciones del envase y cuela antes de servir.'};
// Ingredient references come from the existing catalog, not a validated label.
const PRODUCT_DETAILS = {
  "jerky-res": {
    "ingredients": [
      "Carne de res",
      "Finas hierbas",
      "Sal ahumada"
    ],
    "note": "Confirma la mezcla de hierbas y los condimentos del marinado, incluido el picante, antes de pedir."
  },
  "jerky-conejo": {
    "ingredients": [
      "Carne de conejo",
      "Finas hierbas",
      "Sal ahumada"
    ],
    "note": "Confirma la mezcla de hierbas y los demás condimentos del marinado antes de pedir."
  },
  "fruta-temporada": {
    "ingredients": [
      "Fruta deshidratada de temporada"
    ],
    "note": "La fruta, los condimentos y la presentación se confirman según la cosecha y el lote disponible. La imagen muestra una selección de referencia."
  },
  "fresa-chile": {
    "ingredients": [
      "Fresa deshidratada",
      "Chile en polvo",
      "Sal"
    ],
    "note": "Consulta la composición del chile utilizado en el lote."
  },
  "manzana-canela": {
    "ingredients": [
      "Manzana deshidratada",
      "Canela"
    ],
    "note": ""
  },
  "platano-macho": {
    "ingredients": [
      "Plátano macho maduro deshidratado"
    ],
    "note": ""
  },
  "betabel": {
    "ingredients": [
      "Betabel deshidratado",
      "Chile en polvo",
      "Sal"
    ],
    "note": "Consulta la composición del chile utilizado en el lote."
  },
  "jicama": {
    "ingredients": [
      "Jícama deshidratada",
      "Chile en polvo",
      "Sal"
    ],
    "note": "Consulta la composición del chile utilizado en el lote."
  },
  "pepino": {
    "ingredients": [
      "Pepino deshidratado",
      "Chile en polvo",
      "Sal"
    ],
    "note": "Consulta la composición del chile utilizado en el lote."
  },
  "camote": {
    "ingredients": [
      "Camote deshidratado",
      "Chile en polvo",
      "Sal"
    ],
    "note": "Consulta la composición del chile utilizado en el lote."
  },
  "mix-vegetales": {
    "ingredients": [
      "Mezcla de vegetales deshidratados"
    ],
    "note": "Los vegetales y condimentos de la mezcla se confirman por lote. La imagen es una sugerencia de variedad; no define el contenido de tu bolsa."
  },
  "tisana-floral": {
    "ingredients": [
      "Mezcla de flores deshidratadas para infusión"
    ],
    "note": "Confirma las flores que componen la mezcla del lote antes de pedir. La imagen representa una mezcla floral de referencia."
  },
  "flor-jamaica": {
    "ingredients": [
      "Flor de jamaica deshidratada"
    ],
    "note": ""
  },
  "manzanilla": {
    "ingredients": [
      "Flores de manzanilla deshidratadas"
    ],
    "note": ""
  },
  "petalos-rosa": {
    "ingredients": [
      "Pétalos de rosa deshidratados"
    ],
    "note": ""
  },
  "naranja-rodajas": {
    "ingredients": [
      "Naranja deshidratada en rodajas, con cáscara"
    ],
    "note": ""
  },
  "limon-rodajas": {
    "ingredients": [
      "Limón deshidratado en rodajas, con cáscara"
    ],
    "note": ""
  },
  "toronja-rodajas": {
    "ingredients": [
      "Toronja deshidratada en rodajas, con cáscara"
    ],
    "note": ""
  },
  "tisana-jamaica-pina": {
    "ingredients": [
      "Flor de jamaica deshidratada",
      "Piña deshidratada"
    ],
    "note": ""
  },
  "tisana-manzana-naranja": {
    "ingredients": [
      "Manzana deshidratada",
      "Canela",
      "Naranja deshidratada"
    ],
    "note": ""
  },
  "sazonador-hierbas": {
    "ingredients": [
      "Ajo deshidratado",
      "Cebolla deshidratada",
      "Hierbas"
    ],
    "note": "La selección de hierbas y la presencia de sal u otros condimentos se confirman por lote."
  },
  "sazonador-chile-citricos": {
    "ingredients": [
      "Chile",
      "Cítricos deshidratados"
    ],
    "note": "Consulta los tipos de chile y cítricos, así como la presencia de sal u otros condimentos del lote."
  },
  "rollito-guayaba": {
    "ingredients": [
      "Guayaba",
      "Canela"
    ],
    "note": "Confirma la formulación del rollito si necesitas conocer endulzantes u otros ingredientes."
  },
  "jitomate-hierbas": {
    "ingredients": [
      "Jitomate deshidratado",
      "Hierbas"
    ],
    "note": "Presentación seca. Confirma la mezcla de hierbas, la sal y los demás condimentos del lote."
  },
  "tomate-cherry": {
    "ingredients": [
      "Tomate cherry deshidratado"
    ],
    "note": "Elige natural o finas hierbas para consultar los ingredientes de esa opción.",
    "variants": {
      "Natural": {
        "ingredients": [
          "Tomate cherry deshidratado"
        ],
        "note": "Opción natural en presentación seca. Confirma la formulación completa del lote."
      },
      "Finas hierbas": {
        "ingredients": [
          "Tomate cherry deshidratado",
          "Finas hierbas"
        ],
        "note": "Confirma la selección de hierbas y la presencia de sal u otros condimentos de esta opción."
      }
    }
  },
  "ajo-hojuelas": {
    "ingredients": [
      "Ajo deshidratado en hojuelas"
    ],
    "note": ""
  },
  "pack-degustacion": {
    "ingredients": [],
    "note": "Las tres bolsas se entregan por separado. Revisa la etiqueta de cada sabor para conocer su formulación completa."
  }
};
const STORAGE_GUIDANCE = {
  "fruit": {
    "closed": "Mantén el empaque bien cerrado en un lugar fresco, seco y protegido de la luz directa.",
    "opened": "Cierra la bolsa después de cada porción. Si no es resellable, utiliza un recipiente limpio, seco y hermético para proteger la textura."
  },
  "vegetable": {
    "closed": "Guarda el empaque cerrado en un lugar fresco y seco, alejado del sol y de fuentes de calor.",
    "opened": "Cierra herméticamente después de servir. Evita la humedad y usa manos o utensilios secos para conservar la textura."
  },
  "flower": {
    "closed": "Conserva la mezcla seca en su empaque cerrado, protegida de la luz, la humedad y los olores intensos.",
    "opened": "Usa una cuchara limpia y seca y vuelve a cerrar bien el empaque. Conserva por separado la mezcla seca y la bebida preparada."
  },
  "citrus": {
    "closed": "Mantén las rodajas en su empaque cerrado, en un lugar fresco, seco y sin exposición directa al sol.",
    "opened": "Saca únicamente las rodajas que utilizarás y cierra bien. Evita el vapor de las bebidas y no devuelvas rodajas húmedas a la bolsa."
  },
  "pantry": {
    "closed": "Almacena en un lugar fresco, seco y protegido de la luz, lejos de la estufa y de fuentes de vapor.",
    "opened": "Extrae la porción con un utensilio limpio y seco; cierra de inmediato. No espolvorees directamente sobre una olla humeante."
  },
  "jerky": {
    "closed": "Sigue la temperatura de conservación indicada en la etiqueta del lote. Si requiere refrigeración, mantenla también durante el traslado.",
    "opened": "Vuelve a cerrar el empaque y respeta la indicación de refrigeración y el plazo de consumo de la etiqueta. Si falta esta información, consúltanos antes de consumir."
  },
  "bundle": {
    "closed": "Conserva las tres bolsas cerradas en un lugar fresco, seco y protegido de la luz directa.",
    "opened": "Abre cada sabor por separado y vuelve a cerrar su bolsa después de servir. Sigue las indicaciones y la fecha de cada empaque."
  }
};
const PHOTO_DESCRIPTIONS = {
  "jerky-res": "Tiras de jerky de res con fibras visibles, finas hierbas y sal ahumada en plato marfil",
  "jerky-conejo": "Tiras finas de jerky de conejo con hierbas en plato marfil",
  "fruta-temporada": "Selección de referencia de frutas deshidratadas; la fruta disponible cambia según la temporada",
  "fresa-chile": "Láminas de fresa deshidratada con chile y sal en plato marfil",
  "manzana-canela": "Rodajas de manzana deshidratada con canela en plato marfil",
  "platano-macho": "Rodajas de plátano macho maduro deshidratado, con bordes dorados y centros oscuros naturales",
  "betabel": "Láminas onduladas de betabel deshidratado de color borgoña con chile y sal",
  "jicama": "Láminas finas de jícama deshidratada con chile y sal en plato marfil",
  "pepino": "Rodajas de pepino deshidratado con cáscara verde y chile en plato marfil",
  "camote": "Láminas de camote deshidratado de color naranja con chile y sal",
  "mix-vegetales": "Selección de referencia de vegetales deshidratados; la composición se confirma por lote",
  "tisana-floral": "Mezcla de referencia de flores secas para tisana en plato marfil",
  "flor-jamaica": "Cálices secos de jamaica de color borgoña intenso en plato marfil",
  "manzanilla": "Flores secas de manzanilla con centros dorados y pétalos claros en plato marfil",
  "petalos-rosa": "Pétalos secos de rosa con bordes rizados y tonos rosa y borgoña",
  "naranja-rodajas": "Rodajas deshidratadas de naranja con pulpa ámbar y cáscara anaranjada",
  "limon-rodajas": "Rodajas deshidratadas de limón con cáscara verde oliva y pulpa translúcida",
  "toronja-rodajas": "Rodajas deshidratadas de toronja rosada con pulpa rojiza y corteza clara",
  "tisana-jamaica-pina": "Mezcla seca de jamaica y trozos de piña deshidratada en plato marfil",
  "tisana-manzana-naranja": "Mezcla seca de manzana, canela y naranja para infusión en plato marfil",
  "sazonador-hierbas": "Mezcla seca de ajo, cebolla y hierbas con hojuelas claras y verdes",
  "sazonador-chile-citricos": "Sazonador de chile rojo con pequeños fragmentos de cítricos deshidratados",
  "rollito-guayaba": "Láminas de fruta de guayaba con canela enrolladas en espiral",
  "jitomate-hierbas": "Mitades de jitomate deshidratado con hierbas, en presentación seca",
  "tomate-cherry": "Mitades pequeñas de tomate cherry deshidratado en presentación natural seca",
  "ajo-hojuelas": "Hojuelas finas de ajo deshidratado color marfil en un plato de cerámica",
  "pack-degustacion": "Tres platos separados con fresa con chile, plátano macho y manzana con canela"
};
const STORAGE_OVERRIDES = {
  "rollito-guayaba": {
    "closed": "Mantén el rollito en su empaque cerrado, en un lugar fresco y seco, protegido del sol y del calor.",
    "opened": "Vuelve a envolver la porción restante y guárdala en un recipiente limpio, seco y hermético. Evita la humedad y sigue las indicaciones de su etiqueta."
  },
  "jitomate-hierbas": {
    "closed": "Conserva el jitomate seco en su bolsa cerrada, protegido de la luz, el calor y la humedad.",
    "opened": "Cierra bien después de servir. Rehidrata solo la porción que vayas a cocinar; guarda el producto restante seco y separado de los alimentos ya preparados."
  },
  "tomate-cherry": {
    "closed": "Mantén el tomate cherry seco en su empaque cerrado, en un lugar fresco, seco y protegido de la luz.",
    "opened": "Vuelve a cerrar herméticamente. Si rehidratas una porción, úsala en la preparación y no la devuelvas a la bolsa de producto seco."
  },
  "ajo-hojuelas": {
    "closed": "Conserva las hojuelas en su empaque cerrado, en un lugar fresco, seco y protegido de la luz.",
    "opened": "Usa utensilios secos y cierra herméticamente para conservar el aroma. Mantén el ajo separado de productos de aroma delicado y alejado del vapor."
  }
};
const PRODUCT_TAGS = {"manzana-canela":["Sin chile","Con canela"],"mix-vegetales":["Selección variable","Para compartir"],"fresa-chile":["Con chile","Dulce y ácido"],"jerky-res":["Finas hierbas","Sal ahumada"],"jerky-conejo":["Finas hierbas","Sal ahumada"]};
const products = [
  ...PRODUCTS.map((product,index) => ({
    ...product,rank:product.id === 'fruta-temporada' ? 0 : 20+index,isNew:false,
    use:product.use || originalUses[product.category],
    tags:PRODUCT_TAGS[product.id] || product.tags || [product.category === 'flower' ? 'Para infusión' : /chile|picante|sal/.test(product.description) ? 'Sazonado' : 'Sabor natural']
  })),
  ...ADDITIONS.map(product => ({...product,availability:'Sobre pedido',isNew:true,bg:'#fff0d7',color:'#542311'}))
].map(product => ({...product,foodDetails:PRODUCT_DETAILS[product.id],storage:STORAGE_OVERRIDES[product.id] || STORAGE_GUIDANCE[product.category],photo:{src:"assets/products/"+product.id+"-studio.webp",thumbnail:"assets/products/"+product.id+"-studio-480.webp",position:"center",scale:1,alt:PHOTO_DESCRIPTIONS[product.id]+"; imagen ilustrativa generada con IA"},occasions:occasionMap[product.category],variants:product.variants || Object.entries(product.prices).map(([label,price]) => ({label,price,grams:gramsFor(label)}))}));
for (const product of products.filter(item => item.bundle)) {
  product.foodDetails.ingredients = product.bundle.map(item => {
    const component = products.find(candidate => candidate.id === item.id);
    return component.name + ': ' + component.foodDetails.ingredients.join(', ') + '.';
  });
}
globalThis.DeshidrataditosCatalog = {products,categories:CATEGORY_NAMES};
})();
