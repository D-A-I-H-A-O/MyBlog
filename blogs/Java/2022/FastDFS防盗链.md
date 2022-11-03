---
title: FastDFS防盗链
date: 2022-05-09
categories:
 - Java
tags:
 - FastDFS
---
 `FastDFS`内置防盗链采用`Token`的方式。`Token`是带时效的，也就是说在设定的时间范围内，比如1分钟，`token`是有效的。`token`包含了`文件id`、`时间戳ts`和`密钥`。`FastDFS`在`URL`中带上当前时间戳和带时效的`token`，参数名分别为`ts`和`token`。`Token`的生成和校验都是在服务端，因此不会存在安全问题。

```go
http://192.168.1.250:80/group1/M00/00/00/wKgB9WJzhVyANDPsAABXnhfXmqQ24.xlsx?token=08a6f962effff0a839411b1ab2359caa&ts=1651894588
```

`http.conf`配置文件说明

`http.anti_steal.check_token:`是否做`token`检查，缺省值为`false`。

`http.anti_steal.token_ttl：` `token TTL`，即生成`token`的有效时长

`http.anti_steal.secret_key：`生成`token`的密钥，尽量设置得长一些，千万不要泄露出去

`http.anti_steal.token_check_fail：` `token`检查失败，返回的文件内容，需指定本地文件名

配置示例：

```go
# HTTP default content type
http.default_content_type = application/octet-stream

# MIME types mapping filename
# MIME types file format: MIME_type  extensions
# such as:  image/jpeg	jpeg jpg jpe
# you can use apache's MIME file: mime.types
http.mime_types_filename=mime.types

# if use token to anti-steal
# default value is false (0)

http.anti_steal.check_token=true

# token TTL (time to live), seconds
# default value is 600
http.anti_steal.token_ttl=60

# secret key to generate anti-steal token
# this parameter must be set when http.anti_steal.check_token set to true
# the length of the secret key should not exceed 128 bytes
http.anti_steal.secret_key=FastDFS1234567890

# return the content of the file when check token fail
# default value is empty (no file sepecified)
http.anti_steal.token_check_fail=/etc/fdfs/anti-steal.jpg
```

**java 方法**

```java
/**
fileId:group1/M00/00/00/wKgB9WJzhVyANDPsAABXnhfXmqQ24.xlsx
secretKey:FastDFS1234567890
**/
  public String getToken(String fileId,String secretKey) {
      String url = fileId.substring(fileId.indexOf("/") + 1);

      int lts = (int) (System.currentTimeMillis() / 1000);
      String token = "";
      try {
          token = ProtoCommon.getToken(url, lts,secretKey);
          token = fileId + "?token=" + token + "&ts=" + lts;
      } catch (Exception e) {
          log.error("文件Token获取失败：" + e);
      }
      //group1/M00/00/00/wKgB9WJzhVyANDPsAABXnhfXmqQ24.xlsx?token=08a6f962effff0a839411b1ab2359caa&ts=1651894588
      return token;
  }
```

**生成的`token`验证无法通过**

出现这样的问题请进行如下两项检查：

1、  确认调用`token`生成函数，传递的文件`id`中没有包含`group name`,传递的文件id形如：

```go
M00/00/00/wKgB9WJzhVyANDPsAABXnhfXmqQ24.xlsx
```

2、  确认服务器时间基本是一致的，注意服务器时间不能相差太多，不要相差到分钟级别
