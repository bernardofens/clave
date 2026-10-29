# Decisões do Clave

Registro das decisões de produto e plataforma.
Quando uma decisão mudar, edite aqui e anote a data e o motivo.

- **22/10/2026** — primeira sessão de perguntas e respostas.
- **29/10/2026** — revisão a partir de sete documentos novos (catálogo de exercícios v0.5,
  guia de rotinas v1.1, protótipo de diagnóstico v0.2, guia do gerador de partituras,
  objetivos e perfis, considerações gerais e revisões da versão piloto). Esta revisão
  **substitui** várias decisões de 22/10; cada uma está marcada abaixo.

## Produto

### 1. Identidade: ambiente de estudo, não academia · *revisado em 29/10*

O Clave é um **ambiente de estudo configurável**, não uma academia que mede carga e ranqueia.
A metáfora de academia continua servindo ao **ritual** (abrir e já ter o que fazer), mas não à
**medição**: tempo estudado e etapas concluídas descrevem a sessão, não comprovam fluência.

Saem como mecânica central: ranking entre pessoas, streak punitivo, XP, níveis derivados de
acertos e qualquer "percentual de domínio".

**Motivo da mudança:** os três documentos novos atacam a medição quantificada de forma
convergente e explícita — "não confundir realização com domínio", "não confundir minutos com
domínio", "uma camada discreta de orientação da prática, não um jogo que distribui pontos".
Um ranking de carga autodeclarada ensinaria a pessoa a configurar o exercício mais fácil.

### 2. Aposta de retenção · *revisado em 29/10*

A pessoa volta por **utilidade e fricção zero para começar**, não por mecânica de engajamento:

1. A home resolve "o que eu estudo hoje?" em dois toques.
2. O nivelamento inicial entrega algo adequado já no primeiro acesso — nem fácil demais,
   nem difícil demais.
3. **Consistência não-punitiva:** dias praticados, meta diária escolhida pela própria pessoa,
   dias de descanso configuráveis. Registro, não cobrança.

A métrica de sucesso da Fase 1 continua a mesma: 25% de quem cria conta ainda estuda na
4ª semana, com 3 ou mais sessões por semana.

### 3. Primeiro público

O intermediário autodidata de cordas (violão, guitarra, baixo). Já toca, mas estuda sem
estrutura e se distrai. Iniciantes absolutos ficam para quando houver conteúdo de curso.
Não nos vendemos como curso do zero: isso afastaria quem já sabe algo.

### 4. Piano: representação, não instrumento paralelo · *novo em 29/10*

**Representação musical e instrumento principal são configurações separadas.** Pauta, teclado
e braço são **superfícies de resposta** disponíveis a qualquer pessoa — um baixista pode querer
responder vendo um teclado. Não existe um exercício por instrumento: o conteúdo musical é
compartilhado e só a execução e as particularidades técnicas (digitação, posições, cordas,
afinação) são específicas.

Consequência: exercícios que hoje são a mesma tarefa em superfícies diferentes se fundem num
só com seletor de superfície. O piano não é cortado, mas também não recebe investimento
específico — as cordas ficam com a profundidade de instrumento.

### 5. Quem decide o treino: a pessoa · *revisado em 29/10*

**A escolha lidera.** A home é a paleta pessoal: os exercícios e rotinas que a pessoa priorizou,
a um toque de começar. O gerador automático de sessão foi **removido**.

Tempo disponível e com/sem instrumento são **contexto da home inteira**, não entrada de um
gerador: escolhido "5 min, sem instrumento", a paleta já aparece filtrada pelo que cabe.

Para o catálogo não ficar invisível, a home mostra **um** card de novidade fora da paleta, com
motivo explícito ("você nunca treinou nada de Percepção Harmônica") e botão de pôr na paleta.
Não é sorteio.

**Motivo da mudança:** 22/10 previa um modelo híbrido em que o Clave montava a sessão a partir
do arsenal. A decisão de 29/10 dá o controle à pessoa.

### 6. Navegação e taxonomia · *revisado em 29/10*

A navegação de aprendizagem passa a ser **Teoria · Técnica · Percepção**, com Percepção dividida
em **Melódica, Harmônica e Rítmica**. **Rotinas** é camada de organização da prática, não área de
conhecimento. Leitura deixa de ser área: notação e símbolos vão para Teoria; ler algo novo para
ouvir, cantar ou tocar vai para as áreas de Percepção. Técnica tem escopo restrito a controle
motor, coordenação, digitação, articulação e regularidade.

Cinco abas: **Hoje · Treinar · Rotinas · Progresso · Perfil**. Teoria absorve a antiga área
"Estudar": aulas e quizzes ficam lado a lado, que é a conexão aula↔exercício que queríamos.
Comunidade e Mentor saem da navegação na Fase 1 — não devem aparecer portas que não abrem.

**Princípio que acompanha:** um exercício tem **uma localização principal e várias etiquetas**.
Nunca duplicar uma implementação para ela aparecer em mais de um módulo.

### 7. Porta por objetivo · *novo em 29/10*

A organização interna do catálogo **não é** a organização mental de quem estuda. A pessoa não
pensa "percepção melódica"; pensa "quero conhecer as notas no braço", "quero tirar música de
ouvido", "quero acompanhar uma harmonia".

Existe uma **porta por objetivo** que traduz uma coisa na outra, construída sobre a lista de
objetivos do documento de perfis. A mesma superfície serve duas vezes: encontrar exercício e
personalizar a paleta inicial no onboarding.

Sem essa porta, a nossa função principal — mapear o braço — fica atrás de uma palavra de
conservatório, e o nosso público principal não a encontra.

### 8. Rotinas · *novo em 29/10*

Uma rotina é uma **lista ordenada de instâncias de exercícios**, cada uma com parâmetros
próprios. Não é uma área de aprendizagem nem exercício novo. A rotina referencia o
`exercise_id` estável do catálogo e guarda apenas a configuração, nunca a lógica do exercício.

Parâmetros como instrumento, afinação, tonalidade e andamento podem ser definidos na rotina e
**herdados** pelas etapas, com substituição explícita e visível ("Tonalidade: Dó maior (da rotina)").

Comportamento padrão: **cronômetro crescente por etapa, avanço manual, pausa disponível**.
O cronômetro informa, não encerra o exercício nem bloqueia o avanço. Nada de avanço automático.

Na Fase 1 entregamos estrutura de dados, executor e **presets publicados pelo time** — incluindo
"Mapear o braço do baixo" nas versões curta, padrão e completa, com tonalidade configurável.
O **editor** de rotinas fica para a Fase 2.

### 9. Diagnóstico: registrar primeiro, recomendar depois · *novo em 29/10*

A Fase 1 implementa só a **instrumentação**: cada tentativa grava `exercise_id`,
`primary_module`, `skill_tags`, `content_tags`, `validation_type`, `parameters_snapshot`,
`outcome`, `error_code` quando a evidência permitir, tempo de resposta, pistas e repetições.
Não mostra nada e não recomenda nada ainda.

**Razão da ordem:** recomendação se adiciona depois e se aplica retroativamente aos dados
gravados; histórico que não foi gravado não se recupera. Sem isso, toda a prática do beta e dos
primeiros meses nasce inútil para diagnóstico.

Princípios que valem desde já:

- **Registrar evidência, não rotular a pessoa.** "Padrão de erro observado", "vale revisar",
  "ainda há pouca evidência". Nunca "ouvido ruim" nem nota global.
- **A navegação não é o modelo de habilidade.** O módulo serve para achar o exercício no app;
  a análise usa `skill_tags`, conteúdo, etapa da tarefa e canal de validação.
- **Não comparar medidas incompatíveis** (tempo de um quiz de teoria com o de uma tarefa de
  técnica; precisão automática com autoavaliação).
- **Não prometer validação que não existe.** Canto e execução acústica começam em
  autoavaliação. Falha técnica de detecção é validação incerta, nunca erro musical.

Resumo de padrões, regras de recomendação e a tela "vale revisar / está ficando mais consistente
/ ainda não sabemos" ficam para a Fase 2, quando houver dados reais para calibrar os limiares.

### 10. Arquitetura dos exercícios · *novo em 29/10*

Modelar separadamente **conteúdo musical**, **apresentação**, **superfície de resposta** e
**validação**. Tonalidade, timbre, extensão, andamento, material permitido, região do instrumento
e modo de resposta são **parâmetros**, não ferramentas novas.

A camada é construída e migrada aos poucos, sem tentar resolver toda a lista de revisões de uma
vez. Os quatro cortes concretos no código atual:

1. Separar superfície de resposta de regra de validação (hoje fundidas), para permitir
   equivalência semântica — enarmonias, cifras equivalentes, posições diferentes com a mesma altura.
2. Tirar timbre, volume e forma de apresentação de dentro da geração da pergunta, para que
   timbre possa ser configuração global por instrumento.
3. Criar tipo de parâmetro numérico (faixa), que hoje não existe — é o que bloqueia pesos de
   figuras, limite de salto e extensão de linhas suplementares.
4. Pôr os parâmetros globais no contexto compartilhado, de onde os exercícios os herdam — a
   mesma herança que as rotinas usam.

**Critério de pronto:** adicionar um parâmetro global novo (timbre, por exemplo) faz todo
exercício com áudio respeitá-lo sem editar o catálogo, e um exercício novo se declara sem tocar
no motor.

### 11. Crescimento do catálogo · *novo em 29/10*

O catálogo de referência tem cerca de 60 famílias; não é lista de funcionalidades obrigatórias.

**Reuso por padrão:** antes de adicionar uma família, verificar se ela pode ser um modo ou
configuração de um motor existente. Uma família nova se justifica quando muda o objetivo
cognitivo, a regra de validação ou a estrutura da tarefa — não quando muda a tonalidade, o
instrumento, o timbre, o número de notas ou o formato da resposta.

**Código novo por exceção**, com justificativa escrita respondendo: *esta capacidade é essencial
para validar o produto na Fase 1?* Se sim, entra com a justificativa registrada. Se não, Fase 1.5.

**Não perseguir paridade entre módulos.** Deixar os cinco módulos igualmente cheios seria meta
artificial. O que importa é cada módulo ter uma experiência inicial coerente e útil.

### 12. Ambiguidade teórica é preocupação estrutural · *novo em 29/10*

Em teoria musical é comum haver mais de uma resposta defensável, por enarmonia, semelhança entre
escalas e convenções. Antes de publicar uma família, alguém com conhecimento teórico tenta
respondê-la de formas alternativas, verificando: há mais de uma resposta defensável? o estímulo
tem informação suficiente para escolher uma? a questão depende de um contexto que não foi
informado? a correção automática distingue erro conceitual de erro de interpretação?

Itens ambíguos ou sem solução única não devem gerar "erro do usuário".

### 13. Nivelamento inicial · *revisado em 29/10*

Perguntar o nível não basta, e **não existe nível global**: alguém pode ter experiência de
instrumento e pouca teoria, ou harmonia avançada e dificuldade de leitura.

O onboarding passa a ter, no lugar da autoavaliação por área, **desafios diagnósticos curtos por
objetivo**: para cada objetivo escolhido, 4 a 6 itens em duas ou três configurações de
dificuldade, usando exercícios que já existem. O resultado escolhe a configuração inicial da
paleta.

É **pulável sem penalidade** — quem pula não é marcado como iniciante e nada é bloqueado; a
estimativa começa com menos evidência e evolui com as tentativas. O resultado é por
objetivo/habilidade, nunca "você é intermediário". A calibração é julgamento do time, corrigido
com os relatos do beta.

### 14. Como medir evolução no instrumento · *revisado em 29/10*

Três tipos de progresso, nunca misturados:

- **Consistência** — dias praticados, meta própria, dias de descanso.
- **Atividade** — o que praticou, com quais configurações, por quanto tempo.
- **Evidência de aprendizagem** — só onde houve validação real. Na Fase 1, isso significa
  exercícios de resposta por seleção. Execução no instrumento é **atividade, não evidência**.

**Carga em bpm** sobrevive, simplificada: recorde "limpo a X bpm" por rotina com data, linha de
evolução, próximo degrau já preenchido ao abrir a rotina, e rótulo **"autodeclarado"** visível
junto do número. Saem: insígnias, sequências por exercício, celebração de recorde, total
agregado, e qualquer comparação — entre rotinas da própria pessoa ou entre pessoas, agora ou na
Fase 2.

**Ranking verificável: cancelado.** Era a razão declarada de levar o microfone aos exercícios na
Fase 1; sem ele, a dependência caiu.

### 15. Microfone · *revisado em 29/10*

Detecção de altura e afinador entram na **Fase 1**; microfone **nos exercícios** vai para a
Fase 1.5.

O afinador é o melhor uso de microfone deste produto: mede uma nota sustentada monofônica — a
única coisa que detecção de altura faz bem — e não tem pretensão pedagógica anexada. Também é um
motivo diário de abrir o app para quem toca cordas.

Levar o microfone aos exercícios depende do registro de tentativas com tipo de validação e
qualidade de medição, para distinguir "errou a nota" de "o microfone não entendeu". Acordes
polifônicos continuam fora. Reconhecimento por câmera não está no plano.

### 16. Preço

Tudo grátis. Nenhuma infraestrutura de plano, nenhum selo "Clave+". A monetização se decide com
dados de uso.

**Princípio guardado para quando a hora chegar:** vender profundidade, não a possibilidade de
estudar. Em particular, tonalidade, andamento e dificuldade não ficam atrás de pagamento — são
o que torna um exercício adequado à pessoa. A camada de parâmetros compartilhados não é o
produto pago.

### 17. Afinador

Entra na Fase 1: cromático, com predefinições para violão, guitarra, baixo de 4 e 5 cordas, e
afinações alternativas comuns (Drop D, meio tom abaixo).

### 18. Idiomas

Português e inglês desde o lançamento. As cifras seguem a convenção de cada idioma (C7M e
Cm7(♭5) em português; Cmaj7 e Cm7♭5 em inglês). O quiz de teoria monta as frases com gramática
própria de cada idioma, sem tradução literal. Espanhol não entra na Fase 1.

### 19. Aulas · *revisado em 29/10*

As aulas vivem em **Teoria**, ao lado dos quizzes — não em uma área "Estudar" separada. Texto e
interatividade na Fase 1 (por que importa, como encaixar, passo a passo, pratique), com guias
práticos modulares conectados a exercícios da plataforma.

Os **vídeos do YouTube** vão para a Fase 1.5: curar 1 a 3 vídeos por aula em dois idiomas antes
de a estrutura das aulas ser reorganizada seria retrabalho garantido. Quando entrarem: player em
modo de privacidade reforçada dentro do Clave, crédito do canal sempre visível, botão "Abrir no
YouTube", nada baixado nem reenviado.

### 20. Mentor com IA · *revisado em 29/10*

Vai para a **Fase 1.5**, e sai da navegação na Fase 1. Modelo pequeno rodando no aparelho,
opcional e marcado como experimental; a pessoa ativa e baixa o modelo, e se o aparelho não
aguentar fica o mentor por regras. A IA só conversa: fatos de teoria vêm do motor do Clave e o
progresso vem dos dados reais. Escopo fechado em estudo de música e no próprio Clave.

**Motivo do adiamento:** é a tarefa mais caro-e-experimental do plano, exige comparar modelos em
dois idiomas, detecção de capacidade do aparelho e um fluxo de download, e não contribui para a
aposta de retenção.

### 21. Nome

"Clave" fica, com nome composto nas lojas ("Clave: academia musical" / "Clave: music gym").
A busca rápida não achou conflito direto, mas há marcas parecidas nos EUA (ver pendências).

## Plataforma

### 22. Um código só

O mesmo React vira site, PWA (site instalável e offline) e apps de iOS e Android via Capacitor.
Se a latência de áudio virar problema, escreve-se só o módulo de áudio como plugin nativo.

**A Fase 1 lança site e PWA.** Os apps de loja vão para a Fase 1.5 — ver decisão 27.

### 23. Contas

Opcionais, com Supabase. Login por e-mail (link mágico), Google e Apple. O progresso local migra
para a conta no primeiro login. A conta pode ser apagada de dentro do app.

### 24. Análise de uso

PostHog, com hospedagem dos dados na Europa.

- Só eventos definidos pelo time (sessão, exercício, ferramenta, afinador, carga).
- Sem gravação de sessão, sem captura automática de cliques, sem cookie de rastreamento.
- Usuários com conta são identificados pelo ID interno, nunca pelo e-mail.
- Opção "Não enviar estatísticas de uso" no perfil; política de privacidade explica a coleta.
- Pessoas de 13 a 17 anos só entram no agregado, sem identificação individual.

### 25. Código e hospedagem

Repositório privado no GitHub, com testes automáticos no GitHub Actions e mudanças por pull
request. Site e PWA no Cloudflare Pages, com link de prévia por pull request. Supabase no plano
gratuito. Build de iOS no Mac com Xcode e de Android no Android Studio.

### 26. Gerador de partituras · *novo em 29/10*

O gerador é **infraestrutura**, não uma ferramenta entre outras: ele alimenta leitura melódica,
leitura rítmica, ditado, canto à primeira vista e localização de notas. Os dois leitores atuais
(gerador de leitura e leitura rítmica) se fundem em um só — motores duplicados são proibidos.

Construído por **fusão**, sem reescrever nenhum dos dois lados:

- **Fica o que o Clave já tem e tem teste:** fórmulas de compasso simples, compostas e ímpares,
  quiálteras, ligaduras de prolongação entre subdivisões diferentes, figuras pontuadas, células
  rítmicas e validação de coerência das configurações.
- **Entra do protótipo** (JavaScript puro, VexFlow 4.2.2 — a mesma versão que já usamos, licença
  MIT): os modos de geração melódica (aleatório, arpejos com cifra, groove I–IV–V–I, nove padrões
  de escala incluindo Hanon, nota pivô, enclosures), rolagem contínua com âncoras de tempo (muda
  o andamento sem reiniciar a partitura), agendador de áudio com lookahead, grafia enarmônica
  correta por tonalidade e agrupamento de hastes.

Fica para depois: páginas estáticas de 2/3/4 linhas, biblioteca de timbres, espanhol, ghost notes
e staccato, posições de braço e seleção de cordas.

**Atenção:** o guia do gerador descreve uma versão mais avançada do que o protótipo entregue —
o protótipo é só 4/4, sem idiomas, sem quiálteras além de tercinas e sem células rítmicas. O guia
é especificação, não relato.

### 27. Fases · *revisado em 29/10*

**Fase 1 — o núcleo.** Site e PWA. A escolha na home, a camada de parâmetros, a instrumentação
de tentativas, a taxonomia e a navegação novas, o gerador unificado, rotinas como presets, o
nivelamento no onboarding, afinador, contas e sincronização, PostHog, português e inglês, carga
simplificada. O beta fechado roda aqui.
**Sucesso:** 25% de quem cria conta ainda estuda na 4ª semana, com 3 ou mais sessões por semana.

**Fase 1.5 — distribuição e extras.** Apps de iOS e Android via Capacitor, vídeos do YouTube nas
aulas, mentor com IA local, microfone nos exercícios.

**Fase 2 — personalização e comunidade de rotinas.** Editor de rotinas; biblioteca comunitária de
rotinas (copiar, adaptar, comentar, atribuir crédito à original); resumo de padrões observados e
recomendações por regras transparentes; perfis, moderação de texto, painel de admin e faixas de
idade valendo. **Sem ranking.**

**Fase 3 — comunidade completa.** Áudio, vídeo, comentários e fórum, moderação de mídia,
checagem de abuso infantil e plantão de alertas.

**Motivo da mudança:** a Fase 1 de 22/10 misturava refundação do núcleo com distribuição nas
lojas. A aposta de retenção precisa do núcleo, mas não precisa das lojas: o beta fechado roda em
PWA, e as lojas dependem de contas pagas e da busca de marca, que são fila externa. A Fase 2
perdeu o ranking e ganhou o editor de rotinas.

## Comunidade e segurança

### 28. Comunidade

Biblioteca de rotinas compartilhadas na Fase 2; comunidade completa (feed, comentários, fórum,
áudio e vídeo) só na Fase 3. A comunidade nasce de algo que serve à proposta central —
compartilhar maneiras de estudar — e não de um fórum genérico.

Compartilhar conquista em story do Instagram ou imagem no WhatsApp fica para a Fase 2, junto da
comunidade.

### 29. Faixas de idade

Data de nascimento no cadastro.

- Sem conta: qualquer idade, uso local, sem comunidade.
- 13 a 17 anos: rotinas e pacotes da comunidade, curtidas. Perfil privado por padrão, sem
  mensagens diretas, sem publicar áudio ou vídeo.
- 18 anos ou mais: comunidade completa.

### 30. Moderação automática gratuita

Em camadas, numa função no servidor:

- Texto: lista de palavras proibidas normalizada + API de moderação da OpenAI.
- Imagem: API de moderação da OpenAI.
- Vídeo (até 60 s): quadros extraídos no aparelho e checados na mesma API. Só contas com alguns
  dias e e-mail confirmado podem postar vídeo; vídeo de conta nova entra oculto até a primeira
  revisão. Áudio falado não é transcrito na primeira versão.
- Abuso infantil: ferramenta de detecção por hash da Cloudflare e pedido de acesso ao PhotoDNA.
- Gatilho: se os vídeos passarem de algumas centenas por dia, ou houver um caso grave, a parte de
  vídeo migra para um serviço pago.

### 31. Painel de administração

Papéis de admin e moderador, fila única de denúncias e alertas, ações (aprovar, ocultar, apagar,
advertir, suspender, banir), registro de auditoria, recurso para quem teve conteúdo removido e
formulário de remoção por direitos autorais.

### 32. Rotina de moderação do time de três pessoas

- Revisão semanal da fila normal.
- Ocultação automática de: tudo que o filtro marca como grave, denúncias de nudez ou envolvendo
  menor, e conteúdo com 3 denúncias de pessoas diferentes.
- Plantão rotativo semanal que recebe alerta no celular só para abuso infantil ou nudez confirmada.

### 33. Jurídico

Termos de uso, diretrizes da comunidade e regras de idade (ECA Digital, LGPD) revisados por
advogado antes de abrir a Fase 2 (quando a biblioteca de rotinas compartilhadas começa) e
revisados de novo antes da Fase 3.

## Deliberadamente em aberto

Dependem do beta, não de decisão agora:

- **Limiares de evidência do diagnóstico.** O documento sugere, como ponto de partida para
  experimentação, seis ou mais itens comparáveis distribuídos por ao menos duas sessões, e diz
  explicitamente que são para calibrar com testes de usuário. Não há regra científica aqui.
- **Calibração dos desafios diagnósticos.** Qual configuração corresponde a qual ponto de
  partida é julgamento do time, corrigido com os relatos do beta.
- **Se o produto é escolha ou sugestão.** A home aposta na escolha. Se o beta mostrar que as
  pessoas querem que o Clave decida, a decisão 5 volta à mesa.

## Pendências fora do código

- Busca oficial da marca "Clave" no INPI e conferir no USPTO o status de "Clave Al Ingles, LLC"
  (software educacional), antes de pagar as contas de desenvolvedor.
- Contas de desenvolvedor Apple (US$ 99/ano) e Google Play (US$ 25, uma vez) — só na Fase 1.5.
- Política de privacidade da Fase 1 (microfone, contas, PostHog, menores) e, antes da Fase 2,
  termos de uso revisados por advogado.
- Revisão de ambiguidade teórica das famílias de exercício antes de publicá-las (decisão 12).
- Curadoria dos vídeos do YouTube por aula, em português e em inglês — Fase 1.5.
