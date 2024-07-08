#!/bin/bash

# Variables
SOURCE_DIR=/home/ubuntu/tuimagen/files
BACKUP_DIR=//wdmycloudex4100/Public/RespaldoArchivosServidor/files
SERVER_IP=129.151.123.60
SERVER_USER=ubuntu
SSH_PORT=22
SSH_KEY_PATH=c:/Users/danih/Documentos/Proyectos/backup_automatico/ssh-key-2024-05-24.key  # Ruta actualizada

# Comando rsync
rsync -avz -e "ssh -i ${SSH_KEY_PATH} -p ${SSH_PORT}" ${SERVER_USER}@${SERVER_IP}:${SOURCE_DIR} ${BACKUP_DIR}
