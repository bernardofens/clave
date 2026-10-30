// Conteúdo de estudo em português: áreas, objetivos, aulas, trilhas, gêneros e medalhas.
// A estrutura (ids, links, exercícios ligados, cores) fica em src/data; aqui só o texto, por id.
// content.en.ts precisa ter as mesmas chaves e o mesmo número de itens em cada lista.
const ptContent = {
  areas: {
    ouvido: { name: 'Ouvido', short: 'Percepção musical', why: 'Reconhecer intervalos, escalas e acordes de ouvido é o que permite tirar músicas, improvisar e tocar com outras pessoas.' },
    tecnica: { name: 'Técnica', short: 'Precisão e agilidade', why: 'Digitação certa e mãos soltas tiram o instrumento do caminho, para você pensar na música e não nos dedos. Sempre com metrônomo.' },
    mapeamento: { name: 'Mapeamento', short: 'Topografia do instrumento', why: 'Saber onde cada nota está e enxergar a geometria dos intervalos no braço ou no teclado dá fluência para tocar o que você ouve.' },
    harmonia: { name: 'Harmonia', short: 'Teoria e harmonia', why: 'Internalizar as notas das escalas e os acordes de cada campo harmônico é o que transforma decoreba em escolha musical.' },
    ritmo: { name: 'Ritmo', short: 'Tempo interno', why: 'Precisão rítmica e "time" são o que faz a música soar bem, mesmo com poucas notas.' },
    leitura: { name: 'Leitura', short: 'Partitura em tempo real', why: 'Ler partitura abre o repertório escrito. Treinamos separado as notas e o ritmo, e depois juntamos.' },
  },
  instruments: {
    piano: 'Piano / teclado',
    violao: 'Violão / guitarra',
    baixo: 'Baixo',
  },
  profileKinds: {
    iniciante: { name: 'Começando agora', desc: 'Quero aprender do zero, com um caminho guiado.' },
    hobby: { name: 'Toco por prazer', desc: 'Quero evoluir no meu ritmo, sem pressão.' },
    musico: { name: 'Músico', desc: 'Toco sério e quero lapidar áreas específicas.' },
    produtor: { name: 'Produtor', desc: 'Faço música no computador e quero mais teoria e ouvido.' },
  },
  goals: {
    improvisar: 'Improvisar com fluidez',
    harmonia: 'Criar progressões bonitas',
    'tirar-de-ouvido': 'Tirar músicas de ouvido',
    'ler-partitura': 'Ler partitura',
    agilidade: 'Ganhar agilidade',
    jazz: 'Tocar jazz',
    repertorio: 'Aprender músicas',
  },
  modules: {
    'ler-partitura': {
      title: 'Como ler partitura',
      why: 'A partitura é a forma mais precisa de guardar e trocar música. Ler bem abre o repertório escrito e acelera o estudo de qualquer peça.',
      how: 'Separe notas e ritmo. Cinco minutos de "Qual nota é essa?" por dia e um gerador de leitura com poucas notas já mudam tudo em duas semanas.',
      steps: [
        'A pauta tem 5 linhas e 4 espaços. Notas mais altas ficam mais para cima.',
        'A clave de sol marca o Sol na 2ª linha. A partir dela, linhas e espaços seguem em ordem: Mi, Fá, Sol, Lá, Si, Dó, Ré, Mi, Fá.',
        'A clave de fá marca o Fá na 4ª linha e é usada para sons graves (baixo, mão esquerda do piano).',
        'Linhas suplementares estendem a pauta para cima e para baixo. O Dó central fica na primeira linha suplementar abaixo da clave de sol.',
        'Comece com 3 notas no gerador de leitura e só aumente quando estiver lendo sem parar.',
      ],
    },
    'leitura-ritmica': {
      title: 'Leitura rítmica',
      why: 'Ritmo errado estraga a nota certa. Ler ritmo separado das alturas deixa o cérebro livre para entender as figuras e o pulso.',
      how: 'Batuque na perna junto com o gerador rítmico, em loop. Comece com duas figuras, depois entre com uma célula nova e alterne com semínimas.',
      steps: [
        'Semínima vale um tempo. Mínima, dois. Semibreve, quatro.',
        'Duas colcheias dividem o tempo em dois; quatro semicolcheias, em quatro.',
        'Pausas são silêncios com a mesma duração das figuras.',
        'Contratempo é tocar na segunda metade do tempo, depois de uma pausa de colcheia.',
        'Conte em voz alta: "1 e 2 e 3 e 4 e". Para semicolcheias: "1 e a e".',
      ],
    },
    'mapear-braco': {
      title: 'Mapear o braço',
      why: 'Fluência é saber exatamente qual nota você está tocando a qualquer momento. Isso nem sempre é óbvio no braço; precisa ser treinado.',
      how: 'Fixe uma região (casas 0 a 5) até acertar sem pensar. Depois vá para a próxima (5 a 9). Sempre falando o nome da nota enquanto toca.',
      steps: [
        'As cordas soltas do violão são Mi, Lá, Ré, Sol, Si, Mi. No baixo, Mi, Lá, Ré, Sol.',
        'Cada casa sobe um semitom. Na casa 12 as notas se repetem uma oitava acima.',
        'Entre Mi e Fá, e entre Si e Dó, só há um semitom. Nas outras notas vizinhas, dois.',
        'Intervalos têm sempre o mesmo desenho no braço (exceto quando cruzam a corda Si no violão). Aprenda os desenhos.',
      ],
    },
    'escala-maior': {
      title: 'Escala maior',
      why: 'Quase toda a harmonia ocidental é explicada a partir da escala maior: modos, acordes e campo harmônico saem dela.',
      how: 'Escolha uma tonalidade por semana. Solfeje a escala devagar, dizendo o nome e o grau de cada nota, e só então toque.',
      steps: [
        'A escala maior segue a fórmula tom, tom, semitom, tom, tom, tom, semitom.',
        'Os graus são numerados de 1 a 7. O 1º é a tônica.',
        'Cada tonalidade maior tem uma armadura própria: Sol maior tem Fá♯; Fá maior tem Si♭.',
        'Todo tom maior tem um relativo menor, que começa no 6º grau e usa as mesmas notas.',
      ],
    },
    'modos-gregos': {
      title: 'Modos gregos',
      why: 'Os modos são a escala maior começando de outro grau. Cada um tem uma cor própria e casa com um acorde específico.',
      how: 'Toque cada modo sobre um drone da tônica (ferramenta Solfejar e tocar) e escute a nota que o diferencia.',
      steps: [
        'Jônio (1º), dórico (2º), frígio (3º), lídio (4º), mixolídio (5º), eólio (6º) e lócrio (7º).',
        'Dórico é o menor com 6ª maior. Frígio é o menor com 2ª menor.',
        'Lídio é o maior com 4ª aumentada. Mixolídio é o maior com 7ª menor.',
        'No backing track, o Clave sugere qual modo usar em cada acorde.',
      ],
    },
    acordes: {
      title: 'Arpejos e formação de acordes',
      why: 'Saber as notas de cada acorde é o que permite improvisar "nas mudanças" e criar progressões com intenção.',
      how: 'Para cada grau da tonalidade da semana, toque o arpejo do acorde em todas as posições até a casa 5.',
      steps: [
        'Tríades empilham terças: 1, 3, 5. Maior tem terça maior; menor, terça menor.',
        'Diminuto tem terça menor e quinta diminuta. Aumentado, terça maior e quinta aumentada.',
        'Tétrades acrescentam a 7ª: 7M, 7 (dominante), m7, m7(♭5).',
        'O campo harmônico maior em tétrades é: I7M, ii m7, iii m7, IV7M, V7, vi m7, vii m7(♭5).',
      ],
    },
    'harmonia-funcional': {
      title: 'Harmonia funcional',
      why: 'Entender função (tônica, subdominante, dominante) explica por que progressões funcionam e abre caminho para rearmonizar.',
      how: 'Analise os graus das músicas que você toca. Use o backing track para testar substituições.',
      steps: [
        'Tônica: I, iii, vi. Subdominante: IV, ii. Dominante: V, vii.',
        'O relativo menor usa as mesmas notas do maior e tem a mesma armadura.',
        'Dominantes secundários preparam outros graus: VI7 prepara o ii.',
        'O sub5 troca o V7 pelo acorde dominante meio tom acima da tônica (♭II7).',
      ],
    },
    ouvido: {
      title: 'Treino de ouvido',
      why: 'Reconhecer intervalos, acordes e escalas de ouvido é o que permite tirar música, improvisar e conversar com outros músicos.',
      how: 'Dez minutos por dia, de preferência sem instrumento (no ônibus funciona). Comece com poucos intervalos e vá acrescentando.',
      steps: [
        'Associe intervalos a músicas que você conhece (a 4ª justa é o começo de muitos hinos).',
        'Cante o que ouvir antes de responder. Solfejar é o atalho entre o ouvido e o instrumento.',
        'Células pentatônicas treinam frases curtas, como as que você usa ao improvisar.',
      ],
    },
    tecnica: {
      title: 'Técnica com metrônomo',
      why: 'Precisão vem antes de velocidade. Exercícios simples com metrônomo deixam as mãos soltas e o tempo firme.',
      how: 'Cinco minutos de aquecimento antes de qualquer sessão com instrumento. Suba 4 bpm só quando sair limpo três vezes.',
      steps: [
        'Use a digitação certa: um dedo por casa no violão e no baixo.',
        'Tônica, quinta e oitava cruzando cordas treina a mão direita e o mapa do braço ao mesmo tempo.',
        'A "aranha" (1-2-3-4) trabalha independência dos dedos.',
        'Sempre solfeje o que toca: saber as notas é parte da técnica.',
      ],
    },
  },
  roadmaps: {
    geral: {
      title: 'Fundamentos', sub: 'o caminho geral',
      notes: {
        'ler-partitura': 'Notas na pauta', 'leitura-ritmica': 'Figuras e pulso', 'mapear-braco': 'Casas 0 a 5', 'escala-maior': 'Uma tonalidade por semana',
        ouvido: 'Intervalos básicos', acordes: 'Tríades e tétrades', 'modos-gregos': 'Cores dos modos', 'harmonia-funcional': 'Função e rearmonização',
      },
    },
    jazz: {
      title: 'Jazz', sub: 'sétimas e improviso',
      notes: { acordes: 'Tétrades em todas as tonalidades', 'modos-gregos': 'Dórico e mixolídio', 'harmonia-funcional': 'ii–V–I e sub5', ouvido: 'Células pentatônicas' },
    },
    erudito: {
      title: 'Erudito', sub: 'leitura e repertório',
      notes: { 'ler-partitura': 'Duas claves', 'leitura-ritmica': 'Semicolcheias e pontuadas', 'escala-maior': 'Armaduras até 4 acidentes', tecnica: 'Escalas com metrônomo' },
    },
  },
  genres: {
    samba: {
      name: 'Samba', sub: 'partido-alto', desc: 'Levada de pandeiro, tamborim e cavaquinho.',
      sides: { a: 'Lado A · pandeiro', b: 'Lado B · harmonia' },
      tracks: { levada: 'A levada básica', toques: 'Polegar, ponta e tapa', partido: 'Partido-alto', teleco: 'Teleco-teco', progressao: 'I – VI7 – ii – V7', secundarios: 'Dominantes secundários' },
    },
    jazz: {
      name: 'Jazz', sub: 'sétimas e improviso', desc: 'Walking bass, acordes com sétima e escalas de blues.',
      sides: { a: 'Lado A · harmonia', b: 'Lado B · improviso' },
      tracks: { tetrades: 'Tétrades do campo maior', iivi: 'O ii–V–I', sub5: 'Sub5', blues: 'Blues de 12 compassos', celulas: 'Células pentatônicas' },
    },
    rock: {
      name: 'Rock', sub: 'power chords', desc: 'Riffs, palhetada alternada e abafado.',
      sides: { a: 'Lado A · mão direita' },
      tracks: { palhetada: 'Palhetada alternada', power: 'Power chords no braço', pop: 'Pop rock: I–V–vi–IV' },
    },
    classico: {
      name: 'Clássico', sub: 'leitura e postura', desc: 'Partitura, arco e afinação.',
      sides: { a: 'Lado A · leitura' },
      tracks: { ode: 'Ode à Alegria', armaduras: 'Armaduras', escalas: 'Escalas maiores' },
    },
    hiphop: {
      name: 'Hip-hop', sub: 'flow no tempo', desc: 'Batida, rima e respiração.',
      sides: { a: 'Lado A · tempo' },
      tracks: { semis: 'Semicolcheias no pulso', ritmo: 'Que ritmo é esse?' },
    },
    forro: {
      name: 'Forró', sub: 'baião e xote', desc: 'Sanfona, zabumba e triângulo.',
      sides: { a: 'Lado A · baião' },
      tracks: { mixolidio: 'O mixolídio do baião', levada: 'Levada de baião' },
    },
  },
  tonality: {
    groups: { notas: '1. Posições das notas', acordes: '2. Acordes do campo harmônico', relativo: '3. Relativo menor', repertorio: '4. Leitura e repertório' },
    steps: {
      solfejar: 'Solfeje a escala com calma, dizendo o nome e o grau de cada nota.',
      'graus-quiz': 'Flash quiz: qual nota é o 3º grau? Dó é qual grau?',
      posicoes: 'Toque todas as posições das notas da escala até a casa 5.',
      'arpejos-5': 'Toque os arpejos de cada grau, da corda solta até a casa 5, alternando nome e grau.',
      'arpejos-8': 'Repita na posição seguinte (casas 5 a 8).',
      'penta-maior': 'Toque a pentatônica maior nessa tonalidade.',
      relativa: 'Migre para a relativa menor. Quais notas viraram quais graus?',
      'menor-blues': 'Toque a escala menor, a pentatônica menor e a escala blues.',
      leitura: 'Use o gerador de leitura nessa tonalidade, com figura constante.',
      musica: 'Tire uma música nessa tonalidade: solfeje, toque a melodia, depois tônicas e terças com o backing track.',
    },
  },
  badges: {
    'primeira-sessao': { name: 'Primeira sessão', desc: 'Concluiu a primeira atividade.' },
    sequencia: { name: '7 dias seguidos', desc: 'Estudou uma semana sem falhar.' },
    ouvido: { name: 'Ouvido afiado', desc: '50 acertos em exercícios de ouvido.' },
    leitor: { name: 'Leitor', desc: '100 notas lidas certo na pauta.' },
    braco: { name: 'Mapa do braço', desc: '100 acertos no braço do instrumento.' },
    improviso: { name: 'Improvisador', desc: '30 minutos tocando sobre backing tracks.' },
  },
};

export default ptContent;
