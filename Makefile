.PHONY: test clean readme build

.DEFAULT_GOAL:=help

help: ## Prints the help about targets.
	@printf "Usage:    make [\033[34mtarget\033[0m]\n"
	@printf "Default:  \033[34m%s\033[0m\n" $(.DEFAULT_GOAL)
	@printf "Targets:\n"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf " \033[34m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

install: ## Install all dependencies.
	@printf "Install all dependencies...\n"
	npm install

start: ## Starts the development simple game server (`ts` code).
	@printf "Starting the the simple game server (ts code)...\n"
	npm run start:ts

start-js: ## Starts the the simple game server (`js` code).
	@printf "Starting the the simple game server (js code)...\n"
	npm run start:js

prod: ## Transpiles, lints and tests the code before starting the simple game server`.
	@printf "Transpile, lint, test and start server...\n"
	npm run start:prod

readme: ## Creates the README.md.
	@printf "Creating the README.md...\n"
	npm run readme

lint: ## Starts the linter.
	@printf "Starting the linter...\n"
	npm run lint

test: ## Starts the tests.
	@printf "Starting the tests...\n"
	npm test

build: ## Transpiles the code from `ts` to `js`.
	@printf "Transpile...\n"
	npm run build
