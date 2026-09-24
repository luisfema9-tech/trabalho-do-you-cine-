import { useEffect, useState } from 'react';


// CONFIGURAÇÃO DA API DO TMDB
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function getPosterUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : null;
}


// 1) A CONEXÃO 
async function buscarPopulares() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  return dados.results || [];
}

async function buscarEmCartaz() {
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  return dados.results || [];
}

async function buscarPorTitulo(titulo) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(titulo)}`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  return dados.results || [];
}

// COMPONENTE PRINCIPAL
export default function App() {
  const [modo, setModo] = useState('popular'); 
  const [campoBusca, setCampoBusca] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);

  // 3) A EXPERIÊNCIA — estados de carregamento e erro
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarFilmes();
   
  }, [modo, termoBusca]);

  async function carregarFilmes() {
    setCarregando(true);
    setErro('');

    if (!API_KEY) {
      setErro('Chave da API do TMDB não configurada. Crie o arquivo .env com VITE_TMDB_API_KEY.');
      setCarregando(false);
      return;
    }

    try {
      let resultado;

     
      if (modo === 'search') {
        resultado = await buscarPorTitulo(termoBusca);
      } else if (modo === 'now_playing') {
        resultado = await buscarEmCartaz();
      } else {
        resultado = await buscarPopulares();
      }

      setFilmes(resultado);
    } catch (e) {
      setErro('Não foi possível buscar os filmes. Tente novamente em instantes.');
    } finally {
      setCarregando(false);
    }
  }

  // 4) A INTERAÇÃO — busca por título
  function handleBuscar(event) {
    event.preventDefault();
    if (!campoBusca.trim()) return;
    setModo('search');
    setTermoBusca(campoBusca.trim());
  }

  // 4) A INTERAÇÃO — troca de filtro (populares / em cartaz)
  function handleFiltro(novoModo) {
    setCampoBusca('');
    setTermoBusca('');
    setModo(novoModo);
  }

  return (
    <div className="app">
      <header className="marquee">
        <p className="marquee__eyebrow">Cine Fetch</p>
        <h1 className="marquee__title">O que está em cartaz hoje?</h1>

        <div className="search-bar">
          <form className="search-bar__form" onSubmit={handleBuscar}>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Buscar um filme pelo título..."
              value={campoBusca}
              onChange={(e) => setCampoBusca(e.target.value)}
            />
            <button type="submit" className="search-bar__button">
              Buscar
            </button>
          </form>

          <div className="search-bar__filters">
            <button
              type="button"
              className={`filter-pill ${modo === 'popular' ? 'filter-pill--active' : ''}`}
              onClick={() => handleFiltro('popular')}
            >
              Populares
            </button>
            <button
              type="button"
              className={`filter-pill ${modo === 'now_playing' ? 'filter-pill--active' : ''}`}
              onClick={() => handleFiltro('now_playing')}
            >
              Em cartaz
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        {modo === 'search' && termoBusca && (
          <p className="content__context">
            Resultados para <strong>&ldquo;{termoBusca}&rdquo;</strong>
          </p>
        )}

      
        {carregando && (
          <div className="loader">
            <span className="loader__reel" />
            <p>Carregando sessão...</p>
          </div>
        )}

       
        {!carregando && erro && (
          <div className="error-box">
            <p className="error-box__title">A sessão não pôde começar</p>
            <p className="error-box__text">{erro}</p>
            <button className="error-box__retry" onClick={carregarFilmes}>
              Tentar de novo
            </button>
          </div>
        )}

       
        {!carregando && !erro && filmes.length === 0 && (
          <div className="empty-state">
            <p>Nenhum resultado encontrado.</p>
            <span>Tente buscar outro título ou volte para os populares.</span>
          </div>
        )}

       
        {!carregando && !erro && filmes.length > 0 && (
          <div className="movie-grid">
            {filmes.map((filme) => (
              <article className="movie-card" key={filme.id} onClick={() => setFilmeSelecionado(filme)}>
                <div className="movie-card__poster">
                  {getPosterUrl(filme.poster_path) ? (
                    <img
                      src={getPosterUrl(filme.poster_path)}
                      alt={`Pôster de ${filme.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="movie-card__poster-fallback">Sem pôster</div>
                  )}
                  <span className="movie-card__rating">
                     {filme.vote_average ? filme.vote_average.toFixed(1) : '—'}
                  </span>
                </div>
                <div className="movie-card__body">
                  <h3 className="movie-card__title">{filme.title}</h3>
                  <p className="movie-card__year">
                    {filme.release_date ? filme.release_date.slice(0, 4) : '—'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
       {filmeSelecionado && (
        <div className="modal-overlay" onClick={() => setFilmeSelecionado(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setFilmeSelecionado(null)}>×</button>
            <img src={getPosterUrl(filmeSelecionado.poster_path)} alt={filmeSelecionado.title} className="modal-poster" />
            <div className="modal-info">
              <h2>{filmeSelecionado.title}</h2>
              <p className="modal-meta">{filmeSelecionado.release_date?.slice(0,4)} · ★ {filmeSelecionado.vote_average?.toFixed(1)}</p>
              <p className="modal-overview">{filmeSelecionado.overview || 'Sem sinopse disponível.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}