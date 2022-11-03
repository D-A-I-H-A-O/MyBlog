---
title: SpringBoot集成FastDFS
date: 2022-05-09
categories:
 - Java
tags:
 - FastDFS
---

`fastdfs-client` `Java`客户端并没有存在`maven`仓库，需要手动下载打包安装进本地仓库。

`clone`项目
```go
git clone https://github.com/happyfish100/fastdfs-client-java.git
```

如果环境变量中有`maven` ，可直接执行命令：

```go
mvn clean install
```
如果没有，可以导入项目到`IDEA`中，进行打包，先`clean`, 再`install`(部署到本地仓库)

然后就可以在项目pom.xml中添加依赖

```go
<dependency>
    <groupId>org.csource</groupId>
    <artifactId>fastdfs-client-java</artifactId>
    <version>1.29-SNAPSHOT</version>
</dependency>
```

原作者是使用了`.conf` 配置文件或`.conf` 配置文件，但是我想使用`application.yml`文件

```yml
fastdfs:
  tracker_servers: 192.168.1.250:22122
  secret_key: FastDFS1234567890
```

```java
@Data
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "fastdfs")//使用ConfigurationProperties，没有获取到值，至少不影响其他服务
public class FastDFSConfiguration {
 
    private String trackerServers;
    private String secretKey;

 
    @Bean
    public StorageClient storageClient(){
        try{
            Properties props = new Properties();
            props.put(ClientGlobal.PROP_KEY_TRACKER_SERVERS, trackerServers);
            props.put(ClientGlobal.CONF_KEY_HTTP_SECRET_KEY, secretKey);
            ClientGlobal.initByProperties(props);
 
            TrackerClient trackerClient = new TrackerClient();
            TrackerServer trackerServer = trackerClient.getTrackerServer();
            StorageServer storageServer=trackerClient.getStoreStorage(trackerServer);

            return new StorageClient(trackerServer,storageServer);
        }catch (Exception e){
            log.error("加载StorageClient 异常", e);
        }

        return null;
    }
}
```

