// Conteúdo de estudo. Cada módulo segue a mesma receita:
// por que importa, como encaixar nos estudos, um tutorial curto e os exercícios/ferramentas.
import type { AreaId } from './areas';

export interface Module {
  id: string;
  area: AreaId;
  title: string;
  why: string;
  how: string;
  steps: string[];
  exercises: string[];
  tools: string[];
  premium?: boolean;
}

export const MODULES: Module[] = [
  {
    id: 'ler-partitura', area: 'leitura', title: 'Como ler partitura',
    why: 'A partitura é a forma mais precisa de guardar e trocar música. Ler bem abre o repertório escrito e acelera o estudo de qualquer peça.',
    how: 'Separe notas e ritmo. Cinco minutos de "Qual nota é essa?" por dia e um gerador de leitura com poucas notas já mudam tudo em duas semanas.',
    steps: [
      'A pauta tem 5 linhas e 4 espaços. Notas mais altas ficam mais para cima.',
      'A clave de sol marca o Sol na 2ª linha. A partir dela, linhas e espaços seguem em ordem: Mi, Fá, Sol, Lá, Si, Dó, Ré, Mi, Fá.',
      'A clave de fá marca o Fá na 4ª linha e é usada para sons graves (baixo, mão esquerda do piano).',
      'Linhas suplementares estendem a pauta para cima e para baixo. O Dó central fica na primeira linha suplementar abaixo da clave de sol.',
      'Comece com 3 notas no gerador de leitura e só aumente quando estiver lendo sem parar.',
    ],
    exercises: ['pauta-nota', 'pauta-construir', 'pauta-armadura'], tools: ['leitura'],
  },
  {
    id: 'leitura-ritmica', area: 'ritmo', title: 'Leitura rítmica',
    why: 'Ritmo errado estraga a nota certa. Ler ritmo separado das alturas deixa o cérebro livre para entender as figuras e o pulso.',
    how: 'Batuque na perna junto com o gerador rítmico, em loop. Comece com duas figuras, depois entre com uma célula nova e alterne com semínimas.',
    steps: [
      'Semínima vale um tempo. Mínima, dois. Semibreve, quatro.',
      'Duas colcheias dividem o tempo em dois; quatro semicolcheias, em quatro.',
      'Pausas são silêncios com a mesma duração das figuras.',
      'Contratempo é tocar na segunda metade do tempo, depois de uma pausa de colcheia.',
      'Conte em voz alta: "1 e 2 e 3 e 4 e". Para semicolcheias: "1 e a e".',
    ],
    exercises: ['ritmo-ouvido'], tools: ['ritmo', 'leitura', 'metronomo'],
  },
  {
    id: 'mapear-braco', area: 'mapeamento', title: 'Mapear o braço',
    why: 'Fluência é saber exatamente qual nota você está tocando a qualquer momento. Isso nem sempre é óbvio no braço; precisa ser treinado.',
    how: 'Fixe uma região (casas 0 a 5) até acertar sem pensar. Depois vá para a próxima (5 a 9). Sempre falando o nome da nota enquanto toca.',
    steps: [
      'As cordas soltas do violão são Mi, Lá, Ré, Sol, Si, Mi. No baixo, Mi, Lá, Ré, Sol.',
      'Cada casa sobe um semitom. Na casa 12 as notas se repetem uma oitava acima.',
      'Entre Mi e Fá, e entre Si e Dó, só há um semitom. Nas outras notas vizinhas, dois.',
      'Intervalos têm sempre o mesmo desenho no braço (exceto quando cruzam a corda Si no violão). Aprenda os desenhos.',
    ],
    exercises: ['braco-nota', 'braco-ache', 'braco-intervalo', 'acorde-visual'], tools: [],
  },
  {
    id: 'escala-maior', area: 'harmonia', title: 'Escala maior',
    why: 'Quase toda a harmonia ocidental é explicada a partir da escala maior: modos, acordes e campo harmônico saem dela.',
    how: 'Escolha uma tonalidade por semana. Solfeje a escala devagar, dizendo o nome e o grau de cada nota, e só então toque.',
    steps: [
      'A escala maior segue a fórmula tom, tom, semitom, tom, tom, tom, semitom.',
      'Os graus são numerados de 1 a 7. O 1º é a tônica.',
      'Cada tonalidade maior tem uma armadura própria: Sol maior tem Fá♯; Fá maior tem Si♭.',
      'Todo tom maior tem um relativo menor, que começa no 6º grau e usa as mesmas notas.',
    ],
    exercises: ['pauta-escala', 'quiz-teoria', 'ouvido-escala'], tools: ['tonalidade'],
  },
  {
    id: 'modos-gregos', area: 'harmonia', title: 'Modos gregos',
    why: 'Os modos são a escala maior começando de outro grau. Cada um tem uma cor própria e casa com um acorde específico.',
    how: 'Toque cada modo sobre um drone da tônica (ferramenta Ambiente) e escute a nota que o diferencia.',
    steps: [
      'Jônio (1º), dórico (2º), frígio (3º), lídio (4º), mixolídio (5º), eólio (6º) e lócrio (7º).',
      'Dórico é o menor com 6ª maior. Frígio é o menor com 2ª menor.',
      'Lídio é o maior com 4ª aumentada. Mixolídio é o maior com 7ª menor.',
      'No backing track, o Clave sugere qual modo usar em cada acorde.',
    ],
    exercises: ['quiz-teoria', 'ouvido-escala'], tools: ['backing', 'ambiente'],
  },
  {
    id: 'acordes', area: 'harmonia', title: 'Arpejos e formação de acordes',
    why: 'Saber as notas de cada acorde é o que permite improvisar "nas mudanças" e criar progressões com intenção.',
    how: 'Para cada grau da tonalidade da semana, toque o arpejo do acorde em todas as posições até a casa 5.',
    steps: [
      'Tríades empilham terças: 1, 3, 5. Maior tem terça maior; menor, terça menor.',
      'Diminuto tem terça menor e quinta diminuta. Aumentado, terça maior e quinta aumentada.',
      'Tétrades acrescentam a 7ª: 7M, 7 (dominante), m7, m7(♭5).',
      'O campo harmônico maior em tétrades é: I7M, ii m7, iii m7, IV7M, V7, vi m7, vii m7(♭5).',
    ],
    exercises: ['pauta-acorde', 'teclado-acorde', 'acorde-visual', 'ouvido-acorde'], tools: ['backing'],
  },
  {
    id: 'harmonia-funcional', area: 'harmonia', title: 'Harmonia funcional', premium: true,
    why: 'Entender função (tônica, subdominante, dominante) explica por que progressões funcionam e abre caminho para rearmonizar.',
    how: 'Analise os graus das músicas que você toca. Use o backing track para testar substituições.',
    steps: [
      'Tônica: I, iii, vi. Subdominante: IV, ii. Dominante: V, vii.',
      'O relativo menor usa as mesmas notas do maior e tem a mesma armadura.',
      'Dominantes secundários preparam outros graus: VI7 prepara o ii.',
      'O sub5 troca o V7 pelo acorde dominante meio tom acima da tônica (♭II7).',
    ],
    exercises: ['quiz-teoria'], tools: ['backing'],
  },
  {
    id: 'ouvido', area: 'ouvido', title: 'Treino de ouvido',
    why: 'Reconhecer intervalos, acordes e escalas de ouvido é o que permite tirar música, improvisar e conversar com outros músicos.',
    how: 'Dez minutos por dia, de preferência sem instrumento (no ônibus funciona). Comece com poucos intervalos e vá acrescentando.',
    steps: [
      'Associe intervalos a músicas que você conhece (a 4ª justa é o começo de muitos hinos).',
      'Cante o que ouvir antes de responder. Solfejar é o atalho entre o ouvido e o instrumento.',
      'Células pentatônicas treinam frases curtas, como as que você usa ao improvisar.',
    ],
    exercises: ['ouvido-intervalo', 'ouvido-acorde', 'ouvido-escala', 'ouvido-tecla', 'ouvido-celulas'], tools: ['ambiente'],
  },
  {
    id: 'tecnica', area: 'tecnica', title: 'Técnica com metrônomo',
    why: 'Precisão vem antes de velocidade. Exercícios simples com metrônomo deixam as mãos soltas e o tempo firme.',
    how: 'Cinco minutos de aquecimento antes de qualquer sessão com instrumento. Suba 4 bpm só quando sair limpo três vezes.',
    steps: [
      'Use a digitação certa: um dedo por casa no violão e no baixo.',
      'Tônica, quinta e oitava cruzando cordas treina a mão direita e o mapa do braço ao mesmo tempo.',
      'A "aranha" (1-2-3-4) trabalha independência dos dedos.',
      'Sempre solfeje o que toca: saber as notas é parte da técnica.',
    ],
    exercises: [], tools: ['tecnica', 'metronomo'],
  },
];
export const moduleById = Object.fromEntries(MODULES.map(m => [m.id, m])) as Record<string, Module>;

export interface Roadmap {
  id: string;
  title: string;
  sub: string;
  art: string;
  premium: boolean;
  steps: { module: string; note: string }[];
}
export const ROADMAPS: Roadmap[] = [
  {
    id: 'geral', title: 'Fundamentos', sub: 'o caminho geral', art: 'haltere', premium: false,
    steps: [
      { module: 'ler-partitura', note: 'Notas na pauta' }, { module: 'leitura-ritmica', note: 'Figuras e pulso' },
      { module: 'mapear-braco', note: 'Casas 0 a 5' }, { module: 'escala-maior', note: 'Uma tonalidade por semana' },
      { module: 'ouvido', note: 'Intervalos básicos' }, { module: 'acordes', note: 'Tríades e tétrades' },
      { module: 'modos-gregos', note: 'Cores dos modos' }, { module: 'harmonia-funcional', note: 'Função e rearmonização' },
    ],
  },
  {
    id: 'jazz', title: 'Jazz', sub: 'sétimas e improviso', art: 'genero-jazz', premium: true,
    steps: [
      { module: 'acordes', note: 'Tétrades em todas as tonalidades' }, { module: 'modos-gregos', note: 'Dórico e mixolídio' },
      { module: 'harmonia-funcional', note: 'ii–V–I e sub5' }, { module: 'ouvido', note: 'Células pentatônicas' },
    ],
  },
  {
    id: 'erudito', title: 'Erudito', sub: 'leitura e repertório', art: 'genero-classico', premium: true,
    steps: [
      { module: 'ler-partitura', note: 'Duas claves' }, { module: 'leitura-ritmica', note: 'Semicolcheias e pontuadas' },
      { module: 'escala-maior', note: 'Armaduras até 4 acidentes' }, { module: 'tecnica', note: 'Escalas com metrônomo' },
    ],
  },
];

export interface Genre {
  id: string;
  name: string;
  art: string;
  sub: string;
  cat: string;
  color: string;
  desc: string;
  sides: { side: string; tracks: { title: string; min: number; to?: string }[] }[];
}
export const GENRES: Genre[] = [
  {
    id: 'samba', name: 'Samba', art: 'genero-samba', sub: 'partido-alto', cat: 'CLV 1503', color: 'var(--mu)', desc: 'Levada de pandeiro, tamborim e cavaquinho.',
    sides: [
      { side: 'Lado A · pandeiro', tracks: [{ title: 'A levada básica', min: 6, to: '/ferramentas/leitura' }, { title: 'Polegar, ponta e tapa', min: 9 }, { title: 'Partido-alto', min: 10 }, { title: 'Teleco-teco', min: 8 }] },
      { side: 'Lado B · harmonia', tracks: [{ title: 'I – VI7 – ii – V7', min: 8, to: '/ferramentas/backing?p=samba' }, { title: 'Dominantes secundários', min: 10, to: '/estudar/harmonia-funcional' }] },
    ],
  },
  {
    id: 'jazz', name: 'Jazz', art: 'genero-jazz', sub: 'sétimas e improviso', cat: 'CLV 1501', color: 'var(--mu)', desc: 'Walking bass, acordes com sétima e escalas de blues.',
    sides: [
      { side: 'Lado A · harmonia', tracks: [{ title: 'Tétrades do campo maior', min: 8, to: '/estudar/acordes' }, { title: 'O ii–V–I', min: 10, to: '/ferramentas/backing?p=ii-v-i' }, { title: 'Sub5', min: 7, to: '/treinar/quiz-teoria' }] },
      { side: 'Lado B · improviso', tracks: [{ title: 'Blues de 12 compassos', min: 12, to: '/ferramentas/backing?p=blues' }, { title: 'Células pentatônicas', min: 8, to: '/treinar/ouvido-celulas' }] },
    ],
  },
  {
    id: 'rock', name: 'Rock', art: 'genero-rock', sub: 'power chords', cat: 'CLV 1502', color: 'var(--ve)', desc: 'Riffs, palhetada alternada e abafado.',
    sides: [{ side: 'Lado A · mão direita', tracks: [{ title: 'Palhetada alternada', min: 6, to: '/ferramentas/tecnica' }, { title: 'Power chords no braço', min: 8, to: '/treinar/braco-intervalo' }, { title: 'Pop rock: I–V–vi–IV', min: 8, to: '/ferramentas/backing?p=pop' }] }],
  },
  {
    id: 'classico', name: 'Clássico', art: 'genero-classico', sub: 'leitura e postura', cat: 'CLV 1504', color: 'var(--co)', desc: 'Partitura, arco e afinação.',
    sides: [{ side: 'Lado A · leitura', tracks: [{ title: 'Ode à Alegria', min: 8, to: '/ferramentas/leitura' }, { title: 'Armaduras', min: 6, to: '/treinar/pauta-armadura' }, { title: 'Escalas maiores', min: 8, to: '/treinar/pauta-escala' }] }],
  },
  {
    id: 'hiphop', name: 'Hip-hop', art: 'genero-hiphop', sub: 'flow no tempo', cat: 'CLV 1505', color: 'var(--cream)', desc: 'Batida, rima e respiração.',
    sides: [{ side: 'Lado A · tempo', tracks: [{ title: 'Semicolcheias no pulso', min: 6, to: '/ferramentas/leitura' }, { title: 'Que ritmo é esse?', min: 6, to: '/treinar/ritmo-ouvido' }] }],
  },
  {
    id: 'forro', name: 'Forró', art: 'genero-forro', sub: 'baião e xote', cat: 'CLV 1506', color: 'var(--ve)', desc: 'Sanfona, zabumba e triângulo.',
    sides: [{ side: 'Lado A · baião', tracks: [{ title: 'O mixolídio do baião', min: 8, to: '/estudar/modos-gregos' }, { title: 'Levada de baião', min: 6, to: '/ferramentas/backing?p=baiao' }] }],
  },
];
export const genreById = Object.fromEntries(GENRES.map(g => [g.id, g])) as Record<string, Genre>;

/** Passos do plano "internalizar uma tonalidade". */
export const TONALITY_STEPS: { id: string; group: string; text: string; to?: string }[] = [
  { id: 'solfejar', group: '1. Posições das notas', text: 'Solfeje a escala com calma, dizendo o nome e o grau de cada nota.', to: '/ferramentas/ambiente' },
  { id: 'graus-quiz', group: '1. Posições das notas', text: 'Flash quiz: qual nota é o 3º grau? Dó é qual grau?', to: '/treinar/quiz-teoria' },
  { id: 'posicoes', group: '1. Posições das notas', text: 'Toque todas as posições das notas da escala até a casa 5.' },
  { id: 'arpejos-5', group: '2. Acordes do campo harmônico', text: 'Toque os arpejos de cada grau, da corda solta até a casa 5, alternando nome e grau.', to: '/ferramentas/backing' },
  { id: 'arpejos-8', group: '2. Acordes do campo harmônico', text: 'Repita na posição seguinte (casas 5 a 8).' },
  { id: 'penta-maior', group: '2. Acordes do campo harmônico', text: 'Toque a pentatônica maior nessa tonalidade.' },
  { id: 'relativa', group: '3. Relativo menor', text: 'Migre para a relativa menor. Quais notas viraram quais graus?' },
  { id: 'menor-blues', group: '3. Relativo menor', text: 'Toque a escala menor, a pentatônica menor e a escala blues.' },
  { id: 'leitura', group: '4. Leitura e repertório', text: 'Use o gerador de leitura nessa tonalidade, com figura constante.', to: '/ferramentas/leitura' },
  { id: 'musica', group: '4. Leitura e repertório', text: 'Tire uma música nessa tonalidade: solfeje, toque a melodia, depois tônicas e terças com o backing track.' },
];
