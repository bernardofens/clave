# Clave · academia musical

Um app para praticar música no tempo que você tem. Como numa academia, cada área de estudo é um
"grupo muscular" e o app sugere o que treinar agora, com ou sem o instrumento por perto.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # motor de teoria + gerador de cada exercício
npm run build      # build de produção em dist/
npm run art        # regera as ilustrações em public/art a partir de design/art.mjs
```

O progresso fica salvo no navegador (localStorage, chave `clave:v1`). Ainda não há login nem servidor.

## O que existe

- **Hoje**: você escolhe quanto tempo tem e se está com o instrumento; o Clave monta a sessão
  pesando seus objetivos, o nível que você declarou e o que você treinou pouco nos últimos dias.
- **Treinar**: 20 exercícios em seis áreas (ouvido, técnica, mapeamento, harmonia, ritmo, leitura),
  todos personalizáveis e com link para compartilhar as configurações.
- **Ferramentas**: metrônomo, "solfejar e tocar" (drone + metrônomo + cronômetro com meta),
  backing track com análise de graus e sugestão de escalas, gerador de leitura (notas ou ritmo,
  em loop de 4 compassos) e rotinas de técnica com metrônomo progressivo.
- **Estudar**: aulas no formato por quê / como encaixar / passo a passo / pratique,
  trilhas (Fundamentos grátis; Jazz e Erudito como Clave+) e gêneros como discos.
- **Progresso**: nível por área (XP de acertos e tempo), medalhas, histórico e o plano
  "internalizar uma tonalidade".
- **Comunidade** e **Mentor**: prévias. A comunidade usa dados de exemplo (os links de treino já
  funcionam); o mentor responde com regras a partir do progresso, no lugar da IA do plano pago.

## Como o código está organizado

```
src/
  theory/       motor de teoria (notas grafadas, intervalos, escalas, acordes, tonalidades, ritmo)
  audio/        som sintetizado com Web Audio e o relógio com antecedência (metrônomo, backing)
  exercises/    catálogo de exercícios, tipos e o Player que roda qualquer um deles
  tools/        ferramentas para usar com o instrumento
  components/   pauta, teclado, braço e notação rítmica em SVG, e peças de interface
  data/         áreas, conteúdo das aulas e trilhas, gerador de sessão
  state/        estado do usuário e medalhas
  pages/        telas
design/         gerador das ilustrações (estilo Noturno) e o kit visual de referência
```

### Criar um exercício novo

Adicione um objeto em `src/exercises/catalog.ts`. Ele precisa de área, configurações e uma
função `make` que sorteia uma pergunta: o que mostrar (pauta, teclado, braço, som ou texto) e
como responder (opções, letra + acidente, tecla, casa do braço ou nota na pauta). O teste em
`catalog.test.ts` já passa a gerar centenas de perguntas do exercício novo e confere se a
resposta certa está sempre entre as opções.

## Publicação

O site é publicado pelo **Cloudflare Pages**, ligado ao repositório do GitHub: cada push na `main`
vai para produção e cada pull request ganha um link de prévia próprio.

| Configuração no Cloudflare Pages | Valor |
| --- | --- |
| Framework preset | `None` (ou `Vite`) |
| Comando de build | `npm run build` |
| Pasta de saída | `dist` |
| Branch de produção | `main` |
| Versão do Node | lida do arquivo `.nvmrc` |

As rotas do app (`/treinar`, `/estudar`…) são do React Router, que roda no navegador. Para o
Cloudflare entregar o app em qualquer endereço em vez de dar 404, o arquivo `public/_redirects`
contém `/* /index.html 200`; o Vite o copia para `dist/` no build.

Antes de entrar na `main`, todo pull request passa pelo GitHub Actions
([.github/workflows/ci.yml](.github/workflows/ci.yml)), que roda os mesmos comandos que dá para
rodar localmente:

```bash
npm ci
npm test
npx tsc --noEmit -p tsconfig.app.json
npm run lint
```

## Como contribuir

1. Crie uma branch a partir da `main` (`git switch -c minha-tarefa`).
2. Antes de abrir o pull request, rode os comandos do CI (seção Publicação) localmente.
3. Abra o pull request: o GitHub Actions roda testes, tipos e lint, e o Cloudflare Pages comenta
   um link de prévia.
4. Outra pessoa do time revisa e aprova; só então o pull request entra na `main`.

## Decisões e plano

- [docs/decisoes.md](docs/decisoes.md): o que foi decidido sobre produto, plataforma, comunidade e fases.
- [docs/fase-1.md](docs/fase-1.md): a Fase 1 quebrada em tarefas, com dependências e critério de pronto.
