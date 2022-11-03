---
title: Mybatis
date: 2021-01-28
categories:
 - Java
tags:
 - Mybatis
---

# 简介

[mybatis文档](https://mybatis.org/mybatis-3/zh/index.html) 

`MyBatis` 是支持定制化` SQL`、存储过程以及高级映射的优秀的持久层框架。

`MyBatis` 避免了几乎所有的 `JDBC` 代码和手动设置参数以及获取结果集。

`MyBatis`可以使用简单的`XML`或注解用于配置和原始映射，将接口和`Java`的`POJO（Plain Old Java Objects`，普通的`Java`对象）映射成数据库中的记录。

**为什么要使用`mybatis`**

`MyBatis`是一个半自动化的持久化层框架。

`jdbc`编程---当我们使用`jdbc`持久化的时候，`sql`语句被硬编码到`java`代码中。这样耦合度太高。代码不易于维护。在实际项目开发中会经常添加`sql`或者修改`sql`，这样我们就只能到`java`代码中去修改。

**`Hibernate`和`JPA`**

长难复杂`SQL`，对于`Hibernate`而言处理也不容易

内部自动生产的`SQL`，不容易做特殊优化。

基于全映射的全自动框架，`javaBean`存在大量字段时无法只映射部分字段。导致数据库性能下降。


对开发人员而言，核心`sql`还是需要自己优化

`sql`和`java`编码分开，功能边界清晰，一个专注业务、一个专注数据。

可以使用简单的`XML`或注解用于配置和原始映射，将接口和`Java`的`POJO`映射成数据库中的记录。成为业务代码+底层数据库的媒介

[ 三歪教你学Java-mybatis](https://gitee.com/zhongfucheng/Java3y/#mybatis)

# MyBatis基本工作原理
`MyBatis`通过`SqlSessionFactoryBuilder`从`mybatis-config.xml`配置文件中构建出`SqlSessionFactory`，然后，`SqlSessionFactory`的实例直接开启一个`SqlSession`，再通过`SqlSession实例`获得`Mapper`对象并运行`Mapper`映射的`SQL`语句，完成对数据库的`CRUD`和事务提交，之后关闭`SqlSession`.

![在这里插入图片描述](https://img-blog.csdnimg.cn/ad49c9f3956f4cf2972d58e861447de7.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


# 面试题
## #{}和${}的区别

`#{}`会解析传递进来的参数数据

`${}`对传递进来的参数原样直接拼接在sql中

`#{}`是预编译处理，`${}`是字符串替换。使用`#{}`可以有效防止`SQL`注入，提高系统安全性。

## 当实体类中的属性名和表中的字段名不一样，怎么办

1、通过在查询的`sql`语句中定义字段名的别名，让字段名的别名和实体类的属性名一致
2、通过`<resultMap>`来映射字段名和实体类属性名的对应关系

```xml
<select id="getOrder" parameterType="int" resultMap="orderresultmap">
        select * from orders where order_id=#{id}
</select>

<resultMap type=”me.gacl.domain.order” id=”orderresultmap”> 
   <!–用id属性来映射主键字段–> 
   <id property=”id” column=”order_id”> 
   <!–用result属性来映射非主键字段，property为实体类属性名，column为数据表中的属性–> 
   <result property = “orderno” column =”order_no”/> 
   <result property=”price” column=”order_price” /> 
</reslutMap>
```
## 在mapper中如何传递多个参数?

1、使用占位符‘

```xml
//对应的xml,#{0}代表接收的是dao层中的第一个参数，#{1}代表dao层中第二参数，更多参数一致往后加即可。
<select id="selectUser"resultMap="BaseResultMap">  
    select *  fromuser_user_t   whereuser_name = #{0} anduser_area=#{1}  
</select>  
```

2、使用@param注解来命名参数

```java
public interface usermapper { 
   user selectuser(@param(“username”) string username, 
     @param(“hashedpassword”) string hashedpassword); 
}

```
```xml
<select id=”selectuser” resulttype=”user”> 
       select id, username, hashedpassword 
       from some_table 
       where username = #{username} 
       and hashedpassword = #{hashedpassword} 
</select>
```

3、使用Map集合作为参数来装载

```java
try{
    //映射文件的命名空间.SQL片段的ID，就可以调用对应的映射文件中的SQL
    /**
     * 由于我们的参数超过了两个，而方法中只有一个Object参数收集
     * 因此我们使用Map集合来装载我们的参数
     */
    Map<String, Object> map = new HashMap();
    map.put("start", start);
    map.put("end", end);
    return sqlSession.selectList("StudentID.pagination", map);
}catch(Exception e){
    e.printStackTrace();
    sqlSession.rollback();
    throw e;
}finally{
    MybatisUtil.closeSqlSession();
}
```

```xml
<!--分页查询-->
<select id="pagination" parameterType="map" resultMap="studentMap">

	/*根据key自动找到对应Map集合的value*/
	select * from students limit #{start},#{end};

</select>
```

## `Mybatis`动态`sql`是做什么的？都有哪些动态`sql`？能简述一下动态`sql`的执行原理不？

`Mybatis`动态`sql`可以让我们在Xml映射文件内，以标签的形式编写动态`sql`，完成逻辑判断和动态拼接`sql`的功能。

`Mybatis`提供了9种动态`sql`标签：`trim|where|set|foreach|if|choose|when|otherwise|bind`。

其执行原理为，使用`OGNL`从`sql`参数对象中计算表达式的值，根据表达式的值动态拼接`sql`，以此来完成动态`sql`的功能。

[深入了解MyBatis参数](https://blog.csdn.net/isea533/article/details/44002219)

[MyBatis中的OGNL教程](https://blog.csdn.net/isea533/article/details/50061705)


## Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？

如果配置了`namespace`那么当然是可以重复的，因为我们的`Statement`实际上就是`namespace+id`

如果没有配置`namespace`的话，那么相同的id就会导致覆盖了。



## 为什么说Mybatis是半自动ORM映射工具？它与全自动的区别在哪里？

`Hibernate`属于全自动`ORM`映射工具，使用`Hibernate`查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。

而`Mybatis`在查询关联对象或关联集合对象时，需要手动编写`sql`来完成，所以，称之为半自动`ORM`映射工具。
## 通常一个Xml映射文件，都会写一个Dao接口与之对应，请问，这个Dao接口的工作原理是什么？Dao接口里的方法，参数不同时，方法能重载吗？

* `DAO`接口，就是人们常说的`mapper`接口，接口的全限定名，就是映射文件中的`namespace`的值，接口的方法名，就是映射文件中`MappedStatement`的`id`值，接口方法内的参数，就是传递给`sql`的参数。

* `Mapper`接口是没有实现类的，当调用接口方时，接口全限定名+方法名拼接字符串作为`key`值，可唯一定位一个`MappedStatement`

```java
com.mybatis3.mappers.StudentDao.findStudentById，

可以唯一找到namespace为com.mybatis3.mappers.StudentDao下面id = findStudentById的MappedStatement。在Mybatis中，每一个<select>、<insert>、<update>、<delete>标签，都会被解析为一个MappedStatement对象。
```

Dao接口里的方法，是不能重载的，因为是全限名+方法名的保存和寻找策略。

Dao接口的工作原理是JDK动态代理，Mybatis运行时会使用JDK动态代理为Dao接口生成proxy对象，代理对象proxy会拦截接口方法，转而执行MappedStatement所代表的sql，然后将sql执行结果返回。


## Mybatis是否支持延迟加载？如果支持，它的实现原理是什么？
`Mybstis`仅支持`association`关联对象和`collection`关联集合对象的延迟加载，`association`指的就是一对一，`collection`指的就是一对多查询，在`mybatis`配置文件中，可以配置是否启用延迟加载`lazyLoadingEnabled=true/false`。

它的原理是，使用` CGLIB `或` Javassist( 默认 ) `创建目标对象的代理对象。当调用代理对象的延迟加载属性的 `getting `方法时，进入拦截器方法。比如调用 `a.getB().getName() `方法，进入拦截器的`invoke(…)` 方法，发现`a.getB() `需要延迟加载时，那么就会单独发送事先保存好的查询关联` B `对象的 `SQL` ，把 `B `查询上来，然后调用 `a.setB(b)` 方法，于是 `a `对象` b `属性就有值了，接着完成`a.getB().getName() `方法的调用

[MyBatis延迟加载原理（源码剖析)](https://blog.csdn.net/yangxiaofei_java/article/details/111148980)

## Mybatis缓存
* `Mybatis`提供一级缓存和二级缓存
* 一级缓存是一个`SqlSession`级别，`SqlSession`只能访问自己的一级缓存的数据。（`spring结合mybatis`,未开启事务下，每次都会产生新的`SqlSession`,一级缓存失效。）

[你凭什么说Spring会导致MyBatis的一级缓存失效！](https://cloud.tencent.com/developer/article/1697591)

[spring结合mybatis时一级缓存失效问题](https://blog.csdn.net/u013887008/article/details/80379938)

`Mybatis`的一级缓存原理：

第一次发出一个查询`sql`，`sql`查询结果写入`sqlsession`的一级缓存中，缓存使用的数据结构是一个`map`

`key`：hashcode+sql+sql输入参数+输出参数（sql的唯一标识）

`value`：用户信息

同一个`sqlsession`再次发出相同的`sql`，就从缓存中取不走数据库。如果两次中间出现`commit`操作（修改、添加、删除），本`sqlsession`中的一级缓存区域全部清空，下次再去缓存中查询不到所以要从数据库查询，从数据库查询到再写入缓存。

二级缓存原理：

二级缓存的范围是`mapper`级别（`mapper`同一个命名空间），`mapper`以命名空间为单位创建缓存数据结构，结构是`map`。

如果二级缓存中没有找到，再从一级缓存中去找，如果一级缓存中也没有，则从数据库中查询。


http://www.mybatis.cn/archives/809.html
