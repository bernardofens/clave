// Textos das telas em português. É o idioma de referência: en.ts precisa ter exatamente as
// mesmas chaves (o TypeScript e src/i18n/i18n.test.ts conferem).
// {nome} marca um valor inserido na hora; { one, other } é texto que varia com a quantidade.
const pt = {
  nav: {
    main: 'Principal',
    home: 'Clave, início',
    today: 'Hoje',
    train: 'Treinar',
    study: 'Estudar',
    progress: 'Progresso',
    profile: 'Perfil',
    community: 'Comunidade',
    mentor: 'Mentor',
    streakTitle: 'Dias seguidos estudando',
    streakUnit: { one: 'dia', other: 'dias' },
  },
  profile: {
    language: 'Idioma',
    languageAuto: 'Automático ({language})',
  },
};

export default pt;
