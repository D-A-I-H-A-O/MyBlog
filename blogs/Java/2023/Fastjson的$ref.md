---
title: Fastjson的$ref
date: 2023-01-03
categories:
 - Java
tags:
 - Fastjson
---

```java
JSONObject obj = new JSONObject();
obj.put("obj", "111");

JSONObject a = new JSONObject();
a.put("id", "a");
a.put("obj", obj);

JSONObject b = new JSONObject();
b.put("id", "b");
b.put("obj", obj);

JSONObject c = new JSONObject();
c.put("a", a);
c.put("b", b);

System.out.println(c);
//{"a":{"id":"a","obj":{"obj":"111"}},"b":{"id":"b","obj":{"$ref":"$.a.obj"}}}

System.out.println(JSON.toJSONString(c, SerializerFeature.DisableCircularReferenceDetect));
//{"a":{"id":"a","obj":{"obj":"111"}},"b":{"id":"b","obj":{"obj":"111"}}}
```


转化为`json`字符串后出现了`$ref`字样的东西，这是因为在传输的数据中出现相同的对象时，`fastjson`默认开启引用检测将相同的对象写成引用的形式 默认开启引用检测将相同的对象写成引用的形式。

* `"$ref":".."`	上一级

* `"$ref":"@"`	当前对象，也就是自引用

* `"$ref":"$"`	根对象

* `"$ref":"$.children.0"` 基于路径的引用，相当于 root.getChildren().get(0)


**1.局部关闭**

使用`SerializerFeature.DisableCircularReferenceDetect`关闭循环引用。

```java
JSON.toJSONString(object, SerializerFeature.DisableCircularReferenceDetect);
```

**2.全局配置关闭**

可以在`SpringBoot`项目的`json`配置中将循环引用关闭。`FastJson`的配置增加以下项：

```java
fastConverter.setFeatures(SerializerFeature.DisableCircularReferenceDetect);
```
**3.new新的对象来避免**

我们可以将List中的对象使用`BeanUtil`这样的工具，拷贝为新的对象，然后放到新的集合中返回。

```clike
List<Object> orderListNew = new ArrayList<>();
   orderList.forEach(i->{
       Order target=new Order();
       BeanUtils.copyProperties(i,target);
       orderListNew.add(target);
   });
return orderListNew;
```

**4.禁止序列化**

如果循环引用的数据，前端用不到，那可以在实体类对应的字段加注解禁止序列化，这样前端就不会接收到这个字段的引用数据了。

```clike
@JSONField(serialize = false)
private List<Order> orderList;
```


**5.在该字段的注解上指定序列化时关闭循环引用**

但是很多时候，我们又需要这个数据，所以禁止序列化也是不行滴，接下来看另外一种注解解决方式。

```clike
@JSONField(serialzeFeatures = {SerializerFeature.DisableCircularReferenceDetect})
private List<Object> objectList;
```

