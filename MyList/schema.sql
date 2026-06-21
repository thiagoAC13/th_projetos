-- Schema do banco de dados para o Gerenciador de Animes

-- Criar banco de dados (execute este comando separadamente)
-- CREATE DATABASE anime_manager;

-- Conectar ao banco de dados
-- \c anime_manager;

-- Tabela de animes
CREATE TABLE IF NOT EXISTS animes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('acompanhando', 'visto', 'futuro')),
    favorite BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_animes_status ON animes(status);
CREATE INDEX idx_animes_favorite ON animes(favorite);
CREATE INDEX idx_animes_added_at ON animes(added_at DESC);
CREATE INDEX idx_animes_name ON animes(name);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_animes_updated_at BEFORE UPDATE ON animes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO animes (name, image, status, favorite) VALUES
('Attack on Titan', 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNDQtNDFjNi00ZDU5LWFkNzItOTE1NzQzNjcyNjdmXkEyXkFqcGc@._V1_.jpg', 'acompanhando', true),
('Death Note', 'https://m.media-amazon.com/images/M/MV5BNjRiNmNjMmMtN2U2Yi00ODgxLTk3OTMtMmI1MTI1NjYyZTEzXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg', 'visto', true),
('One Piece', 'https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00NDFjLWE1OTAtNDU3NjgxODMxY2UyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'acompanhando', false);
