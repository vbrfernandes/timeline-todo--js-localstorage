# Plano de Testes de Software

**Responsável:** Vitor de Barros

| Caso de Teste | Cenário | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **CT-01** | Adicionar Tarefa Simples | 1. Digitar texto<br>2. Selecionar data<br>3. Clicar em Agendar | Tarefa aparece na coluna da data correta. |
| **CT-02** | Testar Repetição Semanal | 1. Criar tarefa<br>2. Selecionar "Semanalmente"<br>3. Definir limite "3" | Devem aparecer 3 cards em datas com 7 dias de intervalo. |
| **CT-03** | Navegação Carrossel | 1. Adicionar várias tarefas<br>2. Clicar na seta Direita | O carrossel deve deslizar para exibir datas futuras. |
| **CT-04** | Troca de Tema | 1. Clicar no botão "Tema" | As cores da interface devem mudar imediatamente. |
| **CT-05** | Persistência | 1. Criar tarefa<br>2. Atualizar a página (F5) | A tarefa deve permanecer na tela. |
| **CT-06** | Adicionar Subtarefa | 1. Clicar no ícone "+" no card | Prompt abre e subtarefa é adicionada ao card. |