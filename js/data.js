const MAGIC5V_DATA = {
  imageWidth: 2977,
  imageHeight: 2105,
  cells: {
    1:[1115,1770],
    2:[1390,1790],
    3:[1600,1745],
    4:[1805,1655],
    5:[2010,1570],
    6:[2150,1400],
    7:[2210,1190],
    8:[2190,985],
    9:[2185,785],
    10:[2110,620],
    11:[2000,455],
    12:[1830,335],
    13:[1600,300],
    14:[1395,320],
    15:[1185,390],
    16:[1030,535],
    17:[880,710],
    18:[770,880],
    19:[740,1060],
    20:[790,1250],
    21:[930,1285],
    22:[950,1115],
    23:[985,925],
    24:[1055,750],
    25:[1220,560],
    26:[1445,505],
    27:[1675,555],
    28:[1870,690],
    29:[1975,850],
    30:[2015,1060],
    31:[1940,1255],
    32:[1810,1475],
    33:[1600,1575],
    34:[1410,1575],
    35:[1230,1505],
    36:[1135,1365],
    37:[1435,1405],
    38:[1625,1340],
    39:[1760,1180],
    40:[1800,970],
    41:[1700,765],
    42:[1540,720],
    43:[1340,750],
    44:[1160,935],
    45:[1120,1125],
    46:[1285,1265],
    47:[1305,1040],
    48:[1485,965],
    49:[1655,1025],
    50:[1600,1150]
  },
  rules: {
    logoCells: [1,5,9,15,20,28,32,36,43,50],
    diceCells: {16:26,26:16},
    colorJumps: {6:12,12:6,18:24,24:18,21:29,29:21},
    loseTurn: [19,30,35,40],
    returnStart: 44,
    death: 47,
    finish: 50
  },
  questions: [
    {
        "cell": 2,
        "title": "Inicio de la aventura",
        "text": "¿En qué comarca se ambienta este juego?",
        "answers": [
            "Somontano",
            "Cinco Villas",
            "Monegros",
            "Ribagorza"
        ],
        "correct": 1
    },
    {
        "cell": 3,
        "title": "Ardisa",
        "text": "¿Qué descubrieron los duendes excavadores?",
        "answers": [
            "Un mapa de carreteras",
            "Piedras preciosas",
            "Una torre romana",
            "Un lago subterráneo"
        ],
        "correct": 1
    },
    {
        "cell": 4,
        "title": "Aventura",
        "text": "¿Cuál es el objetivo principal de la partida?",
        "answers": [
            "Llegar a la casilla 50 con número exacto",
            "Caer siempre en la muerte",
            "No responder preguntas",
            "Volver a la salida"
        ],
        "correct": 0
    },
    {
        "cell": 7,
        "title": "Marracos",
        "text": "¿Qué animal mágico ayuda a Graciela?",
        "answers": [
            "Un águila",
            "Un caballo",
            "Un lobo",
            "Un gato"
        ],
        "correct": 2
    },
    {
        "cell": 8,
        "title": "Sierra de Luna",
        "text": "¿Qué criatura protagoniza “Tras las huellas del dragón”?",
        "answers": [
            "Una sirena",
            "Un dragón",
            "Un hada",
            "Un duende"
        ],
        "correct": 1
    },
    {
        "cell": 10,
        "title": "El Conde",
        "text": "¿Quién persigue la magia en los cuentos?",
        "answers": [
            "El Conde Arcipreste de Trabuquete",
            "Un juglar",
            "Un mercader",
            "Un pastor"
        ],
        "correct": 0
    },
    {
        "cell": 11,
        "title": "Castejón de Valdejasa",
        "text": "Los grifones de Castejón eran mitad gallina y mitad...",
        "answers": [
            "Pez",
            "Cabra",
            "Lobo",
            "Serpiente"
        ],
        "correct": 1
    },
    {
        "cell": 13,
        "title": "Biota",
        "text": "¿Qué tenía de especial Poyaz?",
        "answers": [
            "Una corona encantada",
            "Dos alas de oro",
            "Un único ojo mágico",
            "Una cola de sirena"
        ],
        "correct": 2
    },
    {
        "cell": 14,
        "title": "Lobera de Onsella",
        "text": "¿Qué seres sabios aparecen en el Bosque Sagrado?",
        "answers": [
            "Ents",
            "Piratas",
            "Robots",
            "Centauros de nieve"
        ],
        "correct": 0
    },
    {
        "cell": 17,
        "title": "El Frago",
        "text": "¿Dónde vivían muchas sirenas de las Cinco Villas?",
        "answers": [
            "En volcanes",
            "En pozos, ríos y estanques",
            "En cuevas de hielo",
            "En torres de piedra"
        ],
        "correct": 1
    },
    {
        "cell": 22,
        "title": "Fuencalderas",
        "text": "Trin y Tran eran...",
        "answers": [
            "Dos elfos",
            "Dos sirenas",
            "Gigantes gemelos",
            "Dos caballeros"
        ],
        "correct": 2
    },
    {
        "cell": 23,
        "title": "Luesia",
        "text": "¿Qué objeto podía volar gracias a una pócima?",
        "answers": [
            "Una alfombra",
            "Una silla",
            "Una mesa",
            "Una carreta"
        ],
        "correct": 0
    },
    {
        "cell": 25,
        "title": "Navardún",
        "text": "¿Qué guiaba el Camino de las Estrellas?",
        "answers": [
            "Las campanas",
            "Las estrellas",
            "Las monedas",
            "Las hojas secas"
        ],
        "correct": 1
    },
    {
        "cell": 27,
        "title": "Tauste",
        "text": "¿Qué seres protegían el Santuario durante la noche?",
        "answers": [
            "Gigantes de nieve",
            "Sirenas",
            "Elfos nocturnos",
            "Duendes mineros"
        ],
        "correct": 2
    },
    {
        "cell": 31,
        "title": "Luna",
        "text": "¿Qué elemento mágico se licuaba en los lagares rupestres?",
        "answers": [
            "La luna",
            "El fuego",
            "La lluvia",
            "El oro"
        ],
        "correct": 0
    },
    {
        "cell": 33,
        "title": "Valpalmas",
        "text": "¿Qué criaturas aparecen en la Ruta de las Hadas?",
        "answers": [
            "Tiburones",
            "Hadas canteras",
            "Centauros",
            "Gnomos marineros"
        ],
        "correct": 1
    },
    {
        "cell": 34,
        "title": "Erla",
        "text": "Valentia era una...",
        "answers": [
            "Dragona",
            "Reina humana",
            "Lamia",
            "Bruja de fuego"
        ],
        "correct": 2
    },
    {
        "cell": 37,
        "title": "Patrimonio mágico",
        "text": "¿Qué mezcla este juego con la fantasía?",
        "answers": [
            "Patrimonio y rutas reales",
            "Coches de carreras",
            "Ciencia ficción espacial",
            "Deportes de nieve"
        ],
        "correct": 0
    },
    {
        "cell": 38,
        "title": "Meta",
        "text": "¿Qué ocurre si te pasas de la casilla 50?",
        "answers": [
            "Retrocedes lo que te sobra",
            "Ganas igual",
            "Vuelves a la 1",
            "Pierdes la partida"
        ],
        "correct": 0
    },
    {
        "cell": 39,
        "title": "Preguntas",
        "text": "Si fallas una pregunta, ¿qué pasa?",
        "answers": [
            "Ganas automáticamente",
            "Pierdes el siguiente turno",
            "Vuelves a tirar",
            "Retrocedes 10 casillas"
        ],
        "correct": 1
    },
    {
        "cell": 42,
        "title": "Magia recuperada",
        "text": "¿Qué desbloquean los jugadores durante la aventura?",
        "answers": [
            "Armas modernas",
            "Cuentos y retos",
            "Vehículos",
            "Códigos bancarios"
        ],
        "correct": 1
    },
    {
        "cell": 45,
        "title": "La comarca",
        "text": "¿Cuántos municipios aparecen en la publicación de cuentos?",
        "answers": [
            "5",
            "12",
            "50",
            "33"
        ],
        "correct": 3
    },
    {
        "cell": 46,
        "title": "Guardianes",
        "text": "¿Qué actitud es importante ante los seres mágicos?",
        "answers": [
            "Respeto",
            "Ruido",
            "Codicia",
            "Burlas"
        ],
        "correct": 0
    },
    {
        "cell": 48,
        "title": "El final",
        "text": "¿Qué se recupera al completar la aventura?",
        "answers": [
            "Un coche",
            "La magia de las Cinco Villas",
            "Un tesoro pirata",
            "Una receta"
        ],
        "correct": 1
    },
    {
        "cell": 49,
        "title": "Último reto",
        "text": "¿Qué necesita un explorador para disfrutar estos cuentos?",
        "answers": [
            "Pereza",
            "Enfado",
            "Curiosidad",
            "Miedo"
        ],
        "correct": 2
    }
]
};
