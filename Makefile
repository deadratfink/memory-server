.PHONY: test clean readme build

.DEFAULT_GOAL:=help

help: ## Prints the help about targets.
	@printf "Usage:    make [\033[34mtarget\033[0m]\n"
	@printf "Default:  \033[34m%s\033[0m\n" $(.DEFAULT_GOAL)
	@printf "Targets:\n"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf " \033[34m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

install: ## Installs all modules.
	@printf "Install all modules...\n"
	npm install

start: ## Starts the development server.
	@printf "Starting the development server...\n"
	npm run start:dev

start-prod: ## Starts the production server.
	@printf "Starting the production server...\n"
	npm run start

build: ## Starts the build to folder _./dist_
	@printf "Starting the build...\n"
	npm run build

lint: ## Starts the linter.
	@printf "Starting the linter...\n"
	npm run lint
