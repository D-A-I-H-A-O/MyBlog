---
title: Java自定义注解
date: 2021-06-02
categories:
 - Java
tags:
 - 注解
---

﻿## 注解

是一种能被添加到java源代码中的元数据，方法、类、参数和包都可以用注解来修饰。注解可以看作是一种特殊的标记，用来说明程序的，可以用在方法、类、参数和包上，程序在编译或者运行时可以检测到这些标记而进行一些特殊的处理。

## JDK中预定义的一些注解
@Override：检测被该注解标注的方法是否是继承自夫类/接口的
@Deprecated：表示该注解标注的内容，已过时
@SuppressWarnings：压制警告

## 注解规则
* 修饰符：访问修饰符必须为public，不写默认public
* 关键字：@interface
* 注解名称：注解名称为自定义注解的名称
* 注解类型元素：注解类型元素是注解中的内容，可以理解成自定义接口的实现部分

## 自定义注解
```java
//保留策略:设置注解的作用时机（生命周期
@Retention(RetentionPolicy.RUNTIME)
//目标:可以用来修饰什么数据
//需要传递ElementType类型的数据，可以传递多个
@Target({ElementType.FIELD,ElementType.PARAMETER})
//能否在生成的帮助文档中显示
@Documented
//可以被继承，所标记的类的子类也会拥有这个注解
@Inherited
public @interface CustomAnnotations {
}
```

使用javac命令编译，查看源码：
```java
public interface CustomAnnotations extends java.lang.annotation.Annotation{}
```
注解本质是一个继承了Annotation 的特殊接口，其具体实现类是Java 运行时生成的动态代理类。而我们通过反射获取注解时，返回的是Java 运行时生成的动态代理对象$Proxy1。通过代理对象调用自定义注解（接口）的方法，会最终调用AnnotationInvocationHandler 的invoke 方法。该方法会从memberValues 这个Map 中索引出对应的值。而memberValues 的来源是Java 常量池。


## 元注解
元注解就是用于描述注解的注解
### @Target
描述注解能够作用的位置
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {

    ElementType[] value();

}
```
```java
public enum ElementType {
    /** 类和接口上 */
    TYPE,

    /** 字段上 */
    FIELD,

    /** 方法上 */
    METHOD,

    /** 参数上 */
    PARAMETER,

    /** 构造上 */
    CONSTRUCTOR,

    /** 本地变量上 */
    LOCAL_VARIABLE,

    /** 注解上 */
    ANNOTATION_TYPE,

    /** 包上 */
    PACKAGE,

    /**
     * 类型参数上
     *
     * @since 1.8
     */
    TYPE_PARAMETER,

    /**
     * Use of a type
     *
     * @since 1.8
     */
    TYPE_USE
}
```

## @Retention
描述注解能够保留的阶段
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Retention {
    /**
     * Returns the retention policy.
     * @return the retention policy
     */
    RetentionPolicy value();
}
```
```java
public enum RetentionPolicy {
    /**
     * 注解只保留在源文件，当Java文件编译成class文件的时候，注解被遗弃；
     */
    SOURCE,

    /**
     * 注解被保留到class文件，但jvm加载class文件时候被遗弃，这是默认的生命周期；
     */
    CLASS,

    /**
     * 注解不仅被保存到class文件中，jvm加载class文件之后，仍然存在；（自定义注解一般都用RUNTIME）
     */
    RUNTIME
}
```

## @Documented
描述注解是否能被抽取到API文档中,加上该注解后，其修饰的注解会被抽取到JavaDoc文档中

## @Inherited
描述注解是否可以被子类继承,加入此注解后继承了加了此注解修饰的类的子类，也会自动加上该注解修饰的注解

## @Repeatable
Repeatable Java SE 8中引入的，@Repeatable注释表明标记的注释可以多次应用于相同的声明或类型使用(即可以重复在同一个类、方法、属性等上使用)。
