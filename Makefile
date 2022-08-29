build-dev:
	docker build -t kerbb-api-dev -f Dockerfile.dev .

build-local:
	docker build -t kerbb-api-production:local -f Dockerfile.production .

build-production:
	docker build -t kerbb-api-production:production -f Dockerfile.production .

