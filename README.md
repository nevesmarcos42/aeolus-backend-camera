# Aeolus Backend Camera

## Descrição

Projeto backend para gerenciamento e processamento de dados de câmeras utilizando Node.js, MongoDB e Kafka. Conteinerizado com Docker para facilitar o desenvolvimento e deploy. A aplicação inclui APIs REST para CRUD de câmeras, integração com Kafka para mensageria em tempo real e conexão confiável com MongoDB.

## Tecnologias

- Node.js 18
- MongoDB
- Kafka
- Docker e Docker Compose
- JavaScript (ES Modules)

## Funcionalidades

- CRUD completo para câmeras via API REST
- Integração com Kafka para eventos em tempo real
- Conexão configurada com MongoDB
- Funções auxiliares para testes de eventos
- Estrutura modular organizada para fácil manutenção e escalabilidade

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para execução local)
- Instâncias de MongoDB e Kafka (podem ser rodadas via Docker Compose)

## Instalação e uso

Clone o repositório:
git clone https://github.com/nevesmarcos42/aeolus-backend-camera.git

cd aeolus-backend-camera


Configure as variáveis de ambiente criando um arquivo `.env` baseado no `.env.example`.

Para rodar a aplicação em ambiente Docker:
docker-compose up --build


A aplicação estará disponível na porta `3000`.

## Estrutura do Projeto

src/
├── config/ # Configurações gerais do projeto
├── models/ # Models do banco (ex: Camera)
├── routes/ # Rotas da API REST
├── services/ # Serviços como Kafka consumer
├── test/ # Funções auxiliares para testes
├── utils/ # Utilitários do sistema (ex: validações)
└── app.js # Ponto de entrada da aplicação

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça fork do projeto.
2. Crie uma branch para sua feature ou correção.
3. Faça commits claros e granulares.
4. Abra um Pull Request detalhando as alterações.

## Licença

Este projeto está licenciado sob a licença MIT.

---

© 2025 Aeolus Backend Camera - Desenvolvido por [Seu Nome]



