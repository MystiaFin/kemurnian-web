.PHONY: dev stop

dev:
	./vendor/bin/sail up -d
	./vendor/bin/sail pnpm dev

stop:
	./vendor/bin/sail down
