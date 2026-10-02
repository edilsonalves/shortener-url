default: help

.PHONY: help
help:
	@echo 'Usage: make <command>'
	@sed -n 's/^## //p' $(MAKEFILE_LIST) | column -ts ':'

# --- Commands ---

## setup: Setup the project.
.PHONY: setup
setup:
	@echo 'Setting up project...'
	@npm install
	@make db/client

## setup/ci: Setup the project (ci).
.PHONY: setup/ci
setup/ci:
	@echo 'Setting up project (ci)...'
	@npm ci
	@make db/client

## start: Start the application.
.PHONY: start
start:
	@echo 'Starting application...'
	@npm run start

## start/dev: Start the application (dev).
.PHONY: start/dev
start/dev:
	@echo 'Starting application (dev)...'
	@npm run start:dev

## infra: Start the infrastructure.
.PHONY: infra
infra:
	@echo 'Starting infrastructure...'
	@docker compose up -d && sleep 5

## db/client: Generate database client.
.PHONY: db/client
db/client:
	@echo 'Generating database client...'
	@npm run db:client

## db/deploy: Deploy database migrations.
.PHONY: db/deploy
db/deploy:
	@echo 'Deploying database migrations...'
	@npm run db:deploy

## db/deploy/dev: Deploy database migrations (dev).
.PHONY: db/deploy/dev
db/deploy/dev:
	@echo 'Deploying database migrations (dev)...'
	@npm run db:deploy:dev

## db/migrate: Create database migration.
.PHONY: db/migrate
db/migrate:
	@echo 'Creating database migration...'
	@npm run db:migrate

## db/reset: Reset database.
.PHONY: db/reset
db/reset:
	@echo 'Resetting database...'
	@npm run db:reset

## db/studio: Open database studio.
.PHONY: db/studio
db/studio:
	@echo 'Opening database studio...'
	@npm run db:studio

## code/check: Check the code.
.PHONY: code/check
code/check:
	@echo 'Checking code...'
	@npm run code:check

## code/format: Format the code.
.PHONY: code/format
code/format:
	@echo 'Formatting code...'
	@npm run code:format

## code/lint: Lint the code.
.PHONY: code/lint
code/lint:
	@echo 'Linting code...'
	@npm run code:lint

## test: Run the tests.
.PHONY: test
test:
	@echo 'Running tests...'
	@npm test

## test/ci: Run the tests (ci).
.PHONY: test/ci
test/ci:
	@echo 'Running tests (ci)...'
	@npm run test:ci
