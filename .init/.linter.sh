#!/bin/bash
cd /home/kavia/workspace/code-generation/digitest-login-interface-18666/login_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

