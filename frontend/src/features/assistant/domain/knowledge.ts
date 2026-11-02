import type { ReportCategory } from '@/features/reports';

// Base de conhecimento do assistente SIMULADO (RF08, RF09): respostas pré-definidas escolhidas por
// palavras-chave. Não há IA nem integração externa. Os textos ficam em messages/pt-BR.json.

export interface Source {
  label: string;
  url: string;
}

export const SOURCES = {
  ibama: {
    label: 'IBAMA — Linha Verde',
    url: 'https://www.gov.br/ibama/pt-br/canais_atendimento/linha-verde',
  },
  mma: { label: 'Ministério do Meio Ambiente', url: 'https://www.gov.br/mma/pt-br' },
  law: {
    label: 'Lei de Crimes Ambientais (Lei nº 9.605/1998)',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/l9605.htm',
  },
} as const satisfies Record<string, Source>;

export interface Topic {
  id: string;
  // "queimad*" casa com o início da palavra; sem "*", casa a palavra (ou expressão) inteira
  keywords: string[];
  // Oferece "Registrar denúncia sobre isso" com a categoria já escolhida
  category?: ReportCategory;
  sources?: Source[];
}

// Em caso de empate, vence o tópico que aparece primeiro
export const TOPICS: Topic[] = [
  {
    id: 'emergency',
    keywords: [
      'emergencia',
      'urgente',
      'urgencia',
      'socorro',
      'perigo',
      'risco*',
      'bombeiro*',
      '193',
      '199',
      'defesa civil',
    ],
  },
  {
    id: 'fire',
    keywords: ['queimad*', 'fogo', 'incendio*', 'queima', 'queimar'],
    category: 'fire',
  },
  {
    id: 'waste',
    keywords: [
      'lixo',
      'entulho',
      'residuo*',
      'descarte',
      'descartar',
      'sujeira',
      'aterro',
      'cacamba',
    ],
    category: 'waste_disposal',
    sources: [SOURCES.law],
  },
  {
    id: 'deforestation',
    keywords: [
      'desmat*',
      'arvore*',
      'mata',
      'floresta',
      'vegetacao',
      'corte',
      'motosserra',
      'nascente*',
    ],
    category: 'deforestation',
    sources: [SOURCES.law],
  },
  {
    id: 'water',
    keywords: ['agua', 'rio', 'corrego', 'esgoto', 'oleo', 'lago', 'mar', 'praia'],
    category: 'water_pollution',
    sources: [SOURCES.law],
  },
  {
    id: 'air',
    keywords: ['ar', 'fumaca', 'poeira', 'cheiro', 'odor*', 'chamine', 'emissao', 'emissoes'],
    category: 'air_pollution',
    sources: [SOURCES.law],
  },
  {
    id: 'goodReport',
    keywords: [
      'como denunciar',
      'como registrar',
      'como fazer',
      'denuncia util',
      'boa denuncia',
      'o que informar',
      'o que preciso',
      'dicas',
      'registrar',
      'denunciar',
    ],
  },
  {
    id: 'followUp',
    keywords: [
      'acompanhar',
      'acompanho',
      'andamento',
      'protocolo',
      'consultar',
      'onde vejo',
      'resposta*',
      'demora',
      'prazo',
    ],
  },
  {
    id: 'statuses',
    keywords: [
      'status',
      'recebida',
      'em analise',
      'em andamento',
      'concluida',
      'nao procedente',
      'significa',
    ],
  },
  { id: 'anonymous', keywords: ['anonim*', 'sem identificar', 'esconder', 'identidade', 'sigilo'] },
  {
    id: 'privacy',
    keywords: ['cpf', 'dados', 'privacidade', 'lgpd', 'seguro', 'seguranca', 'compartilh*'],
  },
  {
    id: 'official',
    keywords: [
      'ibama',
      'linha verde',
      'orgao*',
      'ministerio',
      'lei',
      'crime*',
      'onde ligar',
      'telefone',
      'contato',
    ],
    sources: [SOURCES.ibama, SOURCES.mma],
  },
  { id: 'greeting', keywords: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai'] },
];

export const FALLBACK_TOPIC: Topic = {
  id: 'fallback',
  keywords: [],
  sources: [SOURCES.ibama, SOURCES.mma],
};

// Minúsculas, sem acentos e sem pontuação, com espaços nas pontas para casar palavras inteiras
function toSearchText(question: string): string {
  const plain = question
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return ` ${plain} `;
}

const matches = (text: string, keyword: string) =>
  keyword.endsWith('*') ? text.includes(` ${keyword.slice(0, -1)}`) : text.includes(` ${keyword} `);

export function matchTopic(question: string): Topic {
  const text = toSearchText(question);
  let best: Topic = FALLBACK_TOPIC;
  let bestScore = 0;

  for (const topic of TOPICS) {
    const score = topic.keywords.filter((keyword) => matches(text, keyword)).length;
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

export const topicById = (id: string): Topic =>
  TOPICS.find((topic) => topic.id === id) ?? FALLBACK_TOPIC;
