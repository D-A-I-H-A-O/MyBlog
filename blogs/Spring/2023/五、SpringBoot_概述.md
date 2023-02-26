---
title: 五、SpringBoot_概述
date: 2023-02-26
categories:
 - Spring
tags:
 - SpringBoot
---

# SpringFramework解决了什么问题？
`Spring`是Java企业版（`Java Enterprise Edition，JEE，也称J2EE）`的轻量级代替品。无需开发重量级的`EnterpriseJavaBean（EJB）`，`Spring`为企业级`Java`开发提供了一种相对简单的方法，通过依赖注入和面向切面编程，用简单的`Java`对象`（Plain Old Java Object，POJO）`实现了`EJB`的功能。

* 使用`Spring`的`IOC`容器,将对象之间的依赖关系交给`Spring`,降低组件之间的耦合性,让我们更专注于应用逻辑 
* 可以提供众多服务,事务管理,`WS`等。 
* `AOP`的面向切面编程。
* 对主流的框架提供了很好的集成支持,如`Hibernate`,`Struts2`,`JPA`等 
* `Spring DI`机制降低了业务对象替换的复杂性。 
* `Spring`属于低侵入,代码污染极低。 
* `Spring`的高度可开放性,并不强制依赖于`Spring`,开发者可以自由选择`Spring`部分或全部

# SpringFramework没有解决了什么问题？
虽然`Spring`的组件代码是轻量级的，但它的配置却是重量级的。一开始，`Spring`用`XML`配置，而且是很多`XML`配置。`Spring 2.5`引入了基于注解的组件扫描，这消除了大量针对应用程序自身组件的显式`XML`配置。`Spring 3.0`引入了基于`Java`的配置，这是一种类型安全的可重构配置方式，可以代替`XML`。所有这些配置都代表了开发时的损耗。因为在思考`Spring`特性配置和解决业务问题之间需要进行思维切换，所以编写配置挤占了编写应用程序逻辑的时间。和所有框架一样，`Spring`实用，但与此同时它要求的回报也不少。除此之外，项目的依赖管理也是一件耗时耗力的事情。在环境搭建时，需要分析要导入哪些库的坐标，而且还需要分析导入与之有依赖关系的其他库的坐标，一旦选错了依赖的版本，随之而来的不兼容问题就会严重阻碍项目的开发进度。

# SpringBoot的缘由
为什么有了`SpringFramework`还会诞生`SpringBoot`？因为虽然`Spring`的组件代码是轻量级的，但它的配置却是重量级的；所以`SpringBoot`的设计策略是通过**开箱即用**和**约定大于配置**来解决**配置重**的问题的。


# SpringBoot的特点
为基于`Spring`的开发提供更快的入门体验开箱即用，没有代码生成，也无需`XML`配置。同时也可以修改默认值来满足特定的需求提供了一些大型项目中常见的非功能性特性，如嵌入式服务器、安全、指标，健康检测、外部配置等`SpringBoot`不是对`Spring`功能上的增强，而是提供了一种快速使用`Spring`的方式

# SpringBoot的核心功能
**起步依赖** 

起步依赖本质上是一个`Maven`项目对象模型（`Project Object Model，POM）`，定义了对其他库的传递依赖，这些东西加在一起即支持某项功能。简单的说，起步依赖就是将具备某种功能的坐标打包到一起，并提供一些默认的功能。

**自动配置**

`Spring Boot`的自动配置是一个运行时（更准确地说，是应用程序启动时）的过程，考虑了众多因素，才决定`Spring`配置应该用哪个，不该用哪个。该过程是`Spring`自动完成的。

# Spring Boot 常用注解
`@SpringBootApplication`：定义在`main`方法入口类处，用于启动`SpringBoot`应用项目

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Configuration
@EnableAutoConfiguration
@ComponentScan
public @interface SpringBootApplication {

	/**
	 * Exclude specific auto-configuration classes such that they will never be applied.
	 * @return the classes to exclude
	 */
	Class<?>[] exclude() default {};

}
```

`@EnableAutoConfiguration`：让`SpringBoot`根据类路径中的`jar`包依赖当前项目进行自动配置

在`src/main/resources`的`META-INF/spring.factories`
```java
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration

若有多个自动配置，用“，”隔开
```
`@ImportResource`：加载`xml`配置，一般是放在启动`main`类上

```java
@ImportResource("classpath*:/spring/*.xml")  单个

@ImportResource({"classpath*:/spring/1.xml","classpath*:/spring/2.xml"})   多个
```
`@Value` ：`application.properties`定义属性，直接使用`@Value`注入即可

```java
public class A{
	 @Value("${push.start:0}")   // 如果缺失，默认值为0
     private Long  id;
}
```
`@ConfigurationProperties(prefix="person")` ：可以新建一个`properties`文件，`ConfigurationProperties`的属性`prefix`指定`properties`的配置的前缀，通过`location`指定`properties`文件的位置

```java
@ConfigurationProperties(prefix="person")
public class PersonProperties {
	
	private String name ;
	private int age;
}
```

`@EnableConfigurationProperties` ：用`@EnableConfigurationProperties`注解使 `@ConfigurationProperties`生效，并从`IOC`容器中获取`bean`。

`@RestController` ：组合`@Controller`和`@ResponseBody`

`@RequestMapping("/")`：用来映射`web`请求(访问路径和参数)、处理类和方法，可以注解在类或方法上。注解在方法上的路径会继承注解在类上的路径。`produces`属性: 定制返回的`response`的媒体类型和字符集，或需返回值是`json`对象

```java
@RequestMapping(value="/api/test",produces="application/json;charset=UTF-8",method = RequestMethod.POST)
```

`@RequestParam` 获取`request`请求的参数值

```java
public List<CopperVO> getOpList(HttpServletRequest request,
                                    @RequestParam(value = "pageIndex", required = false) Integer pageIndex,
                                    @RequestParam(value = "pageSize", required = false) Integer pageSize) {
 
}
```
`@ResponseBody` 支持将返回值放在`response`体内，而不是返回一个页面。比如`Ajax`接口，可以用此注解返回数据而不是页面。此注解可以放置在返回值前或方法前。

`@Bean` `@Bean(name="bean的名字",initMethod="初始化时调用方法名字",destroyMethod="close")`定义在方法上，在容器内初始化一个`bean`实例类。
```java
@Bean(destroyMethod="close")
@ConditionalOnMissingBean
public PersonService registryService() {
		return new PersonService();
	}
```
`@Service` 用于标注业务层组件

`@Controller`用于标注控制层组件

 `@Repository`用于标注数据访问组件，即`DAO`组件

`@Component`泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注。

`@PostConstruct` `spring`容器初始化时，要执行该方法
```java
@PostConstruct  
public void init() {   
}   
```
`@PathVariable` 用来获得请求`url`中的动态参数

```java
@Controller  
public class TestController {  

     @RequestMapping(value="/user/{userId}/roles/{roleId}",method = RequestMethod.GET)  
     public String getLogin(@PathVariable("userId") String userId,  
         @PathVariable("roleId") String roleId){
           
         System.out.println("User Id : " + userId);  
         System.out.println("Role Id : " + roleId);  
         return "hello";  
     
     }  
}
```
`@ComponentScan` 注解会告知`Spring`扫描指定的包来初始化`Spring`

```java
@ComponentScan(basePackages = "com.bbs.xx")
```

`@EnableZuulProxy` 路由网关的主要目的是为了让所有的微服务对外只有一个接口，我们只需访问一个网关地址，即可由网关将所有的请求代理到不同的服务中。`Spring Cloud`是通过`Zuul`来实现的，支持自动路由映射到在`Eureka Server`上注册的服务。`Spring Cloud`提供了注解`@EnableZuulProxy`来启用路由代理。

`@Autowired` 在默认情况下使用 `@Autowired` 注释进行自动注入时，`Spring` 容器中匹配的候选 `Bean` 数目必须有且仅有一个。当找不到一个匹配的 `Bean` 时，`Spring` 容器将抛出 `BeanCreationException` 异常，并指出必须至少拥有一个匹配的 `Bean`。当不能确定 `Spring` 容器中一定拥有某个类的 `Bean` 时，可以在需要自动注入该类 `Bean` 的地方可以使用 `@Autowired(required = false)`，这等于告诉 `Spring`在找不到匹配 `Bean` 时也不报错

`@Configuration` 表示这是一个配置信息类 , `@Configuration("name")` 可以给这个配置类也起一个名称
```java
@Configuration("name")
@ComponentScan("spring4")//类似于xml中的<context:component-scan base-package="spring4"/>
public class Config {

    @Autowired//自动注入，如果容器中有多个符合的bean时，需要进一步明确
    @Qualifier("compent")//进一步指明注入bean名称为compent的bean
    private Compent compent;

    @Bean//类似于xml中的<bean id="newbean" class="spring4.Compent"/>
    public Compent newbean(){
        return new Compent();
    }   
}l
```
`@Import(Config1.class)` 导入`Config1`配置类里实例化的`bean`

```java
@Configuration
public class CDConfig {

    @Bean   // 将SgtPeppers注册为 SpringContext中的bean
    public CompactDisc compactDisc() {
        return new CompactDisc();  // CompactDisc类型的
    }
}

@Configuration
@Import(CDConfig.class)  //导入CDConfig的配置
public class CDPlayerConfig {

    @Bean(name = "cDPlayer")
    public CDPlayer cdPlayer(CompactDisc compactDisc) {  
         // 这里会注入CompactDisc类型的bean
         // 这里注入的这个bean是CDConfig.class中的CompactDisc类型的那个bean
        return new CDPlayer(compactDisc);
    }
}
```
`@Order` `@Order(1)`，值越小优先级超高，越先运行

`@ConditionalOnExpression` 开关为`true`的时候才实例化`bean`
```java
@Configuration
@ConditionalOnExpression("${enabled:false}")
public class BigpipeConfiguration {
    @Bean
    public OrderMessageMonitor orderMessageMonitor(ConfigContext configContext) {
        return new OrderMessageMonitor(configContext);
    }
}
```


