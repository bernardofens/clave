import type pt from './pt';
import type { Shape } from './index';

const en: Shape<typeof pt> = {
  nav: {
    main: 'Main',
    home: 'Clave, home',
    today: 'Today',
    train: 'Train',
    study: 'Study',
    progress: 'Progress',
    profile: 'Profile',
    community: 'Community',
    mentor: 'Mentor',
    streakTitle: 'Days in a row studying',
    streakUnit: { one: 'day', other: 'days' },
  },
  profile: {
    language: 'Language',
    languageAuto: 'Automatic ({language})',
  },
};

export default en;
