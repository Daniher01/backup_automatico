 Para montar la imagen
- sudo mount -t cifs -o guest,uid=1000,gid=1003 //192.168.1.117/Public/RespaldoArchivosServidor /mnt/nas

 Para verificar si está correctamente montada 
- df -h | grep /mnt/nas