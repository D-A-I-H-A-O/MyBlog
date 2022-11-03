---
title: 使用hutool工具类BigExcelWriter导出数据
date: 2022-08-18
categories:
 - Java
tags:
 - excel
---


使用`hutool`工具类`BigExcelWriter`导出数据，如果导出的文件已存在的话会报错。

**依赖：**
```pom
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.7.22</version>
</dependency>
```

**复现代码：**

```java
BigExcelWriter writer= ExcelUtil.getBigWriter("xxx.xlsx");

writer.write(rows);

writer.close();
```

**错误信息：**

```text
java.lang.IllegalArgumentException: Attempting to write a row[0] in the range [0,15] that is already written to disk
```
```text
org.apache.poi.ooxml.POIXMLException: java.io.EOFException: Unexpected end of ZLIB input stream
```

**原因:**

输出没有强制覆盖，为的是防止路径写错导致误操作。

**解决:**

先删除文件，后写出。

```java
BigExcelWriter writer= ExcelUtil.getBigWriter("xxx.xlsx");

file.delete();

writer.write(rows);

writer.close();
```



