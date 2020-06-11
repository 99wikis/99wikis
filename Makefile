.PHONY: help install
.DEFAULT_GOAL := help

STAGE ?= dev
version := local

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install node dependencies for api and site
	@cd api && npm install
	@cd site && npm install

deploy: deploy/permissions deploy/database deploy/api deploy/site ## Deploy (via serverless) the entire app

deploy/permissions: ## Deploy (via serverless) the Permissions setup
	@echo ">>> Deploying permissions..."
	@cd permissions && \
	serverless deploy --stage $(STAGE)

deploy/database: ## Deploy (via serverless) the databases
	@echo ">>> Deploying databases..."
	@cd database && \
	serverless deploy --all --stage $(STAGE)

deploy/api: ## Deploy (via serverless) the API
	@echo ">>> Deploying api..."
	@cd api && \
	serverless deploy --stage $(STAGE) --debug

deploy/site: ## Deploy (via serverless) the WebApp
	@echo ">>> Deploying site..."
	@cd api && \
		export API_URL=`serverless info --stage $(STAGE) | sed -e 's/\[22m//g' | grep "url:" | cut -d " " -f2` && \
		cd ../site && \
		(echo "cat <<EOF" ; cat src/infrastructure/config.template.js ; echo EOF) | sh | sed 's/EOF//g' > src/infrastructure/config.js && \
		serverless deploy --stage $(STAGE)

remove: remove/permissions remove/database remove/api remove/site ## Remove (via serverless) the entire app

remove/permissions: ## Remove (via serverless) the Permissions setup
	@echo ">>> Removing permissions..."
	@cd permissions && \
	serverless remove --stage $(STAGE)

remove/database: ## Remove (via serverless) the databases
	@echo ">>> Removing databases..."
	@cd database && \
	serverless remove --all --stage $(STAGE)

remove/api: ## Remove (via serverless) the API
	@echo ">>> Removing api..."
	@cd api && \
	serverless remove --stage $(STAGE) --debug

remove/site: ## Remove (via serverless) the WebApp
	@echo ">>> Removing site..."
	@cd site && \
	serverless remove --stage $(STAGE)
