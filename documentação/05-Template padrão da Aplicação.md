# Template Padrão da Aplicação

## 1. Identidade Visual
A aplicação utiliza um sistema de design consistente baseado em transparências e gradientes.

### Paleta de Cores (Tema Default - Purple)
* **Primary:** `#8257e5` (Roxo Rocketseat)
* **Background:** `#09090a` (Dark)
* **Text:** `#ffffff` (White)

## 2. Estrutura CSS Global
O projeto utiliza variáveis CSS (`:root`) para facilitar a troca de temas.

```css
:root {
    --primary: #8257e5;
    --bg-dark: #09090a;
    --card-bg: rgba(24, 24, 27, 0.8);
    --glass-border: rgba(255, 255, 255, 0.1);
}