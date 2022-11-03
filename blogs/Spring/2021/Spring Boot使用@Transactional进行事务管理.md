---
title: Spring Boot使用@Transactional进行事务管理
date: 2021-01-28
categories:
 - Spring
tags:
 - SpringBoot
 - 事务
---

﻿## 序言

事务管理是系统开发中必不可少的一步，通常我们使用的的`Spring框架`为事务管理提供了丰富的功能支持。

`Spring事务管理`分为`编程式`和`声明式`的两种方式。编程式事务指的是通过编码方式实现事务；声明式事务基于`AOP`,将具体业务逻辑与事务处理解耦。声明式事务管理使业务代码逻辑不受污染, 因此在实际使用中声明式事务用的比较多。声明式事务有两种方式，一种是在配置文件（`xml`）中做相关的事务规则声明，另一种是基于`@Transactional`注解的方式在`Spring Boot`流行的时下，基于`xml`中做相关的事务规则声明注定成为过去式。

Spring Boot开启事务只需要一个简单的注解`@Transactional`，因为`@EnableTransactionManagement`在`springboot1.4`以后可以不写。框架在初始化的时候已经默认给我们注入了两个事务管理器的`Bean(JDBC的DataSourceTransactionManager和JPA的JpaTransactionManager)`，其实这就包含了我们最常用的`Mybatis`和`Hibeanate`了。当然如果不是`AutoConfig`的而是自己自定义的，如果是其它的`orm框架`如`beetlsql`，则需要自行配置事务管理器。然后使用`@EnableTransactionManagement`开启事务管理。[Spring Boot自动配置](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-auto-configuration)

## 简单使用
>只需要在方法上加上`@Transactional`注解即可,使用默认配置,抛出异常之后,事务会自动回滚,数据不会插入到数据库。
```java
@Transactional
@Override
public void save() {
    //操作A表
    throw new RuntimeException("操作A表抛异常了");
   //操作B表
}
```
## 复杂使用
### 属性
```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {
    
	/**
	 * 当在配置文件中有多个TransactionManager,可以用该属性指定选择哪个事务管理器。
	 */
	@AliasFor("transactionManager")
	String value() default "";
	/**
	 * 当在配置文件中有多个TransactionManager,可以用该属性指定选择哪个事务管理器。
	 */
	String transactionManager() default "";
	/**
	 * 该属性用于设置事务的传播行为
	 */
	Propagation propagation() default Propagation.REQUIRED;
    /**
     * 该属性用于设置底层数据库的事务隔离级别，事务隔离级别用于处理多事务并发的情况，通常使用数据库的默认隔离级别即可，基本不需要进行设置
     */
	Isolation isolation() default Isolation.DEFAULT;
	/**
	 * 该属性用于设置事务的超时秒数，默认值为-1表示永不超时
	 */
	int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;
	/**
	 * 该属性用于设置当前事务是否为只读事务，设置为true表示只读，false则表示可读写，默认值为false
	 */
	boolean readOnly() default false;
    /**
     * 该属性用于设置需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，则进行事务回滚
     * 指定单一异常类：@Transactional(rollbackFor=RuntimeException.class)
     * 指定多个异常类：@Transactional(rollbackFor={RuntimeException.class, Exception.class})
     */
	Class<? extends Throwable>[] rollbackFor() default {};
    /**
     * 该属性用于设置需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，则进行事务回滚
     * 指定单一异常类名称：@Transactional(rollbackForClassName="RuntimeException")
     * 指定多个异常类名称：@Transactional(rollbackForClassName={"RuntimeException","Exception"})
     */
	String[] rollbackForClassName() default {};
   	/**
   	 * 该属性用于设置不需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，不进行事务回滚。
     * 指定单一异常类：@Transactional(noRollbackFor=RuntimeException.class)
     * 指定多个异常类：@Transactional(noRollbackFor={RuntimeException.class, Exception.class})
   	 */
	Class<? extends Throwable>[] noRollbackFor() default {};
    /**
     * 该属性用于设置不需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，不进行事务回滚。
     * 指定单一异常类名称：@Transactional(noRollbackForClassName="RuntimeException")
     * 指定多个异常类名称：@Transactional(noRollbackForClassName={"RuntimeException","Exception"})
     */
	String[] noRollbackForClassName() default {};

}
```

### 事务的传播行为

```java
public enum Propagation {

	/**
	 * 如果当前存在事务，则加入该事务，如果当前不存在事务，则创建一个新的事务
	 */
	REQUIRED(TransactionDefinition.PROPAGATION_REQUIRED),

	/**
	 * 如果当前存在事务，则加入该事务；如果当前不存在事务，则以非事务的方式继续运行
	 */
	SUPPORTS(TransactionDefinition.PROPAGATION_SUPPORTS),

	/**
	 * 如果当前存在事务，则加入该事务；如果当前不存在事务，则抛出异常。
	 */
	MANDATORY(TransactionDefinition.PROPAGATION_MANDATORY),

	/**
	 * 重新创建一个新的事务，如果当前存在事务，暂停当前的事务。
	 */
	REQUIRES_NEW(TransactionDefinition.PROPAGATION_REQUIRES_NEW),

	/**
	 * 以非事务的方式运行，如果当前存在事务，暂停当前的事务
	 */
	NOT_SUPPORTED(TransactionDefinition.PROPAGATION_NOT_SUPPORTED),

	/**
	 * 以非事务的方式运行，如果当前存在事务，则抛出异常。
	 */
	NEVER(TransactionDefinition.PROPAGATION_NEVER),

	/**
	 * 和 Propagation.REQUIRED 效果一样。
	 */
	NESTED(TransactionDefinition.PROPAGATION_NESTED);
}
```

### 事务的隔离级别

```java
public enum Isolation {

	/**
	 * 使用底层数据库默认的隔离级别
	 */
	DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),

	/**
	 * 读取未提交数据(会出现脏读, 不可重复读) 基本不使用
	 */
	READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),

	/**
	 * 读取已提交数据(会出现不可重复读和幻读)
	 */
	READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),

	/**
	 * 可重复读(会出现幻读)
	 */
	REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),

	/**
	 * 串行化
	 */
	SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

}
```

## @Transactional注解使用注意点

* 注意数据库引擎设置。比如常用的`mysql`，引擎`MyISAM`是不支持事务操作的。需要改成`InnoDB`才能支持
* `@Transactional`注解的方法必须是`public`，否则事务不起作用。`private`方法,`final`方法和`static`方法不能添加事务，加了也不生效
* Spring的事务管理默认只对出现运行期异常(RuntimeException及其子类和程序错误Error)才进行回滚（至于为什么spring要这么设计：因为spring认为Checked的异常属于业务的，coder需要给出解决方案而不应该直接扔该框架.[@Transactional配置](https://docs.spring.io/spring-framework/docs/4.3.13.RELEASE/spring-framework-reference/htmlsingle/#transaction-declarative-rolling-back)）
* 如果在业务层操作时捕捉并处理了异常，Spring是无法知晓这里是否发生了异常，则是不会主动去回滚数据的。
```java
@Transactional
@Override
public void save() {
    try {
        //操作A表
        throw new RuntimeException("操作A表抛异常了");
    } catch (Exception e) {
        e.printStackTrace();
    }
    //操作B表
}
```
* 如果类被代理了，`@Transactional`注解事务管理也是不生效的（因为spring的事务实现原理为AOP，只有通过代理对象调用方法才能被拦截，事务才能生效）
* 如果业务和事务入口不在同一个线程里，事务也是不生效的。
```java
@Transactional
@Override
public void save(Person person) {
    new Thread(() -> {
          saveError(person);//事务不生效
          System.out.println(1 / 0);
    }).start();
}
```
* 类内部方法调用事务不生效
```java
@Override
public void add(Person person) {
    //一些操作
    create(person);
}

@Override
@Transactional
public void create(Person person) {
    this.save(person);
    int i = 1 / 0;
}
```
当外部调用`add()`方法,因为`add()`方法是没有事务的,所以`create()`的事务是不会生效的。`@Transactional`的事务开启,是基于接口的或者是基于类的代理被创建

* 自己的service调用是可以开启事务的
```java
@Override
public void add(Person person) {
    //一些操作
    personService.create(person);
}

@Override
@Transactional
public void create(Person person) {
    this.save(person);
    int i = 1 / 0;
}
```



## @Transactional事务实现机制

在调用`@Transactional`注解了的方法时，`Spring Framework`默认使用`AOP`代理，在代码运行时生成一个代理对象，根据`@Transactional`的属性配置信息，这个代理对象决定该声明`@Transactional`了的目标方法是否由拦截器来使用拦截，在`TransactionInterceptor`拦截时，会在目标方法开始执行之前创建并加入事务，并执行目标方法的逻辑, 最后根据执行情况是否出现异常，利用抽象事务管理器`AbstractPlatformTransactionManager`操作数据源`DataSource`提交或回滚事务。

`Spring AOP` 代理有 `CglibAopProxy` 和 `JdkDynamicAopProxy` 两种，以 `CglibAopProxy` 为例,对于`CglibAopProxy` ，需要调用其内部类的 `DynamicAdvisedInterceptor` 的 `intercept` 方法。对于 `JdkDynamicAopProxy`，需要调用其 `invoke` 方法。
