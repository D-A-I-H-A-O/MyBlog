---
title: 二、Spring——IOC和DI
date: 2022-04-12
categories:
 - Spring
tags:
 - Spring
---

# IOC和DI
## 1、`IOC`：反转控制

`Ioc—Inversion of Control`，即“控制反转”，不是什么技术，而是一种设计思想。在`Java`开发中，`IOC`意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。如何理解好`IOC`呢？理解好`IOC`的关键是要明确“谁控制谁，控制什么，为何是反转（有反转就应该有正转了），哪些方面反转了”，那我们来深入分析一下：

● 谁控制谁，控制什么：传统`Java SE`程序设计，我们直接在对象内部通过`new`进行创建对象，是程序主动去创建依赖对象；而`IOC`是有专门一个容器来创建这些对象，即由`IOC`容器来控制对象的创建；谁控制谁？当然是`IOC`容器控制了对象；控制什么？那就是主要控制了外部资源获取（不只是对象包括比如文件等）。

● 为何是反转，哪些方面反转了：有反转就有正转，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；为何是反转？因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转；哪些方面反转了？依赖对象的获取被反转了。

## 2、`DI`：依赖注入

`IOD`的另一种表述方式：即组件以一些预先定义好的方式（如`setter`方法）接受来自于容器的资源注入。相对于`IOC`而言，这种表述更直接。

## 3、`IOC`容器在`Spring`中的实现

3.1、在通过`IOC`容器读取`Bean`的实例之前，需要将`IOC`容器本身实例化。
 
 >Spring提供了IOC容器的两种实现方式
 
 3.1.1、`BeanFactory` ：`IOC`容器的基本实现，是`Spring`内部的基础设施，是面向`Spring`本身的，不是给开发人员使用的。

3.1.2、`ApplicationContext`：`BeanFactory` 的子接口，提供了更多高级特性。面向`Spring`的使用者，几乎所有场合都使用`ApplicationContext`而不是`BeanFactory` 。

>ApplicationContext高级特性：
> 1、与 Spring 的 AOP 功能轻松集成
> 2、消息资源处理(用于国际化)
> 3、Event publication
> 4、特定于应用程序层的上下文，例如用于 Web 应用程序的WebApplicationContext。

`ApplicationContext`的主要实现类

* `ClassPathXmlApplicationContext`：对应类路径下的`XML`格式的配置文件
* `FileSystemXmlApplicationContext`：对应文件系统中的`XML`格式的配置文件
* 在初始化时就创建单例的`bean`，也可以通过配置的方式指定创建的`Bean`是多实例的。
* `ConfigurableApplicationContext` 是`ApplicationContext`的子接口，包含一些扩展方法
* `refresh()`和`close()`让`ApplicationContext`具有启动、关闭和刷新上下文的能力。
* `WebApplicationContext` 专为`WEB`应用而准备的，它允许从相对于`WEB`根目录的路径中完成初始化工作


## 4、`IOC`配置的三种方式


### xml 配置

顾名思义，就是将`bean`的信息配置`.xml`文件里，通过`Spring`加载文件为我们创建`bean`。这种方式出现很多早前的`SSM`项目中，将第三方类库或者一些配置工具类都以这种方式进行配置，主要原因是由于第三方类不支持`Spring`注解。

 优点： 可以使用于任何场景，结构清晰，通俗易懂 
 
 缺点： 配置繁琐，不易维护，枯燥无味，扩展性差

### Java 配置

 将类的创建交给我们配置的`JavcConfig`类来完成，`Spring`只负责维护和管理，采用纯`Java`创建方式。其本质上就是把在`XML`上的配置声明转移到`Java`配置类中 

优点：适用于任何场景，配置方便，因为是纯`Java`代码，扩展性高，十分灵活 

缺点：由于是采用`Java`类的方式，声明不明显，如果大量配置，可读性比较差


举例： 创建一个配置类， 添加`@Configuration`注解声明为配置类 创建方法，方法上加上`@bean`，该方法用于创建实例并返回，该实例创建后会交给`spring`管理，方法名建议与实例名相同（首字母小写）。注：实例类不需要加任何注解

```java
@Configuration
public class BeansConfig {

    @Bean("userDao")
    public UserDaoImpl userDao() {
        return new UserDaoImpl();
    }

    @Bean("userService")
    public UserServiceImpl userService() {
        UserServiceImpl userService = new UserServiceImpl();
        userService.setUserDao(userDao());
        return userService;
    }
}

```

### 注解配置

通过在类上加注解的方式，来声明一个类交给`Spring`管理，`Spring`会自动扫描带有`@Component，@Controller，@Service，@Repository`这四个注解的类，然后帮我们创建并管理，前提是需要先配置`Spring`的注解扫描器。

优点：开发便捷，通俗易懂，方便维护。 

缺点：具有局限性，对于一些第三方资源，无法添加注解。只能采用`XML`或`JavaConfig`的方式配置

举例： 对类添加`@Component`相关的注解，比如`@Controller，@Service，@Repository` 设置`ComponentScan`的`basePackage`, 比如`<context:component-scan base-package='xxx.xxx.xxx'>`, 或者`@ComponentScan("xxx.xxx.xxx")`注解，或者 `new AnnotationConfigApplicationContext("xxx.xxx.xxx")`指定扫描的`basePackage`.

```java
@Service
public class UserServiceImpl {

    @Autowired
    private UserDaoImpl userDao;

    public List<User> findUserList() {
        return userDao.findUserList();
    }

}

```


## 5、依赖注入的三种方式


### setter方式

在`XML`配置方式中，`property`都是`setter`方式注入，比如下面的`xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="service.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

本质上包含两步： 第一步，需要`new UserServiceImpl()`创建对象, 所以需要默认构造函数。 第二步，调用`setUserDao()`函数注入`userDao`的值, 所以需要`setUserDao()`函数 所以对应的`service`类是这样的：

```java
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private UserDaoImpl userDao;

    /**
     * init.
     */
    public UserServiceImpl() {
    }

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

    /**
     * set dao.
     *
     * @param userDao user dao
     */
    public void setUserDao(UserDaoImpl userDao) {
        this.userDao = userDao;
    }
}
```
* 在注解和Java配置方式下

```java
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private UserDaoImpl userDao;

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

    /**
     * set dao.
     *
     * @param userDao user dao
     */
    @Autowired
    public void setUserDao(UserDaoImpl userDao) {
        this.userDao = userDao;
    }
}

```

### 构造函数

在`XML`配置方式中，`<constructor-arg>`是通过构造函数参数注入，比如下面的`xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="service.UserServiceImpl">
        <constructor-arg name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>

```
本质上是`new UserServiceImpl(userDao)`创建对象, 所以对应的`service`类是这样的：

```java
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private final UserDaoImpl userDao;

    /**
     * init.
     * @param userDaoImpl user dao impl
     */
    public UserServiceImpl(UserDaoImpl userDaoImpl) {
        this.userDao = userDaoImpl;
    }

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

}

```

* 在注解和`Java`配置方式下

```java
 @Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private final UserDaoImpl userDao;

    /**
     * init.
     * @param userDaoImpl user dao impl
     */
    @Autowired // 这里@Autowired也可以省略
    public UserServiceImpl(final UserDaoImpl userDaoImpl) {
        this.userDao = userDaoImpl;
    }

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

}

```
### 注解注入

以`@Autowired`（自动注入）注解注入为例，修饰符有三个属性：`Constructor`，`byType`，`byName`。默认按照`byType`注入。 

`constructor`：通过构造方法进行自动注入，`spring`会匹配与构造方法参数类型一致的`bean`进行注入，如果有一个多参数的构造方法，一个只有一个参数的构造方法，在容器中查找到多个匹配多参数构造方法的`bean`，那么`spring`会优先将`bean`注入到多参数的构造方法中。

 `byName`：被注入`bean`的`id`名必须与`set`方法后半截匹配，并且`id`名称的第一个单词首字母必须小写，这一点与手动`set`注入有点不同。

 `byType`：查找所有的`set`方法，将符合符合参数类型的`bean`注入。

```java
@Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    @Autowired
    private UserDaoImpl userDao;

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return userDao.findUserList();
    }

}

```
## 6、为什么推荐构造器注入方式

>The Spring team generally advocates constructor injection as it enables one to implement application components as immutable objects and to ensure that required dependencies are not null. Furthermore constructor-injected components are always returned to client (calling) code in a fully initialized state.

简单翻译：构造器注入的方式能够保证注入的组件不可变，并且确保需要的依赖不为空。此外，构造器注入的依赖总是能够在返回客户端（组件）代码的时候保证完全初始化的状态。


* 依赖不可变：其实说的就是`final`关键字
* 依赖不为空：省去了我们对其检查，当要实例化实例的时候，由于自己实现了有参数的构造函数，所以不会调用默认的构造函数，那么就需要`Spring`容器传入所需要的参数，所以就两种情况：1.有该类型的参数，传入，OK。2.无该类型的参数，报错。
* 完全初始化的状态：向构造器传参之前，要确保注入的内容不为空，那么肯定要调用依赖组件的构造方法完成实例化。而在`Java`类加载实例化的过程中，构造方法是最后的一步（之前如果有父类先初始化父类，然后自己的成员变量，最后才是构造方法），所以返回来的都是初始化之后的状态。


所以通常是这样的
```java
 @Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private final UserDaoImpl userDao;

    /**
     * init.
     * @param userDaoImpl user dao impl
     */
    public UserServiceImpl(final UserDaoImpl userDaoImpl) {
        this.userDao = userDaoImpl;
    }

}
```

如果使用`setter`注入，缺点显而易见，对于`IOC`容器以外的环境，除了使用反射来提供它需要的依赖之外，无法复用该实现类。而且将一直是个潜在的隐患，因为你不调用将一直无法发现`NPE`的存在。

```java
// 这里只是模拟一下，正常来说我们只会暴露接口给客户端，不会暴露实现。
UserServiceImpl userService = new UserServiceImpl();
userService.findUserList(); // -> NullPointerException, 潜在的隐患
```

循环依赖的问题：使用`field`注入可能会导致循环依赖，即A里面注入B，B里面又注入A：
```java
public class A {
    @Autowired
    private B b;
}

public class B {
    @Autowired
    private A a;
}

```
如果使用构造器注入，在`spring`项目启动的时候，就会抛出：`BeanCurrentlyInCreationException：Requested bean is currently in creation: Is there an unresolvable circular reference？`从而提醒你避免循环依赖，如果是`field`注入的话，启动的时候不会报错，在使用那个`bean`的时候才会报错。 

## 7、使用构造器注入方式时注入了太多的类导致`Bad Smell`怎么办？
比如当你一个`Controller`中注入了太多的`Service`类，会给你提示相关告警
![在这里插入图片描述](https://img-blog.csdnimg.cn/c18be9c5ac3346b2ae1da943c4537edb.png)
对于这个问题，说明你的类当中有太多的责任，那么你要好好想一想是不是自己违反了类的单一性职责原则，从而导致有这么多的依赖要注入。


## 8、@Autowired和@Resource以及@Inject等注解注入有何区别

* @Autowired

1、`@Autowired`是`Spring`自带的注解，通过`AutowiredAnnotationBeanPostProcessor` 类实现的依赖注入

2、`@Autowired`可以作用在`CONSTRUCTOR、METHOD、PARAMETER、FIELD、ANNOTATION_TYPE` 

3、`@Autowired`默认是根据类型（`byType` ）进行自动装配的 

4、如果有多个类型一样的`Bean`候选者，需要指定按照名称（`byName` ）进行装配，则需要配合`@Qualifier`。 指定名称后，如果`Spring IOC`容器中没有对应的组件`bean`抛出`NoSuchBeanDefinitionException`。也可以将`@Autowired`中`required`配置为`false`，如果配置为`false`之后，当没有找到相应`bean`的时候，系统不会抛异常

* @Resource

1、`@Resource`是`JSR250`规范的实现，在`javax.annotation`包下 

2、`@Resource`可以作用`TYPE、FIELD、METHOD`上 

3、`@Resource`是默认根据属性名称进行自动装配的，如果有多个类型一样的`Bean`候选者，则可以通过`name`进行指定进行注入


* @Inject

1、`@Inject`是`JSR330 (Dependency Injection for Java)`中的规范，需要导入`javax.inject.Inject` `jar`包 ，才能实现注入

 2、`@Inject`可以作用`CONSTRUCTOR、METHOD、FIELD`上

 3、`@Inject`是根据类型进行自动装配的，如果需要按名称进行装配，则需要配合`@Named`；

[@Autowired、@Resource和@Inject注解的区别（最详细）](https://blog.csdn.net/qq_35634181/article/details/104276056)

# IOC体系结构
![请添加图片描述](https://img-blog.csdnimg.cn/bf9f0ff109fa41ada4ae9b301ee0aa37.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)

## BeanDefinition
 `IOC`容器管理了我们定义的各种`Bean`对象及其相互的关系，`Bean`对象在`Spring`实现中是以`BeanDefinition`来描述的。

* `BeanDefinition`定义了各种`Bean`对象及其相互的关系
* `BeanDefinitionReader`是`BeanDefinition`的解析器
* `BeanDefinitionHolder`是`BeanDefinition`的包装类，用来存储`BeanDefinition`，`name`以及`aliases`等

## BeanFactory和BeanRegistry
* `BeanFactory`：工厂模式定义了`IOC`容器的基本功能规范

*  `BeanRegistry`：向`IOC`容器手工注册`BeanDefinition`对象的方法


 **`BeanFactory`为何要定义这么多层次的接口？** 

主要是为了区分在 `Spring` 内部在操作过程中对象的传递和转化过程中，对对象的数据访问所做的限制。

 **有哪些接口呢？**
  
* `ListableBeanFactory`：该接口定义了访问容器中 `Bean` 基本信息的若干方法，如查看`Bean` 的个数、获取某一类型 `Bean` 的配置名、查看容器中是否包括某一 `Bean` 等方法；

*  `HierarchicalBeanFactory`：父子级联`IOC`容器的接口，子容器可以通过接口方法访问父容器； 通过 `HierarchicalBeanFactory` 接口， `Spring` 的`IOC`容器可以建立父子层级关联的容器体系，子容器可以访问父容器中的 `Bean`，但父容器不能访问子容器的 `Bean`。`Spring` 使用父子容器实现了很多功能，比如在 `Spring MVC` 中，展现层 `Bean` 位于一个子容器中，而业务层和持久层的 `Bean` 位于父容器中。这样，展现层 `Bean` 就可以引用业务层和持久层的 `Bean`，而业务层和持久层的 `Bean` 则看不到展现层的 `Bean`

* `ConfigurableBeanFactory`：是一个重要的接口，增强了`IOC`容器的可定制性，它定义了设置类装载器、属性编辑器、容器初始化后置处理器等方法； 

* `ConfigurableListableBeanFactory`: `ListableBeanFactory` 和 `ConfigurableBeanFactory`的融合； 

* `AutowireCapableBeanFactory`：定义了将容器中的 `Bean` 按某种规则（如按名字匹配、按类型匹配等）进行自动装配的方法； 

**如何将`Bean`注册到`BeanFactory`中？**

`Spring` 配置文件中每一个`<bean>`节点元素在 `Spring` 容器里都通过一个 `BeanDefinition` 对象表示，它描述了 `Bean` 的配置信息。而 `BeanDefinitionRegistry` 接口提供了向容器手工注册 `BeanDefinition` 对象的方法。

## ApplicationContext

`IOC`容器的接口类是`ApplicationContext`，很显然它必然继承`BeanFactory`对`Bean`规范（最基本的`IOC`容器的实现）进行定义。而`ApplicationContext`表示的是应用的上下文，除了对`Bean`的管理外，还至少应该包含了 1、访问资源： 对不同方式的`Bean`配置（即资源）进行加载。(实现`ResourcePatternResolver`接口) 。2、国际化: 支持信息源，可以实现国际化。（实现`MessageSource`接口）3、 应用事件: 支持应用事件。(实现`ApplicationEventPublisher`接口)

# IOC初始化流程
**基于`Annotation`的配置资源加载和注册**

1、寻找入口

基于`Annotation`的`Spring` `IOC`容器实例是`AnnotationConfigApplicationContext`，我们可以通过它的构造方法进行分析。最关键的两个构造方法如下：

```java
// 创建一个新的 AnnotationConfigApplicationContext，从给定的带注解的加载bean定义并自动刷新上下文。
public AnnotationConfigApplicationContext(Class<?>... annotatedClasses) {
    this();
    register(annotatedClasses);
    refresh();
}

// 创建一个新的 AnnotationConfigApplicationContext，扫描给定包中的 bean 定义并自动刷新上下文。
public AnnotationConfigApplicationContext(String... basePackages) {
        this();
        scan(basePackages);
        refresh();
        }
```
注解驱动的`Spring`容器有两种创建方式：

1、直接传入带有相关注解的类
2、指定要扫描的基础包，将包下面所有带相关注解的`Bean`全部加载进去

**直接传入带有相关注解的类**

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ba8fb9212a54d129e9fa59337e023f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)

注册一个注解`Bean`定义类
![在这里插入图片描述](https://img-blog.csdnimg.cn/3ad4c97ac2354de0a62b869683b4c750.png)

```java
从给定的 bean 类注册一个 bean，从类声明的注释中派生其元数据。
参数：
beanClass – bean 的类
name – bean 的显式名称
qualifiers – 除了 bean 类级别的限定符之外，要考虑的特定限定符注释（如果有）
supplier- 用于创建 bean 实例的回调（可能为null ）
customizers——用于定制工厂的BeanDefinition的一个或多个回调，例如设置惰性初始化或主标志

private <T> void doRegisterBean(Class<T> beanClass, @Nullable String name,
		@Nullable Class<? extends Annotation>[] qualifiers, @Nullable Supplier<T> supplier,
		@Nullable BeanDefinitionCustomizer[] customizers) {

	//根据指定的注解Bean定义类，创建Spring容器中对注解Bean的封装的数据结构
	AnnotatedGenericBeanDefinition abd = new AnnotatedGenericBeanDefinition(beanClass);
	if (this.conditionEvaluator.shouldSkip(abd.getMetadata())) {
		return;
	}
	
	abd.setInstanceSupplier(supplier);
	ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(abd);
	//为注解Bean定义设置作用域
	abd.setScope(scopeMetadata.getScopeName());
	//为注解Bena定义生成Bean名称
	String beanName = (name != null ? name : this.beanNameGenerator.generateBeanName(abd, this.registry));
	
	//处理注解Bean定义中的通用注解
	AnnotationConfigUtils.processCommonDefinitionAnnotations(abd);
	//如果在向容器注册注解Bean定义时，使用了额外的限定符注解，则解析限定符注解
	//配置的关于Autowiring自动依赖注入装配的限定条件，即@Qualifier注解
	//Spring自动依赖注入装配默认是按类型装配，如果使用@Qualifier则按名称
	if (qualifiers != null) {
		for (Class<? extends Annotation> qualifier : qualifiers) {
			if (Primary.class == qualifier) {
				abd.setPrimary(true);
			}
			else if (Lazy.class == qualifier) {
				abd.setLazyInit(true);
			}
			else {
				abd.addQualifier(new AutowireCandidateQualifier(qualifier));
			}
		}
	}
	if (customizers != null) {
		for (BeanDefinitionCustomizer customizer : customizers) {
			customizer.customize(abd);
		}
	}
	//创建一个指定Bean名称的Bean定义对象，封装注解Bean定义类数据
	BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(abd, beanName);
	//根据租界Bean定义类中的配置的作用域，创建相应的代理对象
	definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
	//向IOC容器注册注册Bean类定义对象
	BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, this.registry);
	}
```
注册注解`Bean`定义类的基本步骤如下：

 1、使用注解元数据解析器解析注解`Bean`中关于作用域的配置。
 2、使用`AnnotationConfigUtils`.`processCommonDefinitionAnnotations`方法处理注解Bean定义类中通用的注解
 3、使用`AnnotationConfigUtils`.`applyScopedProxyMode`方法创建对于作用域的代理对象
 4、通过`BeanDefinitionReaderUtils`向容器注册`Beandefinition`

**指定要扫描的基础包**

当创建注解处理容器时，如果传入的初始参数时注解`Bean`定义类所在的包时，注解容器将扫描给定的包以及其子包，将扫描到的注解`Bean`定义载入并注册


**`ClassPathBeanDefinitionScanner` 扫描给定的包及其子包**
`AnnotationConfigApplicationContext`的`scan()`方法实际调用了`ClassPathBeanDefinitionScanner`的`scan()`方法，源码如下：

```java
	/**
	 * Perform a scan within the specified base packages. 在指定的基本包中执行扫描。
	 * @param basePackages the packages to check for annotated classes
	 * @return number of beans registered
	 */
	public int scan(String... basePackages) {
	    //获取容器中已经注册的Bean个数
		int beanCountAtScanStart = this.registry.getBeanDefinitionCount();

		//启动扫描器扫描给定包
		doScan(basePackages);

		// Register annotation config processors, if necessary.
		//注册注解配置
		if (this.includeAnnotationConfig) {
			AnnotationConfigUtils.registerAnnotationConfigProcessors(this.registry);
		}
		//返回注册的Bean个数
		return (this.registry.getBeanDefinitionCount() - beanCountAtScanStart);
	}
```

```java
    //扫描了基础包下所有包含Bean定义注解的类，并且给BeanDefinition设置了对应的属性值。
	protected Set<BeanDefinitionHolder> doScan(String... basePackages) {
		Assert.notEmpty(basePackages, "At least one base package must be specified");
		//创建一个集合，存放扫描到Bean定义的封装
		Set<BeanDefinitionHolder> beanDefinitions = new LinkedHashSet<>();
		//遍历扫描所给定的包
		for (String basePackage : basePackages) {
			Set<BeanDefinition> candidates = findCandidateComponents(basePackage);
			for (BeanDefinition candidate : candidates) {
				ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(candidate);
				candidate.setScope(scopeMetadata.getScopeName());
				String beanName = this.beanNameGenerator.generateBeanName(candidate, this.registry);
				if (candidate instanceof AbstractBeanDefinition) {
					postProcessBeanDefinition((AbstractBeanDefinition) candidate, beanName);
				}
				if (candidate instanceof AnnotatedBeanDefinition) {
					AnnotationConfigUtils.processCommonDefinitionAnnotations((AnnotatedBeanDefinition) candidate);
				}
				if (checkCandidate(beanName, candidate)) {
					BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(candidate, beanName);
					definitionHolder =
							AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
					beanDefinitions.add(definitionHolder);
					registerBeanDefinition(definitionHolder, this.registry);
				}
			}
		}
		return beanDefinitions;
	}
```

# Spring中Bean的生命周期
`Spring` 容器可以管理 `singleton` 作用域 `Bean` 的生命周期，在此作用域下，`Spring` 能够精确地知道该 `Bean` 何时被创建，何时初始化完成，以及何时被销毁。 而对于 `prototype` 作用域的 `Bean`，`Spring` 只负责创建，当容器创建了 `Bean` 的实例后，`Bean` 的实例就交给客户端代码管理，`Spring` 容器将不再跟踪其生命周期。每次客户端请求 `prototype` 作用域的 `Bean` 时，`Spring` 容器都会创建一个新的实例，并且不会管那些被配置成 `prototype` 作用域的 `Bean` 的生命周期。 了解 `Spring` 生命周期的意义就在于，可以利用 `Bean` 在其存活期间的指定时刻完成一些相关操作。这种时刻可能有很多，但一般情况下，会在 `Bean` 被初始化后和被销毁前执行一些相关操作。
![在这里插入图片描述](https://img-blog.csdnimg.cn/3281f28b83264dd48ea3db4ae862af14.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)

[Spring源码解读(2)IOC容器bean的实例化](https://juejin.cn/post/6844903843596107790#heading-9)


# Spring解决循环依赖

循环依赖：一个或多个对象实例之前存在直接或间接的依赖关系，这种依赖关系构成了一个环形调用。


`Spring`获取`getBean()`最终调用下面简化后的方法

```java
protected <T> T doGetBean(final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)
			throws BeansException {
		final String beanName = transformedBeanName(name);
		Object bean;
		//关注点1
		Object sharedInstance = getSingleton(beanName);
		if (sharedInstance != null && args == null) {
			bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
		}else {
			try {
				if (mbd.isSingleton()) {
                     //关注点2
					sharedInstance = getSingleton(beanName, new ObjectFactory<Object>() {
						@Override
						public Object getObject() throws BeansException {
							try {
								return createBean(beanName, mbd, args);
							}
							catch (BeansException ex) {
								throw ex;
							}
						}
					});
					bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
				}
            ..............
            }
		return (T) bean;
	}
```
关注点1
```java
	@Nullable
	protected Object getSingleton(String beanName, boolean allowEarlyReference) {
     	//singletonObjects中获取 (放置的是实例化好的单例对象)
		Object singletonObject = this.singletonObjects.get(beanName);
		//isSingletonCurrentlyInCreation
		if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
			synchronized (this.singletonObjects) {
			//earlySingletonObjects中获取 (提前曝光的单例对象（没有完全装配好）)
				singletonObject = this.earlySingletonObjects.get(beanName);
				if (singletonObject == null && allowEarlyReference) {
					ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
					if (singletonFactory != null) {
				     	//singletonFactory中获取 (存放的是要被实例化的对象的对象工厂)
						singletonObject = singletonFactory.getObject();
						this.earlySingletonObjects.put(beanName, singletonObject);
						this.singletonFactories.remove(beanName);
					}
				}
			}
		}
		return singletonObject;
	}
```
关注点2
```java
	public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
		Assert.notNull(beanName, "Bean name must not be null");
		synchronized (this.singletonObjects) {
		   //singletonObjects中获取 (放置的是实例化好的单例对象)
			Object singletonObject = this.singletonObjects.get(beanName);
			if (singletonObject == null) {
				if (this.singletonsCurrentlyInDestruction) {
					throw new BeanCreationNotAllowedException(beanName,
							"Singleton bean creation not allowed while singletons of this factory are in destruction " +
							"(Do not request a bean from a BeanFactory in a destroy method implementation!)");
				}
				if (logger.isDebugEnabled()) {
					logger.debug("Creating shared instance of singleton bean '" + beanName + "'");
				}
				//将B的beanName添加到isSingletonCurrentlyInCreation
				beforeSingletonCreation(beanName);
				boolean newSingleton = false;
				boolean recordSuppressedExceptions = (this.suppressedExceptions == null);
				if (recordSuppressedExceptions) {
					this.suppressedExceptions = new LinkedHashSet<>();
				}
				try {
					singletonObject = singletonFactory.getObject();
					newSingleton = true;
				}
				catch (IllegalStateException ex) {
					// Has the singleton object implicitly appeared in the meantime ->
					// if yes, proceed with it since the exception indicates that state.
					singletonObject = this.singletonObjects.get(beanName);
					if (singletonObject == null) {
						throw ex;
					}
				}
				catch (BeanCreationException ex) {
					if (recordSuppressedExceptions) {
						for (Exception suppressedException : this.suppressedExceptions) {
							ex.addRelatedCause(suppressedException);
						}
					}
					throw ex;
				}
				finally {
					if (recordSuppressedExceptions) {
						this.suppressedExceptions = null;
					}
					afterSingletonCreation(beanName);
				}
				if (newSingleton) {
					addSingleton(beanName, singletonObject);
				}
			}
			return singletonObject;
		}
	}

```

在初始化`bean`的时候，还会判断检查`bean`是否有循环依赖，而且是否允许循环依赖，形成了循环依赖，所以最终`earlySingletonExposure`结合其他的条件综合判断为`true`,进行下面的流程`addSingletonFactory`
![在这里插入图片描述](https://img-blog.csdnimg.cn/a355dcf8d96a4d07acbbcf5b655e540a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
往`singletonFactories`存放数据，清除`earlySingletonObjects`中`BeanName`对应的数据。这里有个很重要的点，是往`singletonFactories`里面存入了值，这是`Spring`处理循环依赖的核心点。`getEarlyBeanReference`这个方法是`getObject`的实现，可以简单认为是返回了一个为填充完毕的`Bean`的对象实例
![在这里插入图片描述](https://img-blog.csdnimg.cn/31803b20b4c24933bd390b98f98d0c7e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/b8ca21a1ca3f4a2a96d51cc2ef9692a4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)


**总结**

`Spring`通过`BeanFactory`的`getBean()`方法获取`bean`实例的大致流程为：


从缓存中获取`bean`实例（三级缓存  解决循环依赖问题）


如果`bean`没有被创建过，执行创建`bean`的流程


`autowireConstructor`匹配构造函数，通过反射创建一个`bean`实例


通过`populateBean`完成`bean`的属性注入


通过`initializeBean`检查`bean`配置得初始化方法和`Aware`接口


将创建的`bean`加入到`IOC`容器中

