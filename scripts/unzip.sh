#!/bin/bash

# 要监控的目录和操作
WATCH_DIR="/var/www/html/tmp"
UNZIP_DIR="/var/www/html/build"

while true; do
    # 使用inotifywait监控目录中是否有CREATE事件（新文件）
    inotifywait -e create "$WATCH_DIR" -q
    
    # 获取新增的ZIP文件
    NEW_ZIP_FILE=$(ls "$WATCH_DIR"/*.zip | head -n 1)
    
    # 如果有新增的ZIP文件，则执行解压操作
    if [ -n "$NEW_ZIP_FILE" ]; then
        unzip "$NEW_ZIP_FILE" -d "$UNZIP_DIR"
        echo "解压完成: $NEW_ZIP_FILE"
    fi
    rm "$NEW_ZIP_FILE"
done
