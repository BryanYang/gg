#!/bin/bash

# 压缩 build 目录为 build.zip
zip -r build.zip build
echo "压缩完成"
# 上传 build.zip 到远程服务器（假设服务器IP为 SERVER_IP，目标路径为 /path/to/remote/directory）
SERVER_IP="49.235.113.228"
REMOTE_PATH="/var/www/html/tmp"

echo "开始上传"
# 使用SSH密钥对进行身份验证，无需密码
scp build.zip ubuntu@$SERVER_IP:$REMOTE_PATH

# 清理临时文件
rm build.zip

echo "上传完成"