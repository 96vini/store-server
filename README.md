# Store Server

Aplicação em Node.js utilizando o Typescript. O projeto disponibiliza uma API em Rest para a manutenção de usuários, produtos e pedidos de um ecosistema.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 20.10.0 ou superior)
- npm (geralmente vem com o Node.js) ou yarn
- Docker
- Docker Compose (opcional, se estiver usando)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/96vini/store-server.git
```
2. Instale as dependencias:

```bash
cd store-server
npm install
```

## Configuração

Renomeie o arquivo .env.example para .env e preencha as variáveis de ambiente conforme necessário.

## Uso

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```
Para construir o projeto:

```bash
npm run build
```

Para iniciar o projeto em produção:

```bash
npm start
```

## Testes

Para executar os testes:

```bash
npm test
```

## Docker

Para criar e executar a aplicação usando Docker:

1. Levante o container do Docker descrito em `docker-composer.yml`:

```bash
docker composer up -d
```

## Contribuição

1. Fork o projeto
2. Crie sua branch de feature (git checkout -b feature/AmazingFeature)
3. Faça commit de suas alterações (git commit -m 'Add some AmazingFeature')
4. Envie para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT