# Fase 1 · A academia

Objetivo: lançar o Clave no site, como PWA e nas lojas (iOS e Android), sem comunidade,
com o que faz o intermediário autodidata de cordas voltar toda semana.
Decisões de origem em [decisoes.md](decisoes.md).

**Sucesso:** 25% de quem cria conta ainda estuda na 4ª semana, com 3 ou mais sessões por semana.

## Como está dividido

São 15 tarefas em três frentes que andam em paralelo, uma por pessoa, depois de uma fundação comum.
Cada tarefa tem um critério de pronto verificável. As marcadas com 👤 são do time, fora do código.

```
F1-00 Fundação ──┬── Frente A · Som e microfone:   A1 → A2 → A3
                 ├── Frente B · Contas e lojas:     B1 → B2 → B3 → B4 → B5
                 └── Frente C · Produto e conteúdo: C1 → C2 → C3 → C4 → C5 → C6
                                                          ↓
                                              F1-99 Beta fechado e lançamento
```

C1 (idiomas) deve entrar cedo: toda tela nova feita antes dela vira retrabalho de tradução.

---

## F1-00 · Fundação (todos, primeiro)

- Iniciar o git, criar o repositório privado no GitHub com os três e proteger a branch principal
  (só entra por pull request).
- GitHub Actions rodando `npm test`, `tsc` e `npm run lint` em cada pull request.
- Cloudflare Pages publicando a branch principal e gerando link de prévia por pull request.
- Combinar: tamanho das tarefas, quem revisa o quê.

**Pronto quando:** um pull request de teste mostra os testes verdes e um link de prévia funcionando.

---

## Frente A · Som e microfone

### A1 · Detecção de altura pelo microfone
- Módulo de captura com permissão do microfone, rodando fora da thread principal (AudioWorklet).
- Algoritmo de detecção de altura para uma nota por vez (YIN ou McLeod), com limiar de confiança
  e de volume para ignorar ruído.
- Detector de ataques (onsets) para conferir tempo.
- Calibração de latência: o app toca cliques, escuta pelo microfone e mede o atraso do aparelho uma vez.
- Testes com amostras gravadas de violão, baixo e voz (afinado, desafinado, com ruído).

**Pronto quando:** detecta a nota certa em ±10 cents nas amostras de teste, em menos de 100 ms,
e funciona no Chrome, no Safari (iPhone) e no Firefox.

### A2 · Afinador
- Tela de afinador cromático no visual Noturno (ponteiro tipo VU de rádio antigo).
- Predefinições: violão/guitarra padrão, Drop D, meio tom abaixo, baixo de 4 e de 5 cordas.
- Mostra a corda mais provável e o quanto falta (em cents), com aviso quando está afinado.
- Atalho "Afinar antes de começar" na tela Hoje quando a sessão é com instrumento.

**Pronto quando:** afina um violão e um baixo reais de ponta a ponta, num celular e num computador.

### A3 · Microfone nos exercícios
- Gerador de leitura: modo "tocar e conferir". O cursor só avança quando a nota certa é tocada;
  no modo com metrônomo, marca acerto, erro e atraso.
- "Ache no braço": versão tocada, em que a pessoa toca a nota pedida no instrumento.
- Solfejar e tocar: mostra ao vivo a nota cantada ou tocada e o grau em relação ao drone.
- Ritmo: conferir os ataques batucados ou tocados contra o gerador rítmico, já descontando a latência.
- Resultados do microfone entram no histórico como verificáveis.

**Pronto quando:** os quatro modos funcionam com instrumento real e os acertos aparecem no progresso.

---

## Frente B · Contas, dados e lojas

### B1 · Supabase e contas
- Projeto Supabase (plano gratuito) com tabelas: perfil (com data de nascimento e faixa etária),
  estatísticas, histórico, arsenal, configurações, cargas e plano de tonalidade.
- Regras de acesso por usuário (Row Level Security): cada um só lê e escreve o que é seu.
- Login por e-mail (link mágico), Google e Apple.
- Coleta da data de nascimento no cadastro; menores de 13 anos seguem sem conta.
- Apagar a conta de dentro do app (exigência da Apple), apagando todos os dados.

**Pronto quando:** dá para criar conta, entrar nos três jeitos e apagar a conta, e outra conta
não consegue ler os dados da primeira (testado).

### B2 · Sincronização local-first
- O app continua funcionando sem conta e offline; com conta, sincroniza em segundo plano.
- No primeiro login, o progresso local migra para a conta sem perder nada.
- Regra de conflito simples e documentada (por exemplo: estatísticas somam, configurações ficam com a mais recente).

**Pronto quando:** estudar offline no celular e depois abrir o computador mostra o mesmo progresso.

### B3 · PostHog
- Eventos definidos pelo time: sessão começou e terminou, exercício feito, ferramenta usada,
  afinador usado, carga registrada.
- Sem gravação de sessão, sem captura automática, sem cookie de rastreamento; dados na Europa.
- Usuário com conta identificado pelo ID interno. De 13 a 17 anos, só no agregado.
- Opção "Não enviar estatísticas de uso" no perfil.
- Painel de retenção por semana (a métrica de sucesso da fase).

**Pronto quando:** o painel de retenção mostra dados de teste e a opção de não enviar comprovadamente
para os envios.

### B4 · PWA
- Manifesto, ícones a partir da arte do logo, tela de abertura no visual Noturno.
- Service worker com cache do app e das ilustrações, para funcionar offline.
- Aviso de "nova versão disponível".

**Pronto quando:** instala no Android e no iPhone pela tela inicial e faz um exercício em modo avião.

### B5 · Apps nas lojas (Capacitor)
- Projetos iOS e Android gerados do mesmo código.
- Permissão de microfone com o texto de justificativa, áudio liberado no primeiro toque,
  áreas seguras da tela (entalhe, barra de gestos).
- Ícone e tela de abertura; nomes "Clave: academia musical" / "Clave: music gym".
- Fichas das lojas: descrição em português e inglês, capturas de tela, questionário de classificação
  etária, link da política de privacidade.
- 👤 Contas de desenvolvedor Apple e Google.

**Pronto quando:** o app roda no TestFlight e no teste interno do Google Play, com microfone e som funcionando.

---

## Frente C · Produto e conteúdo

### C1 · Português e inglês (primeiro da frente)
- Todos os textos das telas num arquivo por idioma; seletor de idioma no perfil e detecção automática.
- Cifras por convenção do idioma (7M/maj7, m7(♭5)/m7♭5, ° / dim).
- Motor de frases do quiz de teoria com gramática de cada idioma.
- Conteúdo traduzido: aulas, trilhas, gêneros, exercícios, ferramentas, mentor por regras.
- Teste automático que falha se faltar alguma tradução.
- Tirar os selos "Clave+" e as menções a plano pago (tudo é grátis por enquanto).

**Pronto quando:** o app inteiro funciona em inglês sem nenhum texto em português sobrando, e o teste de traduções passa.

### C2 · Sessão a partir do arsenal
- O gerador de sessão sorteia a partir do arsenal, priorizando o que está há mais tempo sem treino
  e o que tem menor precisão, e encaixa no tempo disponível.
- Uma vaga de "novidade" fora do arsenal, de vez em quando, com o botão "pôr no arsenal".
- O onboarding monta o arsenal inicial a partir dos objetivos e do instrumento.
- Testes do gerador (respeita o tempo, nunca repete exercício na sessão, sem instrumento só sugere o que é feito sem instrumento).

**Pronto quando:** os testes passam e uma sessão de 10 minutos sai só com itens do arsenal (mais no máximo uma novidade).

### C3 · Carga em bpm
- Registrar "limpo a X bpm" ao fim de cada rotina de técnica, do gerador de leitura e do backing track.
- Recorde pessoal por rotina e sugestão do próximo degrau (+4 bpm ou mais notas).
- Gráfico de evolução da carga no Progresso.
- Carga autodeclarada marcada como tal (não conta para ranking futuro).

**Pronto quando:** dá para registrar, ver o recorde e o gráfico, e a próxima sessão propõe o degrau seguinte.

### C4 · Vídeos do YouTube nas aulas
- Campo de vídeos por aula, separado por idioma (1 a 3 por aula).
- Player incorporado em modo de privacidade reforçada, com o nome do canal e o botão "Abrir no YouTube".
- Quando o criador bloqueia a incorporação, mostra só o botão.
- 👤 Curadoria: escolher os vídeos de cada aula nos dois idiomas.

**Pronto quando:** todas as aulas têm ao menos um vídeo em cada idioma e o fallback de vídeo bloqueado funciona.

### C5 · Política de privacidade e textos legais da Fase 1
- 👤 Política de privacidade cobrindo microfone (o áudio não sai do aparelho), contas, PostHog e menores.
- Página no app e no site, linkada no cadastro e nas fichas das lojas.
- 👤 Busca da marca no INPI e no USPTO antes de publicar.

**Pronto quando:** a política está publicada e linkada, e a verificação de marca não mostrou bloqueio.

### C6 · Mentor com IA local (por último)
- 👤 Teste comparativo de modelos pequenos em português e inglês (qualidade, tamanho, velocidade).
- Download opcional pelo Wi-Fi, com checagem de capacidade do aparelho (WebGPU e memória).
- A IA recebe os dados reais de progresso e as respostas de teoria prontas do motor do Clave; só redige.
- Escopo fechado em estudo de música; recusa o resto.
- Mentor por regras continua como padrão e como alternativa.

**Pronto quando:** num computador e num celular recente, o mentor responde às cinco perguntas-guia
sem nenhum erro de teoria, e em aparelho fraco cai para o mentor por regras sem travar.

---

## F1-99 · Beta fechado e lançamento

- Beta com 20 a 30 músicos (amigos, alunos, grupos de baixo e violão) por duas semanas, pelo TestFlight,
  teste interno do Google Play e PWA.
- Corrigir o que aparecer; acompanhar a retenção no PostHog.
- Publicar nas lojas e anunciar o site.

**Pronto quando:** o app está publicado nas duas lojas e o painel de retenção está acompanhando a primeira turma.
