#!/bin/bash 

deploy:
	git add .
	git commit -m "Alterações"
	git push origin main
open-vs:
	sudo code . --user-data-dir
dev:
	sudo yarn dev