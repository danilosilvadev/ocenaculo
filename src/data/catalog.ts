import { referenceCities, SERTAO_RING } from "@/data/geoNotes";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  note: string;
  /** Region labels sit on a wash. Points keep a dot. */
  kind?: "point" | "region";
  /** Degrees. A faint disc for a neighborhood or a direction, not a city. */
  spotRadius?: number;
  /** Drawn on the map, left out of the caption list. */
  quiet?: boolean;
}

export interface MapRoute {
  from: string;
  to: string;
  label: string;
}

export interface LiteraryMapData {
  caption: string;
  center: [number, number];
  /** Projection scale tuned at `baseWidth` pixels. */
  scale: number;
  baseWidth?: number;
  frameHeight?: number;
  points: MapPoint[];
  routes?: MapRoute[];
  showStates?: boolean;
  showRiver?: boolean;
  /** Closed ring, [lng, lat]. */
  highlight?: [number, number][];
}

export interface BookProfile {
  slug: string;
  title: string;
  author: string;
  year: string;
  country: string;
  flag: "ru" | "gb" | "br";
  genre: string;
  pitch: string;
  cover: { cloth: string; foil: string };
  chapterId: string;
  chapterNumeral: string;
  chapterLabel: string;
  kicker: string;
  /** What we count as the first chapter, said on the book page. */
  openingNote: string;
  originalLabel: string | null;
  translationNote: string | null;
  citation: string;
  electronic: string;
  sourceUrl: string;
  continueUrl: string;
  continueLabel: string;
  authorContext: string[];
  historicalMoment: string[];
  literaryPlace: string[];
  contextMap: LiteraryMapData;
  settingMap: LiteraryMapData;
}

export const books: BookProfile[] = [
  {
    slug: "o-idiota",
    title: "O Idiota",
    author: "Fiódor Dostoiévski",
    year: "1868–69",
    country: "Rússia",
    flag: "ru",
    genre: "Romance",
    pitch:
      "O primeiro capítulo é o vagão da estrada de ferro Petersburgo–Varsóvia. A margem lê como a frase apresenta dois homens antes do nome.",
    cover: { cloth: "hsl(350 45% 28%)", foil: "hsl(42 45% 62%)" },
    chapterId: "parte-1-capitulo-1",
    chapterNumeral: "I",
    chapterLabel: "O vagão",
    kicker: "Parte primeira",
    openingNote:
      "Há um só capítulo nesta margem: o primeiro da parte I, a manhã no vagão. O resto do romance fica na edição citada.",
    originalLabel: "russo",
    translationNote: "Tradução do Cenáculo a partir do original russo",
    citation:
      "F. M. Dostoiévski, Идиот, in Собрание сочинений в 15 томах, т. 6. Leningrado: Nauka, filial de Leningrado, 1989, pp. 5–616.",
    electronic:
      "Publicação eletrônica: Русская виртуальная библиотека, versão 3.0, 27 de janeiro de 2017. O capítulo I está em 28-01.htm.",
    sourceUrl: "https://rvb.ru/dostoevski/01text/vol6/28-01.htm",
    continueUrl: "https://rvb.ru/dostoevski/01text/vol6/28.htm",
    continueLabel: "Continuar na Русская виртуальная библиотека",
    authorContext: [
      "Dostoiévski nasce em Moscou em 1821 e morre em Petersburgo em 1881. Entre setembro de 1867 e janeiro de 1869 escreve O Idiota fora da Rússia, sobretudo em Genebra e, no fim, em Florença, com a mulher Anna Grigórievna, sob a pressão dos prazos do Русский вестник.",
      "Numa carta de janeiro de 1868 à sobrinha Sófia Ivanova, formula a ambição do livro: figurar um homem positivamente belo. O príncipe não entra por essa frase. Entra num vagão de terceira, de capuz suíço.",
    ],
    historicalMoment: [
      "O romance sai em folhetim no Русский вестник em 1868 e 1869. A Rússia ainda digere a reforma camponesa de 1861; o dinheiro novo e a ferrovia já organizam o encontro deste capítulo.",
      "A estrada de ferro Petersburgo–Varsóvia liga a capital ao oeste. O trem do capítulo aproxima-se de Petersburgo numa manhã de fim de novembro, no degelo.",
    ],
    literaryPlace: [
      "O Idiota é o romance em que Dostoiévski tenta um herói bom sem o tornar insípido. O vagão é o dispositivo: dois desconhecidos, um narrador que já sabe demais, e um nome — Nastássia Filíppovna — plantado antes de a pessoa aparecer.",
    ],
    contextMap: {
      caption: "Onde ele viveu e onde o livro foi feito e publicado.",
      center: [20, 50],
      scale: 420,
      points: [
        { id: "moscou", lat: 55.756, lng: 37.617, label: "Moscou", note: "Nascimento, 1821. O folhetim sai no Русский вестник, editado em Moscou." },
        { id: "petersburgo", lat: 59.934, lng: 30.335, label: "Petersburgo", note: "Cidade do capítulo e da morte do autor, em 1881." },
        { id: "genebra", lat: 46.204, lng: 6.143, label: "Genebra", note: "Começa o romance em setembro de 1867." },
        { id: "florenca", lat: 43.769, lng: 11.255, label: "Florença", note: "Termina o romance em janeiro de 1869." },
      ],
    },
    settingMap: {
      caption: "O vagão aproxima-se de Petersburgo pela linha de Varsóvia. Pskov é de onde Rogójin diz vir.",
      center: [28, 57],
      scale: 780,
      points: [
        { id: "petersburgo", lat: 59.934, lng: 30.335, label: "Petersburgo", note: "O trem chega. A margem não sai da estação neste capítulo." },
        { id: "varsovia", lat: 52.23, lng: 21.012, label: "Varsóvia", note: "O outro extremo da linha. O capítulo não se passa lá; nomeia a estrada." },
        { id: "pskov", lat: 57.819, lng: 28.332, label: "Pskov", note: "Rogójin volta de Pskov para uma herança." },
      ],
      routes: [{ from: "varsovia", to: "petersburgo", label: "estrada de ferro Petersburgo–Varsóvia" }],
    },
  },
  {
    slug: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    year: "1818",
    country: "Inglaterra",
    flag: "gb",
    genre: "Romance",
    pitch:
      "A abertura verdadeira não é o capítulo de Victor. É a Carta I: Walton escreve à irmã de São Petersburgo, antes de Arcangel e do gelo.",
    cover: { cloth: "hsl(200 28% 24%)", foil: "hsl(42 40% 70%)" },
    chapterId: "carta-1",
    chapterNumeral: "I",
    chapterLabel: "Carta I",
    kicker: "Carta primeira",
    openingNote:
      "A edição de 1818 abre com quatro cartas de Robert Walton. A Carta I é o começo do livro. O Capítulo I, o de Victor, vem depois. Esta margem fica na carta, e diz isso.",
    originalLabel: "inglês",
    translationNote: "Tradução do Cenáculo a partir do inglês de 1818",
    citation:
      "Mary Wollstonecraft Shelley, Frankenstein; or, The Modern Prometheus. Londres: Lackington, Hughes, Harding, Mavor & Jones, 1818. Texto da reimpressão fotográfica transcrita no Project Gutenberg, eBook 41445.",
    electronic:
      "Usamos o texto de 1818, não o de 1831. A revisão de 1831 reescreve passagens das cartas e acrescenta a introdução em que Shelley conta a gênese do livro. A Carta I de 1818 é a abertura que os primeiros leitores encontraram: uma voz que ainda não é a de Victor.",
    sourceUrl: "https://www.gutenberg.org/ebooks/41445",
    continueUrl: "https://www.gutenberg.org/ebooks/41445",
    continueLabel: "Continuar no Project Gutenberg (1818)",
    authorContext: [
      "Mary Wollstonecraft Shelley nasce em Londres em 30 de agosto de 1797, filha de Mary Wollstonecraft e William Godwin, e morre em Londres em 1º de fevereiro de 1851.",
      "Começa Frankenstein no verão de 1816, em Genebra, na companhia de Percy Shelley, Byron e Polidori. Termina o romance na Inglaterra. A primeira edição sai anônima, em três volumes, no dia 1º de janeiro de 1818, pela Lackington, em Londres. Ela tem vinte anos.",
    ],
    historicalMoment: [
      "1816 é o ano sem verão, depois da erupção do Tambora. As viagens ao norte — a passagem do polo, o mistério do íman — são o horizonte dos navegadores que Walton cita sem nomear.",
      "A carta está datada de São Petersburgo, 11 de dezembro de 17—. O século fica cortado de propósito. Ele ainda não partiu: Arcangel é um plano de quinze dias ou três semanas, e o polo é um desejo.",
    ],
    literaryPlace: [
      "Frankenstein é um romance de molduras. Walton escreve a Margaret; mais tarde ouvirá Victor; Victor ouvirá a criatura. Nesta primeira carta só existe a moldura de fora: um homem que pede à irmã que aprove a ambição dele.",
    ],
    contextMap: {
      caption: "Londres, onde nasce e onde o livro sai em 1818; Genebra, onde o começa em 1816.",
      center: [8, 48],
      scale: 520,
      points: [
        { id: "londres", lat: 51.507, lng: -0.128, label: "Londres", note: "Nascimento, 1797. Publicação anônima, 1º de janeiro de 1818." },
        { id: "genebra", lat: 46.204, lng: 6.143, label: "Genebra", note: "Verão de 1816. A narrativa começa a ser escrita aqui, não em Petersburgo." },
      ],
    },
    settingMap: {
      caption: "A carta é escrita em Petersburgo. Arcangel é a próxima cidade. O Ártico ainda não foi alcançado: o pin de cima é a direção.",
      center: [36, 71],
      scale: 270,
      frameHeight: 400,
      points: [
        { id: "petersburgo", lat: 59.934, lng: 30.335, label: "São Petersburgo", note: "Data e lugar da Carta I. Ele caminha nas ruas e sente a brisa do norte." },
        { id: "arcangel", lat: 64.54, lng: 40.543, label: "Arcangel", note: "Pretende partir para lá em quinze dias ou três semanas e alugar um navio." },
        { id: "artico", lat: 78.2, lng: 40, label: "Rumo ao Ártico", note: "Meta declarada, não um lugar desta carta. O pin marca a direção, não uma ancoragem." },
      ],
      routes: [{ from: "petersburgo", to: "arcangel", label: "estrada de posta" }],
    },
  },
  {
    slug: "bras-cubas",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    year: "1881",
    country: "Brasil",
    flag: "br",
    genre: "Romance",
    pitch:
      "Antes do capítulo numerado, o livro já brinca: a dedicatória ao verme e o «Ao leitor». O capítulo I é o óbito. A margem fica nesse limiar.",
    cover: { cloth: "hsl(152 22% 24%)", foil: "hsl(42 48% 64%)" },
    chapterId: "ao-leitor-e-capitulo-1",
    chapterNumeral: "I",
    chapterLabel: "Óbito do autor",
    kicker: "Abertura",
    openingNote:
      "O primeiro capítulo numerado é o I, «Óbito do autor». A dedicatória e o «Ao leitor» vêm antes, na edição de 1881, e entram aqui porque o livro começa a sua piada antes da numeração. A grafia é a da Typographia Nacional: Catumby, melancholia, escripto.",
    originalLabel: null,
    translationNote: null,
    citation: "Machado de Assis, Memorias Posthumas de Braz Cubas. Rio de Janeiro: Typographia Nacional, 1881.",
    electronic:
      "Texto da Wikisource em português, transcrição dessa edição: dedicatória, «Ao leitor» (pp. v–vi) e capítulo I (pp. 9–12).",
    sourceUrl: "https://pt.wikisource.org/wiki/Mem%C3%B3rias_P%C3%B3stumas_de_Br%C3%A1s_Cubas/I",
    continueUrl: "https://pt.wikisource.org/wiki/Mem%C3%B3rias_P%C3%B3stumas_de_Br%C3%A1s_Cubas",
    continueLabel: "Continuar na Wikisource",
    authorContext: [
      "Machado de Assis nasce no Rio de Janeiro em 21 de junho de 1839 e morre na mesma cidade em 29 de setembro de 1908. Em 1881 é funcionário público, casado com Carolina, e já publicou os romances da primeira fase, de Ressurreição a Iaiá Garcia.",
      "Memórias Póstumas sai em volume pela Typographia Nacional, no Rio, em 1881. Ele tem quarenta e dois anos. O óbito fictício do narrador é numa sexta-feira de agosto de 1869; o livro impresso é de 1881. As duas datas não se misturam.",
    ],
    historicalMoment: [
      "1881 é ainda o Império, a década que antecede a abolição. O romance não abre nessa cena política. Abre num homem morto que escolhe por onde começar, e numa chácara do Catumbi.",
      "O Catumbi é um bairro do Rio, junto ao centro. A chácara não tem um endereço de rua nesta página. O pin marca o bairro que o texto nomeia, na grafia Catumby.",
    ],
    literaryPlace: [
      "Este é o livro em que Machado solta o narrador do chão. Um defunto escreve. O modelo que ele mesmo cita no «Ao leitor» é a forma livre de Sterne, Lamb ou Xavier de Maistre, com «rabugens de pessimismo». A dedicatória ao verme já é o programa: o livro pertence a quem o rói.",
    ],
    contextMap: {
      caption: "Rio de Janeiro: nascimento, vida, e a edição de 1881.",
      center: [-43.2, -22.5],
      scale: 1800,
      points: [
        { id: "rio", lat: -22.903, lng: -43.188, label: "Rio de Janeiro", note: "Nascimento, morte, e a Typographia Nacional, que imprime o livro em 1881." },
      ],
    },
    settingMap: {
      caption: "O óbito é no Catumbi. O centro e Niterói mostram a baía. O Ilissos entra só como símile das cegonhas, não como cenário.",
      center: [-43.17, -22.93],
      scale: 22000,
      frameHeight: 300,
      points: [
        { id: "catumbi", lat: -22.917, lng: -43.196, label: "Catumbi", note: "«Minha bella chacara de Catumby.» Sexta-feira de agosto de 1869, duas da tarde.", spotRadius: 0.03 },
        { id: "centro", ...referenceCities.centro, note: "O centro do Rio, para situar o bairro do outro lado do morro.", quiet: true },
        { id: "niteroi", ...referenceCities.niteroi, note: "Na outra margem da baía de Guanabara.", quiet: true },
      ],
    },
  },
  {
    slug: "vidas-secas",
    title: "Vidas Secas",
    author: "Graciliano Ramos",
    year: "1938",
    country: "Brasil",
    flag: "br",
    genre: "Romance",
    pitch:
      "O primeiro capítulo chama-se Mudança. Uma família atravessa a catinga atrás de duas manchas verdes. A margem lê a frase seca, não um resumo da seca.",
    cover: { cloth: "hsl(28 32% 28%)", foil: "hsl(42 35% 68%)" },
    chapterId: "mudanca",
    chapterNumeral: "I",
    chapterLabel: "Mudança",
    kicker: "Capítulo primeiro",
    openingNote:
      "Não há prólogo. O romance começa em «Mudança». O capítulo não nomeia município nem ano. O pin do mapa é uma região, dita como região.",
    originalLabel: null,
    translationNote: null,
    citation:
      "Graciliano Ramos, Vidas Sêcas. 2ª ed. São Paulo: Livraria José Olympio Editora, 1947, pp. 7–17. A primeira edição é do Rio de Janeiro, José Olympio, 1938.",
    electronic:
      "Transcrição da Wikisource em português, a partir da 2ª edição de 1947, com a grafia dessa impressão (juàzeiros, sêca, bôca). Graciliano Ramos morre em 1953; no Brasil a obra entra em domínio público em 1º de janeiro de 2024, pela Lei 9.610/98. A Wikisource adverte que noutros países o prazo pode ser outro.",
    sourceUrl: "https://pt.wikisource.org/wiki/Vidas_S%C3%AAcas/Mudan%C3%A7a",
    continueUrl: "https://pt.wikisource.org/wiki/Vidas_S%C3%AAcas",
    continueLabel: "Continuar na Wikisource",
    authorContext: [
      "Graciliano Ramos nasce em Quebrangulo, Alagoas, em 27 de outubro de 1892, e morre no Rio de Janeiro em 20 de março de 1953. Antes de Vidas Secas já publicou São Bernardo (1934) e Angústia (1936). Foi prefeito de Palmeira dos Índios e, em 1936, esteve preso.",
      "Vidas Secas sai em 1938, no Rio, pela Livraria José Olympio, com capa de Santa Rosa. A margem usa a segunda edição, de 1947, porque é a transcrição pública que dá para conferir página a página. Não é um texto reescrito.",
    ],
    historicalMoment: [
      "O livro sai no primeiro ano do Estado Novo. O sertão nordestino da década carrega as secas do começo dos anos 1930. O capítulo não marca o ano da viagem: marca a catinga, o rio seco, a fazenda abandonada.",
      "Fabiano, sinha Vitória, os dois meninos e a cachorra Baleia não recebem sobrenome nem vila. A frase trata gente e bicho no mesmo plano.",
    ],
    literaryPlace: [
      "Vidas Secas é o romance em que Graciliano encosta a narração na pouca língua das personagens sem falar por elas em discurso de comício. «Mudança» abre com a paisagem, não com um herói, e fecha o desejo de chuva no condicional: a fazenda renasceria.",
    ],
    contextMap: {
      caption: "Alagoas, onde nasce; o Rio, onde o livro é publicado em 1938. Quebrangulo e Palmeira dos Índios cabem no mesmo agreste.",
      center: [-40, -15],
      scale: 780,
      frameHeight: 360,
      showStates: true,
      points: [
        { id: "quebrangulo", lat: -9.329, lng: -36.471, label: "Quebrangulo", note: "Nascimento, 1892, no agreste de Alagoas." },
        { id: "palmeira", lat: -9.408, lng: -36.628, label: "Palmeira dos Índios", note: "Foi prefeito aqui. Não é o cenário de «Mudança»." },
        { id: "rio", lat: -22.903, lng: -43.188, label: "Rio de Janeiro", note: "José Olympio publica o romance em 1938. Morte do autor, 1953." },
      ],
    },
    settingMap: {
      caption: "O capítulo não nomeia a vila. A mancha é o sertão nordestino, região aproximada, entre Alagoas, Pernambuco e a Bahia. O traço azul é o São Francisco.",
      center: [-38.4, -9.6],
      scale: 2100,
      frameHeight: 340,
      showStates: true,
      showRiver: true,
      highlight: SERTAO_RING,
      points: [
        {
          id: "sertao",
          lat: -9.4,
          lng: -37.2,
          label: "Sertão",
          kind: "region",
          note: "Região aproximada. A catinga, o rio seco e a fazenda sem nome cabem neste chão, não num ponto de GPS.",
        },
        { id: "maceio", ...referenceCities.maceio, note: "Costa de Alagoas, fora da mancha.", quiet: true },
        { id: "recife", ...referenceCities.recife, note: "Costa de Pernambuco.", quiet: true },
        { id: "salvador", ...referenceCities.salvador, note: "Costa da Bahia.", quiet: true },
      ],
    },
  },
];

export function bookBySlug(slug: string | undefined) {
  return books.find((book) => book.slug === slug);
}
