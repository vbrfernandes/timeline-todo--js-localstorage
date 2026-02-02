### `06-Programação de Funcionalidades.md`

```markdown
# Programação de Funcionalidades

Este documento descreve a implementação técnica das principais funcionalidades no arquivo `script.js`.

## 1. Gerenciamento de Dados (CRUD)
* **`adicionarNovaTarefa()`**: Captura inputs, gera objetos de tarefa e calcula datas futuras se houver repetição.
* **`salvarEAtualizar()`**: Persiste o array `tarefas` no `localStorage` e chama a re-renderização.
* **`concluirTarefa(id)` / `excluirTarefa(id)`**: Manipulação do array de objetos baseada no ID único (Timestamp).

## 2. Lógica do Carrossel
A linha do tempo é dinâmica.
* **Renderização:** A função `renderizarTarefas()` agrupa o array plano de tarefas em um objeto por datas (`gruposPorData`) e cria colunas HTML dinamicamente.
* **Navegação:** A função `moveCarousel(direcao)` altera a propriedade CSS `transform: translateX` do container.

## 3. Sistema de Repetição
Ao criar uma tarefa, o sistema verifica o campo `todo-repeat`. Se diferente de "none", um loop `for` cria múltiplas instâncias da tarefa, incrementando a data conforme a lógica:
* `daily`: +1 dia
* `weekly`: +7 dias
* `monthly`: +1 mês

## 4. Subtarefas
As subtarefas são um array de objetos dentro do objeto pai da tarefa. O progresso é calculado dividindo `subtarefas.concluida / total`.