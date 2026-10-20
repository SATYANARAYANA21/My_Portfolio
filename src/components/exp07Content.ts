export type FieldNotePage = {
  eyebrow: string;
  title: string;
  paragraphs?: string[];
  quote?: string;
  sections?: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  flow?: string[];
  annotation?: string;
  signature?: string;
};

export type FieldNoteSpread = {
  left: FieldNotePage;
  right: FieldNotePage;
};

export const FIELD_NOTE_COVER = {
  eyebrow: 'FIELD NOTE 07',
  title: 'ABOUT ME',
  subtitle: 'A PERSONAL FIELD NOTE',
  signature: 'SATYA',
};

export const FIELD_NOTE_SPREADS: FieldNoteSpread[] = [
  {
    left: {
      eyebrow: '01 / ORIGIN',
      title: 'TECHNOLOGY',
      paragraphs: ['Technology started as curiosity for me.'],
      annotation: '探究',
    },
    right: {
      eyebrow: 'A QUESTION',
      title: 'A simple question:',
      quote: '“How do ideas turn into real products?”',
      paragraphs: [
        'Slowly, that question pulled me into the world of code, startups, and innovation.',
      ],
      annotation: '問い',
    },
  },
  {
    left: {
      eyebrow: '02 / THE PATH',
      title: 'THE PATH',
      paragraphs: [
        'I’m currently a Computer Science student at Raghu Engineering College, exploring how technology can be used to solve real-world problems and build meaningful solutions.',
      ],
      annotation: '学び',
    },
    right: {
      eyebrow: 'A STUDY IN MAKING',
      title: 'From study to building',
      flow: ['COMPUTER SCIENCE', 'CODE', 'PROJECTS', 'EXPERIMENTS', 'BUILDING'],
      annotation: '実践',
    },
  },
  {
    left: {
      eyebrow: '03 / INTERESTS',
      title: 'THREE THINGS',
      sections: [
        {
          number: '01',
          title: 'TECHNOLOGY',
          description: 'Learning how systems, software, and ideas come together.',
        },
        {
          number: '02',
          title: 'STARTUPS',
          description: 'Understanding how small ideas grow into impactful companies.',
        },
      ],
      annotation: '関心',
    },
    right: {
      eyebrow: 'A PRACTICE',
      title: 'BUILDING',
      sections: [
        {
          number: '03',
          title: 'BUILDING',
          description: 'Turning curiosity into projects and experiments.',
        },
      ],
      annotation: '制作',
    },
  },
  {
    left: {
      eyebrow: '04 / PHILOSOPHY',
      title: 'BUILD / SHARE',
      paragraphs: [
        'I believe the best way to learn is to build in public, share insights, and grow alongside a community of curious minds.',
      ],
      annotation: '共有',
    },
    right: {
      eyebrow: 'THE CONTINUING NOTE',
      title: 'LEARN / REPEAT',
      paragraphs: [
        'On my journey, I aim to explore new technologies, develop innovative ideas, and contribute to solutions that create real impact.',
      ],
      signature: 'SATYA',
      annotation: '未来',
    },
  },
];

export const FIELD_NOTE_PAGES = FIELD_NOTE_SPREADS.flatMap(({ left, right }) => [left, right]);
