---
title: 三、Spring—AOP
date: 2023-02-01
categories:
 - Spring
tags:
 - Spring
---

# AOP

`AOP`：`Aspect Oriented Programming`  面向切面编程

`AOP`最早是`AOP`联盟组织提出的，指定的一套规范。

`AOP`通过提供另外一种思考程序结构的途经来弥补面向对象编程`（OOP）`的不足。在`OOP`中模块化的关键单元是**类**，而在`AOP`中模块化的单元则是**切面**。切面能对关注点进行**模块化**，例如横切多个类型和对象的事务管理。

`AOP`框架是`Spring`的一个重要组成部分。但是`Spring IOC`容器并不依赖于`AOP`，这意味着你有权利选择是否使用`AOP`，`AOP`做为`Spring IOC`容器的一个补充,使它成为一个强大的中间件解决方案。

# AOP术语
这些术语不是`Spring`特有的。不过`AOP`术语并不是特别的直观，如果`Spring`使用自己的术语，将会变得更加令人困惑。

**切面（Aspect）**：一个关注点的模块化，这个关注点可能会横切多个对象。事务管理是J2EE应用中一个关于横切关注点的很好的例子。在`Spring AOP`中，切面可以使用`Schema`或者基于`@Aspect`注解的方式来实现。

**连接点（Joinpoint）**：在程序执行过程中某个特定的点，比如某方法调用的时候或者处理异常的时候。在`Spring AOP`中，一个连接点总是表示一个方法的执行。

**通知（Advice）**：在切面的某个特定的连接点上执行的动作。其中包括了`“around”`、`“before”`和`“after”`等不同类型的**通知**。许多`AOP`框架（包括`Spring`）都是以拦截器做通知模型，并维护一个以连接点为中心的拦截器链。

**切入点（Pointcut）**：匹配连接点的断言。通知和一个切入点表达式关联，并在满足这个切入点的连接点上运行（例如，当执行某个特定名称的方法时）。切入点表达式如何和连接点匹配是`AOP`的核心：`Spring`缺省使用`AspectJ`切入点语法。

**引入（Introduction）**：用来给一个类型声明额外的方法或属性（也被称为连接类型声明`（inter-type declaration）`）。`Spring`允许引入新的接口（以及一个对应的实现）到任何被代理的对象。例如，你可以使用引入来使一个`bean`实现`IsModified`接口，以便简化缓存机制。

**目标对象（Target Object）**： 被一个或者多个切面所通知的对象。也被称做被通知（`advised`）对象。 既然`Spring AOP`是通过运行时代理实现的，这个对象永远是一个被代理（`proxied`）对象。

**AOP代理（AOP Proxy）**：`AOP`框架创建的对象，用来实现切面契约（例如通知方法执行等等）。在`Spring`中，`AOP`代理可以是`JDK`动态代理或者`CGLIB`代理。

**织入（Weaving）**：把切面连接到其它的应用程序类型或者对象上，并创建一个被通知的对象。这些可以在编译时（例如使用`AspectJ`编译器），类加载时和运行时完成。`Spring`和其他纯`Java` `AOP`框架一样，在运行时完成织入。


**通知类型**

 **前置通知（Before advice）**：在某连接点之前执行的通知，但这个通知不能阻止连接点之前的执行流程（除非它抛出一个异常）。
 
 **后置通知（After returning advice）**：在某连接点正常完成后执行的通知：例如，一个方法没有抛出任何异常，正常返回。

**异常通知（After throwing advice）**：在方法抛出异常退出时执行的通知。 

**最终通知（After (finally) advice）**：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）。

 **环绕通知（Around Advice）**：包围一个连接点的通知，如方法调用。这是最强大的一种通知类型。环绕通知可以在方法调用前后完成自定义的行为。它也会选择是否继续执行连接点或直接返回它自己的返回值或抛出异常来结束执行。
# Spring AOP和AspectJ是什么关系

* `AspectJ`是一个`java`实现的`AOP`框架，它能够对`java`代码进行`AOP`编译（一般在编译期进行），让`java`代码具有`AspectJ`的`AOP`功能（当然需要特殊的编译器） 可以这样说`AspectJ`是目前实现`AOP`框架中最成熟，功能最丰富的语言，更幸运的是，`AspectJ`与`java`程序完全兼容，几乎是无缝关联，因此对于有`java`编程基础的工程师，上手和使用都非常容易。

* `AspectJ`是更强的`AOP`框架，是实际意义的`AOP`标准； 

* `Spring`为何不写类似`AspectJ`的框架？ `Spring AOP`使用纯`Java`实现, 它不需要专门的编译过程, 它一个重要的原则就是无侵入性`（non-invasiveness）`; `Spring` 小组完全有能力写类似的框架，只是`Spring AOP`从来没有打算通过提供一种全面的`AOP`解决方案来与`AspectJ`竞争。`Spring`的开发小组相信无论是基于代理`（proxy-based）`的框架（如`Spring AOP`）或者是成熟的框架如`AspectJ`都是很有价值的，他们之间应该是互补而不是竞争的关系。 `Spring`小组喜欢`@AspectJ`注解风格更胜于`Spring XML`配置； 所以在`Spring 2.0`使用了和`AspectJ 5`一样的注解，并使用`AspectJ`来做切入点解析和匹配。但是，`AOP`在运行时仍旧是纯的`Spring AOP`，并不依赖于`AspectJ`的编译器或者织入器（`weaver`）。 `Spring 2.5`对`AspectJ`的支持：在一些环境下，增加了对`AspectJ`的装载时编织支持，同时提供了一个新的`bean`切入点。


* 了解`AspectJ`应用到`java`代码的过程（这个过程称为**织入**），对于织入这个概念，可以简单理解为`aspect`(切面)应用到目标函数(类)的过程。 对于这个过程，一般分为**动态织入**和**静态织入**： 动态织入的方式是在运行时动态将要增强的代码织入到目标类中，这样往往是通过动态代理技术完成的，如`Java JDK`的动态代理(`Proxy`，底层通过反射实现)或者`CGLIB`的动态代理(底层通过继承实现)，`Spring AOP`采用的就是基于运行时增强的代理技术 `ApectJ`采用的就是静态织入的方式。`ApectJ`主要采用的是编译期织入，在这个期间使用`AspectJ`的`acj`编译器(类似`javac`)把`aspect`类编译成`class`字节码后，在`java`目标类编译时织入，即先编译`aspect`类再编译目标类。

# AOP的配置方式

`Spring AOP` 支持对`XML`模式和基于`@AspectJ`注解的两种配置方式


**`AspectJ`注解方式** 

基于`XML`的声明式`AspectJ`存在一些不足，需要在`Spring`配置文件配置大量的代码信息，为了解决这个问题，`Spring` 使用了`@AspectJ`框架为`AOP`的实现提供了一套注解。

| 注解名称 | 解释 |
|--|--|
|@Aspect  |用来定义一个切面  |
|@pointcut |用于定义切入点表达式。在使用时还需要定义一个包含名字和任意参数的方法签名来表示切入点名称，这个方法签名就是一个返回值为void，且方法体为空的普通方法|
| @Before| 用于定义前置通知，相当于BeforeAdvice。在使用时，通常需要指定一个value属性值，该属性值用于指定一个切入点表达式(可以是已有的切入点，也可以直接定义切入点表达式)。|
| @AfterReturning |用于定义后置通知，相当于AfterReturningAdvice。在使用时可以指定pointcut / value和returning属性，其中pointcut / value这两个属性的作用一样，都用于指定切入点表达式。|
| @Around |用于定义环绕通知，相当于MethodInterceptor。在使用时需要指定一个value属性，该属性用于指定该通知被植入的切入点。|
| @After-Throwing| 用于定义异常通知来处理程序中未处理的异常，相当于ThrowAdvice。在使用时可指定pointcut / value和throwing属性。其中pointcut/value用于指定切入点表达式，而throwing属性值用于指定-一个形参名来表示Advice方法中可定义与此同名的形参，该形参可用于访问目标方法抛出的异常|
| @After| 用于定义最终final 通知，不管是否异常，该通知都会执行。使用时需要指定一个value属性，该属性用于指定该通知被植入的切入点。|
| @DeclareParents |用于定义引介通知，相当于IntroductionInterceptor (不要求掌握)。|

## 接口使用JDK代理

* 接口
```java
public interface IJdkProxyService {

    void doMethod1();

    String doMethod2();

    String doMethod3() throws Exception;
}

```
* 实现类
```java
@Service
public class JdkProxyDemoServiceImpl implements IJdkProxyService {

    @Override
    public void doMethod1() {
        System.out.println("JdkProxyServiceImpl.doMethod1()");
    }

    @Override
    public String doMethod2() {
        System.out.println("JdkProxyServiceImpl.doMethod2()");
        return "hello world";
    }

    @Override
    public String doMethod3() throws Exception {
        System.out.println("JdkProxyServiceImpl.doMethod3()");
        throw new Exception("some exception");
    }
}

```
* 定义切面

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Component;


@EnableAspectJAutoProxy
@Component
@Aspect
public class LogAspect {

    /**
     * 定义切入点
     */
    @Pointcut("execution(* tech.pdai.springframework.service.*.*(..))")
    private void pointCutMethod() {
    }


    /**
     * 环绕通知
     */
    @Around("pointCutMethod()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("-----------------------");
        System.out.println("环绕通知: 进入方法");
        Object o = pjp.proceed();
        System.out.println("环绕通知: 退出方法");
        return o;
    }

    /**
     * 前置通知
     */
    @Before("pointCutMethod()")
    public void doBefore() {
        System.out.println("前置通知");
    }


    /**
     * 后置通知
     */
    @AfterReturning(pointcut = "pointCutMethod()", returning = "result")
    public void doAfterReturning(String result) {
        System.out.println("后置通知, 返回值: " + result);
    }

    /**
     * 异常通知
     */
    @AfterThrowing(pointcut = "pointCutMethod()", throwing = "e")
    public void doAfterThrowing(Exception e) {
        System.out.println("异常通知, 异常: " + e.getMessage());
    }

    /**
     * 最终通知
     */
    @After("pointCutMethod()")
    public void doAfter() {
        System.out.println("最终通知");
    }

}

```
* 输出

```java
-----------------------
环绕通知: 进入方法
前置通知
JdkProxyServiceImpl.doMethod1()
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
JdkProxyServiceImpl.doMethod2()
后置通知, 返回值: hello world
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
JdkProxyServiceImpl.doMethod3()
异常通知, 异常: some exception
最终通知
```
## 非接口使用Cglib代理

```java
@Service
public class CglibProxyDemoServiceImpl {

    public void doMethod1() {
        System.out.println("CglibProxyDemoServiceImpl.doMethod1()");
    }

    public String doMethod2() {
        System.out.println("CglibProxyDemoServiceImpl.doMethod2()");
        return "hello world";
    }

    public String doMethod3() throws Exception {
        System.out.println("CglibProxyDemoServiceImpl.doMethod3()");
        throw new Exception("some exception");
    }
}

```
定义切面和上面一样

* 输出

```go
-----------------------
环绕通知: 进入方法
前置通知
CglibProxyDemoServiceImpl.doMethod1()
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
CglibProxyDemoServiceImpl.doMethod2()
后置通知, 返回值: hello world
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
CglibProxyDemoServiceImpl.doMethod3()
异常通知, 异常: some exception
最终通知

```

