# Cine Fetch — TMDB (versão simplificada)

Projeto em React (Vite) que consome a API do The Movie Database (TMDB) para
mostrar filmes populares, filmes em cartaz e permitir busca por título.

Toda a lógica está concentrada em `src/App.jsx`, e a parte que fala com a
API foi dividida em **três funções bem diretas** — uma pra cada ação — pra
facilitar a leitura e a apresentação.

## Como rodar

1. Instale as dependências:
   ```
   npm install
   ```

2. Pegue uma chave de API gratuita em https://www.themoviedb.org/settings/api

3. Copie o arquivo de exemplo de variáveis de ambiente e cole sua chave:
   ```
   cp .env.example .env
   ```
   e edite `.env`:
   ```
   VITE_TMDB_API_KEY=sua_chave_aqui
   ```

4. Rode o projeto:
   ```
   npm run dev
   ```

5. Abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## Estrutura (só 3 arquivos de código)

```
src/
  App.jsx     <- toda a lógica e a interface do app
  main.jsx    <- ponto de entrada do React (não precisa mexer)
  index.css   <- estilo visual (tema de cinema)
```

## Onde cada requisito do projeto está, dentro de `App.jsx`

- **Conexão (fetch + async/await):** três funções no topo do arquivo —
  `buscarPopulares()`, `buscarEmCartaz()` e `buscarPorTitulo(titulo)`.
  Cada uma monta sua própria URL e faz `await fetch(url)`.
- **Exibição dinâmica:** dentro do `return`, o trecho `filmes.map(...)`
  transforma o array de filmes vindo da API em uma grade de cards.
- **Estado de carregamento:** variável de estado `carregando`
  (`useState`), que mostra o spinner enquanto a API responde.
- **Tratamento de erro:** variável de estado `erro`. Se a API falhar,
  aparece a caixa "A sessão não pôde começar" com botão de tentar de novo.
- **Estado vazio:** se `filmes.length === 0` e não há erro, aparece
  "Nenhum resultado encontrado." em vez de tela em branco ou quebrada.
- **Interação:** o formulário de busca (`handleBuscar`) e os botões de
  filtro "Populares" / "Em cartaz" (`handleFiltro`).

## Como explicar na apresentação (resumo em 1 minuto)

1. O usuário digita um título ou clica em um filtro.
2. Isso muda o estado (`modo` e `termoBusca`).
3. O `useEffect` percebe a mudança e chama `carregarFilmes()`.
4. Dentro de `carregarFilmes`, um `if/else` simples decide qual das três
   funções chamar: `buscarPopulares`, `buscarEmCartaz` ou `buscarPorTitulo`.
5. Enquanto espera a resposta, `carregando` fica `true` e mostra o spinner.
6. Quando a API responde, o array de filmes vira cards na tela — ou, se
   der erro, aparece a mensagem amigável.
