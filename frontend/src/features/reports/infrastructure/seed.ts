import type { Report, ReportHistoryEntry, ReportStatus } from '../domain/types';

// Denúncias de exemplo (dados simulados) para as telas não aparecerem vazias na demonstração.
const ORG = 'Secretaria Municipal de Meio Ambiente (simulada)';

type Step = [status: ReportStatus, at: string, message?: string];

function build(
  n: number,
  citizenId: string,
  data: Pick<Report, 'title' | 'category' | 'description' | 'occurredOn' | 'location'>,
  createdAt: string,
  steps: Step[],
): Report {
  const history: ReportHistoryEntry[] = [
    { id: `seed-${n}-0`, kind: 'created', status: 'received', authorRole: 'citizen', createdAt },
    ...steps.map(([status, at, message], i): ReportHistoryEntry => ({
      id: `seed-${n}-${i + 1}`,
      kind: 'status',
      status,
      message,
      authorRole: 'admin',
      authorName: ORG,
      createdAt: at,
    })),
  ];
  const last = steps.at(-1);

  return {
    id: `seed-report-${n}`,
    protocol: `PRV-2026-${String(n).padStart(6, '0')}`,
    citizenId,
    ...data,
    evidences: [],
    status: last ? last[0] : 'received',
    history,
    accessLog: [],
    createdAt,
    updatedAt: last ? last[1] : createdAt,
  };
}

const MARIA = 'demo-citizen-maria';
const JOAO = 'demo-citizen-joao';
const ANA = 'demo-citizen-ana';

export function buildSeedReports(): Report[] {
  return [
    build(
      1,
      MARIA,
      {
        title: 'Entulho descartado na calçada da Rua das Acácias',
        category: 'waste_disposal',
        description:
          'Uma caçamba de entulho foi despejada na calçada há alguns dias e o material já invade parte da rua. Há restos de tijolo, madeira e sacos de cimento.',
        occurredOn: '2026-10-02',
        location: {
          state: 'SP',
          city: 'Campinas',
          address: 'Rua das Acácias, 340 — Jardim Primavera',
          reference: 'Em frente à padaria Pão Nosso',
        },
      },
      '2026-10-03T14:20:00.000Z',
      [
        ['in_review', '2026-10-05T12:10:00.000Z'],
        [
          'in_progress',
          '2026-10-08T19:40:00.000Z',
          'A equipe de fiscalização vistoriou o local e notificou o responsável pela remoção.',
        ],
        [
          'resolved',
          '2026-10-15T14:05:00.000Z',
          'O entulho foi removido e o responsável foi autuado. Obrigado pelo aviso!',
        ],
      ],
    ),
    build(
      2,
      MARIA,
      {
        title: 'Mancha de óleo no córrego Ribeirão das Pedras',
        category: 'water_pollution',
        description:
          'Uma mancha de óleo, com cheiro forte de combustível, se estende por cerca de 50 metros do córrego a partir da ponte. Notei também alguns peixes mortos.',
        occurredOn: '2026-10-20',
        location: {
          state: 'SP',
          city: 'Campinas',
          address: 'Ponte do Ribeirão das Pedras, Estrada Municipal CAM-340',
          reference: 'Próximo ao sítio com portão azul',
        },
      },
      '2026-10-21T13:00:00.000Z',
      [
        ['in_review', '2026-10-22T15:30:00.000Z'],
        [
          'in_progress',
          '2026-10-27T17:15:00.000Z',
          'Coletamos amostras da água para análise. Pedimos que ninguém utilize a água do córrego até a conclusão.',
        ],
      ],
    ),
    build(
      3,
      MARIA,
      {
        title: 'Queimada em terreno baldio no Jardim Botânico',
        category: 'fire',
        description:
          'Foi ateado fogo na vegetação seca de um terreno sem construção. A fumaça atinge as casas vizinhas, mas o fogo parece sob controle.',
        occurredOn: '2026-10-30',
        location: {
          state: 'SP',
          city: 'Campinas',
          address: 'Rua das Palmeiras, esquina com Av. dos Ipês — Jardim Botânico',
        },
      },
      '2026-10-31T10:45:00.000Z',
      [['in_review', '2026-11-01T13:20:00.000Z']],
    ),
    build(
      4,
      MARIA,
      {
        title: 'Corte de árvores em área de mata ciliar',
        category: 'deforestation',
        description:
          'Vi dois homens com motosserras cortando árvores nativas na margem do rio, e já há troncos empilhados. O local fica atrás de uma chácara.',
        occurredOn: '2026-11-01',
        location: {
          state: 'SP',
          city: 'Valinhos',
          address: 'Estrada do Pinhal, km 4',
          reference: 'Depois da porteira de madeira, à direita',
        },
      },
      '2026-11-02T11:15:00.000Z',
      [],
    ),
    build(
      5,
      JOAO,
      {
        title: 'Fumaça escura saindo de chaminé de indústria',
        category: 'air_pollution',
        description:
          'Todas as manhãs, por volta das 7h, uma chaminé solta fumaça escura por mais de uma hora, com cheiro forte, e a vizinhança fica incomodada.',
        occurredOn: '2026-10-28',
        location: {
          state: 'SP',
          city: 'Sumaré',
          address: 'Av. Industrial, 1200 — Distrito Industrial',
        },
      },
      '2026-10-28T12:00:00.000Z',
      [['in_review', '2026-10-30T14:00:00.000Z']],
    ),
    build(
      6,
      JOAO,
      {
        title: 'Lixo acumulado em terreno vazio',
        category: 'waste_disposal',
        description:
          'Moradores têm jogado sacos de lixo e móveis velhos num terreno vazio. O acúmulo atrai ratos e o mau cheiro aumenta com o calor.',
        occurredOn: '2026-11-01',
        location: {
          state: 'SP',
          city: 'Sumaré',
          address: 'Rua Pará, 85 — Parque Bela Vista',
          reference: 'Ao lado da escola municipal',
        },
      },
      '2026-11-01T18:30:00.000Z',
      [],
    ),
    build(
      7,
      ANA,
      {
        title: 'Desmatamento perto de nascente',
        category: 'deforestation',
        description:
          'Uma área de mata próxima a uma nascente está sendo limpa com trator. A terra exposta já é levada pela chuva para o riacho.',
        occurredOn: '2026-10-18',
        location: {
          state: 'SP',
          city: 'Valinhos',
          address: 'Estrada da Capela, km 2',
          reference: 'Atrás do sítio Santa Luzia',
        },
      },
      '2026-10-19T09:40:00.000Z',
      [
        ['in_review', '2026-10-20T12:00:00.000Z'],
        [
          'in_progress',
          '2026-10-26T18:30:00.000Z',
          'Foi aberto um procedimento de fiscalização. O proprietário será notificado para apresentar a autorização.',
        ],
      ],
    ),
    build(
      8,
      ANA,
      {
        title: 'Poeira excessiva de obra na avenida',
        category: 'air_pollution',
        description:
          'Uma obra levanta muita poeira durante o dia, e ela cobre os carros e as casas ao redor. Não vi caminhão-pipa para umedecer o solo.',
        occurredOn: '2026-10-10',
        location: {
          state: 'SP',
          city: 'Campinas',
          address: 'Av. das Nações, 500 — Jardim Europa',
        },
      },
      '2026-10-11T08:10:00.000Z',
      [
        ['in_review', '2026-10-13T12:00:00.000Z'],
        [
          'not_upheld',
          '2026-10-17T15:00:00.000Z',
          'Após vistoria, a obra possui licença válida e adota as medidas de controle de poeira exigidas.',
        ],
      ],
    ),
  ];
}
