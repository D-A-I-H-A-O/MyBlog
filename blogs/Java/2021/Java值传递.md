title: Java值传递
date: 2021-06-02
categories:

 - Java
tags:
 - 数据类型



﻿Java基本类型是直接存储在栈上的，而引用类型则是存储在堆上的，栈上只存储一个对象的引用。

```java
int i = 1;
String str = new String ("str");
```
两个变量存储图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210608205449399.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
分别给变量赋值
```java
i = 0;
str = new String ("str1");
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210608205857239.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
i只是将栈上值修改为0，而str为String引用类型，所以会重新创建以一个String对象，修改str，让其指向新的堆对象


值传递：传递的是存储单元中的内容，而非地址或者引用

当一个对象被当作参数传递到一个方法后，此方法可改变这个对象的属性，并可返回变化后的结果，那么这里到底是值传递还是引用传递? 
    答:是值传递。Java 编程语言只有值传递参数。当一个对象实例作为一个参数被传递到方法中时，参数的值就是该对象的引用一个副本。指向同一个对象,对象的内容可以在被调用的方法中改变，但对象的引用(不是引用的副本)是永远不会改变的。
