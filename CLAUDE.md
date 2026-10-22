# Instruções de trabalho neste projeto

## Antes de cada tarefa: avisar dificuldade e modelo sugerido

Antes de começar qualquer tarefa (de `docs/fase-1.md` ou pedida direto), avise o usuário com:
- **Dificuldade**: trivial / simples / média / difícil / muito difícil, com uma frase do porquê.
- **Modelo sugerido**: qual modelo da Claude equilibra qualidade e economia de tokens para
  *essa* tarefa específica, e por quê.

Guia de escolha:
- **Haiku** — tarefas mecânicas e de baixo risco: renomear, formatar, CRUD simples, specs já
  fechadas, ajustes repetitivos.
- **Sonnet** — a maior parte do trabalho: componentes React, testes, configuração, integração
  com APIs já documentadas, correções de bugs localizados. É o padrão de melhor custo-benefício;
  comece por ele quando a tarefa não exigir claramente mais.
- **Opus** — raciocínio longo ou ambíguo, algoritmos não triviais (ex.: DSP e detecção de altura
  em áudio), decisões de arquitetura, geração criativa (ilustrações, copy, nomes, UX), análise
  de imagem complexa, ou qualquer tarefa onde um erro sai caro de corrigir depois.

O usuário troca de modelo com `/model <nome>`; a sessão não troca sozinha. Por isso, para
tarefas difíceis ou caras, avisar e esperar a decisão antes de começar — não seguir em frente
no modelo atual por padrão.

## Geração de assets e tarefas criativas

Quando a tarefa envolve gerar arte (`design/art.mjs`, ilustrações no estilo Noturno), analisar
imagens, escrever textos de produto/marketing, ou qualquer coisa que dependa de julgamento
estético, sinalizar isso explicitamente e sugerir Opus.

## Outras decisões do projeto

Ver [docs/decisoes.md](docs/decisoes.md) (produto e plataforma) e [docs/fase-1.md](docs/fase-1.md)
(tarefas da Fase 1, dependências, critério de pronto).
