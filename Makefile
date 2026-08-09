JS?=bun
PM?=bun
PM_OPTIONS?=--ignore-scripts
RUN?=bunx
RUN_OPTIONS?=--bun
SHELL:=/bin/bash
DEPENDENCY_UPDATER=dependabot[bot]

all: dist check e2e-tests

clean:
	rm -rf coverage playwright-report test-results
	rm -rf node_modules/.tmp

distclean: clean
	rm -rf dist
	rm -rf node_modules

dist: build

start: prepare
	$(PM) run $(RUN_OPTIONS) vite preview

domain:
	esdm view

domain-with-details:
	esdm view --with-details

check: test check-esdm check-typing check-eslint check-stylelint check-prettier check-sheriff

check-esdm:
	esdm lint

check-typing:
	$(RUN) $(RUN_OPTIONS) tsc -b

check-eslint:
	$(RUN) $(RUN_OPTIONS) eslint .

check-stylelint:
	$(RUN) $(RUN_OPTIONS) stylelint "**/*.css" --ignore-path .gitignore

check-prettier:
	$(RUN) $(RUN_OPTIONS) prettier --check .

check-sheriff:
	$(RUN) $(RUN_OPTIONS) sheriff verify

fix: fix-eslint fix-stylelint fix-prettier

fix-eslint:
	$(RUN) $(RUN_OPTIONS) eslint --fix .

fix-stylelint:
	$(RUN) $(RUN_OPTIONS) stylelint "**/*.css" --fix --ignore-path .gitignore

fix-prettier:
	$(RUN) $(RUN_OPTIONS) prettier --write .

dev: prepare
	$(PM) run $(RUN_OPTIONS) vite

test: prepare
	$(PM) run $(RUN_OPTIONS) vitest run --coverage

watch: prepare
	$(PM) run $(RUN_OPTIONS) vitest watch

unit-tests: prepare
	$(RUN) $(RUN_OPTIONS) vitest run unit

integration-tests: prepare
	$(RUN) $(RUN_OPTIONS) vitest run integration

e2e-tests: prepare
	$(RUN) $(RUN_OPTIONS) playwright test --pass-with-no-tests

e2e-ui: prepare
# WORKAROUND option s--bun is not able to run playwright test --ui
#	$(RUN) $(RUN_OPTIONS) playwright test --ui
	$(RUN) playwright test --ui

build: prepare
	$(PM) run $(RUN_OPTIONS) vite build

prepare: version
ifdef CI
ifeq ($(findstring $(DEPENDENCY_UPDATER), $(GITHUB_ACTOR)), $(DEPENDENCY_UPDATER))
	@echo "dependency updater detected, run $(PM) install"
	$(PM) install $(PM_OPTIONS)
else
	@echo "CI detected, run $(PM) ci"
	$(PM) ci $(PM_OPTIONS)
endif
else
	$(PM) install $(PM_OPTIONS)
endif
	$(RUN) playwright install

version:
	@echo "Using runtime $(JS) version $(shell $(JS) --version)"
	@echo "Using package manager $(PM) version $(shell $(PM) --version)"
	@echo "Using package runner $(RUN) version $(shell $(RUN) --version)"

.PHONY: \
	all clean distclean dist \
	start \
	domain domain-with-details \
	check check-esdm check-typing check-eslint check-stylelint check-prettier check-sheriff \
	fix fix-eslint fix-stylelint fix-prettier \
	dev test watch unit-tests integration-tests e2e-tests e2e-ui \
	build prepare version
