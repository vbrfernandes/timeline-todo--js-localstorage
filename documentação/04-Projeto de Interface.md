# Projeto de Interface

## 1. Fluxo do Usuário
O fluxo da aplicação foi desenhado para ser "Single Page Application" (SPA), onde todas as ações ocorrem na mesma tela para agilidade.

1.  **Sidebar (Esquerda):** Onde o usuário insere dados, vê o relógio e acessa configurações.
2.  **Timeline (Direita):** Onde as tarefas aparecem visualmente.
3.  **Modal:** Aberto apenas para consultar histórico de concluídos.

## 2. Estrutura Visual (Wireframe Conceitual)

* **Layout Desktop:** Dividido em duas colunas principais (Sidebar Fixa 280px + Conteúdo Fluido).
* **Layout Mobile:** Coluna única, onde a Sidebar fica no topo e a Timeline torna-se um carrossel com scroll nativo horizontal.

## 3. Elementos de UI
* **Cards de Tarefa:** Retângulos com borda esquerda colorida indicando status.
* **Botões:** Estilo "Pílula" ou ícones minimalistas.
* **Glassmorphism:** Uso de fundos translúcidos (`backdrop-filter: blur`) para criar profundidade.