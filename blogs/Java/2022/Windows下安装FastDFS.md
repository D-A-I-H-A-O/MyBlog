---
title: Windows下安装FastDFS
date: 2022-05-09
categories:
 - Java
tags:
 - FastDFS
---


`FastDFS`是没有`Windows`版本的，所以采取了`Docker`去安装,不同`Windows`系统，`Docker`安装不尽相同。

[Windows11下安装Docker](https://blog.csdn.net/zou_hailin226/article/details/121278799)

**克隆项目**

```txt
git clone https://qbanxiaoli@github.com/qbanxiaoli/fastdfs.git 
```

修改`docker-compose.yml`，指定IP(多个IP集群用逗号分割)

```yml
version: '3'
services:
  fastdfs:
    build: .
    image: qbanxiaoli/fastdfs
    # 该容器是否需要开机启动+自动重启。若需要，则取消注释。
    restart: always
    container_name: fastdfs
    ports:
      - "80:80"
      - "22122:22122"
      - "23000:23000"
    environment:
      # nginx服务端口,默认80端口，可修改
      WEB_PORT: 80
      # tracker_server服务端口，默认22122端口，可修改
      FDFS_PORT: 22122
      # storage_server服务端口，默认23000端口，可修改
      STORAGE_PORT: 23000
      # fastdht服务端口，默认11411端口，可修改
      FDHT_PORT: 11411
      # docker所在宿主机IP内网地址，默认使用eth0网卡的地址（这里用windows主机ip）
      IP: 192.168.1.250
      # 防盗链配置
      # 是否做token检查，缺省值为false
      CHECK_TOKEN: 1
      # 生成token的有效时长，默认900s
      TOKEN_TTL: 900
      # 生成token的密钥
      SECRET_KEY: FastDFS1234567890
      # token检查失败，返回的本地文件内容，可以通过文件挂载的方式进行修改
      TOKEN_CHECK_FAIL: /etc/fdfs/anti-steal.jpg
    volumes:
      # 将本地目录映射到docker容器内的fastdfs数据存储目录，将fastdfs文件存储到主机上，以免每次重建docker容器，之前存储的文件就丢失了。
      - ./fastdfs:/var/local
    # 由于windows和unix识别不了host网络，目前需要新建网段，强制指定容器ip与宿主机ip一致（这里同样用windows主机ip）
    networks:
      fastdfs_net:
        ipv4_address: 192.168.1.250

 #新建一个网段，名称fastdfs_net，bridge类型。要和windows主机ip网段一致（192.168.1-192.168.1）
networks:
  fastdfs_net:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.1.0/24
```

执行`docker-compose`命令，`linux`环境下需要指定使用`docker-compose-linux.yml`文件

```go
 docker-compose up -d 或者 docker-compose -f docker-compose-linux.yml up -d
```


不用`docker-compose.yml`，或者其他镜像搭建也是同样道理，**需要新建网段，强制指定容器ip与宿主机ip一致**。
这样`tracker_server`才能连到`storage_server`，外部服务才能连到`tracker_server`。


