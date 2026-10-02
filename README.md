# Backend Template

API em Node.js com Fastify, Prisma e PostgreSQL. A lista de comandos do projeto está no Makefile. `make` (ou `make help`) imprime todos eles.

## Requisitos

- Node.js 26.5.0 (versão em `.tool-versions`)
- npm
- Docker
- Make

## Subir o projeto

Instale as dependências e gere o client do Prisma:

```sh
make setup
```

Suba o Postgres e a API em container:

```sh
make infra
```

Aplique as migrations no banco de desenvolvimento (`envs/.env.development`):

```sh
make db/deploy/dev
```

A API fica em [http://localhost:3000](http://localhost:3000). A documentação interativa fica em [http://localhost:3000/docs](http://localhost:3000/docs).

Para desenvolver na máquina, com reload ao salvar, pare o container da API (ele usa a porta 3000) e suba o processo local. O Postgres iniciado por `make infra` continua no ar:

```sh
docker compose stop application
make start/dev
```

`make start` sobe a API com `envs/.env.production`. As migrations desse ambiente saem com `make db/deploy`.

## Testes

Os testes de integração usam o Postgres de desenvolvimento. Deixe o banco no ar (`make infra`) e as migrations aplicadas (`make db/deploy/dev`) antes de rodá-los.

```sh
make test
```

No CI, com cobertura:

```sh
make test/ci
```

Cada teste limpa as tabelas da aplicação antes de executar.

## Banco de dados

| Comando | Uso |
| --- | --- |
| `make db/client` | Gera o client do Prisma. O `make setup` já faz isso. |
| `make db/migrate` | Cria uma migration a partir do schema em `prisma/`. O Prisma pede o nome. |
| `make db/deploy/dev` | Aplica as migrations no banco de desenvolvimento. |
| `make db/deploy` | Aplica as migrations no banco de produção. |
| `make db/reset` | Apaga e recria o banco de desenvolvimento. |
| `make db/studio` | Abre o Prisma Studio. |

A URL do banco de desenvolvimento está em `envs/.env.development` e aponta para `localhost:5432`, a porta publicada pelo Postgres do Docker.

## Código

```sh
make code/check
make code/format
make code/lint
```

`make code/check` roda o Biome e o TypeScript. `make code/format` formata os arquivos e `make code/lint` aplica as correções de lint.

Em CI, a instalação usa o lockfile:

```sh
make setup/ci
```
