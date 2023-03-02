---
title: 五、SpringBoot_自动装配
date: 2023-03-02
categories:
 - Spring
tags:
 - SpringBoot
---


# 自动装配
**官方文档**
`SpringBoot`自动配置尝试根据您添加的 `jar` 依赖项自动配置您的 `Spring` 应用程序

>Spring Boot auto-configuration attempts to automatically configure your Spring application based on the jar dependencies that you have added.

`SpringBoot`定义了一套接口规范，规范规定：`SpringBoot`在启动时会扫描外部引用`jar`包中的`META-INF/spring.factories`文件，将文件中配置的类型信息加载到`Spring`容器，并执行类中定义的各种操作。对于外部`jar`来说，只需要按照`SpringBoot`定义的标准，就能将自己的功能装置进`SpringBoot`。

`SpringBoot`之前如果需要引入第三方依赖，需要手动配置。`SpringBoot`中直接引入一个`starter`即可。比如使用`redis`,直接在项目中引入对应的 `starter` ，通过少量注解和一些简单的配置就能使用第三方组件提供的功能了。
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```
# 自动装配之@SpringBootApplication 

`@SpringBootApplication` 等效于同时声明 `@Configuration`和 `@EnableAutoConfiguration` `@ComponentScan`

* `@EnableAutoConfiguration`：启用 `SpringBoot` 的自动配置机制

* `@Configuration`：允许在上下文中注册额外的 `bean` 或导入其他配置类

* `@ComponentScan`： 扫描被`@Component (@Service,@Controller)`注解的 `bean`，注解默认会扫描**启动类所在的包下所有的类** ，可以自定义不扫描某些 `bean`。

# 自动装配之@EnableAutoConfiguration
自动装配核心功能的实现实际是通过 `AutoConfigurationImportSelector`类。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {

	String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

	/**
	 * Exclude specific auto-configuration classes such that they will never be applied.
	 * @return the classes to exclude
	 */
	Class<?>[] exclude() default {};

	/**
	 * Exclude specific auto-configuration class names such that they will never be
	 * applied.
	 * @return the class names to exclude
	 * @since 1.3.0
	 */
	String[] excludeName() default {};

}
```

```java
	protected AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata,
			AnnotationMetadata annotationMetadata) {
			//isEnabled 判断自动装配开关是否打开。默认spring.boot.enableautoconfiguration=true
		if (!isEnabled(annotationMetadata)) {
			return EMPTY_ENTRY;
		}
		//获取EnableAutoConfiguration注解中的 exclude 和 excludeName。
		AnnotationAttributes attributes = getAttributes(annotationMetadata);
		//获取需要自动装配的所有配置类，读取META-INF/spring.factories
		List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
		//按需加载
		configurations = removeDuplicates(configurations);
		Set<String> exclusions = getExclusions(annotationMetadata, attributes);
		checkExcludedClasses(configurations, exclusions);
		configurations.removeAll(exclusions);
		configurations = filter(configurations, autoConfigurationMetadata);
		//触发自动配置导入事件
		fireAutoConfigurationImportEvents(configurations, exclusions);
		return new AutoConfigurationEntry(configurations, exclusions);
	}

	protected boolean isEnabled(AnnotationMetadata metadata) {
		if (getClass() == AutoConfigurationImportSelector.class) {
			return getEnvironment().getProperty(EnableAutoConfiguration.ENABLED_OVERRIDE_PROPERTY, Boolean.class, true);
		}
		return true;
	}
```
1、判断自动装配开关是否打开。可在 `application.properties` 或 `application.yml` 中设置，默认`spring.boot.enableautoconfiguration=true`
![在这里插入图片描述](https://img-blog.csdnimg.cn/4190f02d9a8d45fe9329660fedce90d0.png)
2、获取`EnableAutoConfiguration`注解中的 `exclude` 和 `excludeName`。
![在这里插入图片描述](https://img-blog.csdnimg.cn/f90094c0e948470ea6f24738519404b1.png)

3、读取`META-INF/spring.factories`，获取需要自动装配的所有配置类
![在这里插入图片描述](https://img-blog.csdnimg.cn/d64b164128eb46b38da679cc899e5cf9.png)
4、`spring.factories`中配置，每次启动不会全部加载。使用`AutoConfigurationImportFilter`接口中的方法进行过滤；`AutoConfigurationImportFilter`是一个功能型接口，它的实现类是`OnClassCondition`。`OnClassCondition`继承`FilteringSpringBootCondition`，`FilteringSpringBootCondition`实现。

```java
private List<String> filter(List<String> configurations, AutoConfigurationMetadata autoConfigurationMetadata) {
		long startTime = System.nanoTime();
		String[] candidates = StringUtils.toStringArray(configurations);
		boolean[] skip = new boolean[candidates.length];
		boolean skipped = false;
		for (AutoConfigurationImportFilter filter : getAutoConfigurationImportFilters()) {
			invokeAwareMethods(filter);
			boolean[] match = filter.match(candidates, autoConfigurationMetadata);
			for (int i = 0; i < match.length; i++) {
				if (!match[i]) {
					skip[i] = true;
					candidates[i] = null;
					skipped = true;
				}
			}
		}
		if (!skipped) {
			return configurations;
		}
		List<String> result = new ArrayList<>(candidates.length);
		for (int i = 0; i < candidates.length; i++) {
			if (!skip[i]) {
				result.add(candidates[i]);
			}
		}
		if (logger.isTraceEnabled()) {
			int numberFiltered = configurations.size() - result.size();
			logger.trace("Filtered " + numberFiltered + " auto configuration class in "
					+ TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime) + " ms");
		}
		return new ArrayList<>(result);
	}
```
查看 `RedisAutoConfiguration `查找到`@ConditionalOnClass`,最终找到`Conditional`接口，该接口根据某些条件向`Spring`容器中注入`Bean`

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
@Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })
public class RedisAutoConfiguration {
			...
}
```
除了`@ConditionalOnClass`注解之外还有一下类似的注解：

>@ConditionalOnClass ： classpath中存在该类时起效 
@ConditionalOnMissingClass ： classpath中不存在该类时起效 
@ConditionalOnBean ： DI容器中存在该类型Bean时起效 
@ConditionalOnMissingBean ： DI容器中不存在该类型Bean时起效 
@ConditionalOnSingleCandidate ： DI容器中该类型Bean只有一个或@Primary的只有一个时起效 
@ConditionalOnExpression ： SpEL表达式结果为true时 
@ConditionalOnProperty ： 参数设置或者值一致时起效 
@ConditionalOnResource ： 指定的文件存在时起效 
@ConditionalOnJndi ： 指定的JNDI存在时起效 
@ConditionalOnJava ： 指定的Java版本存在时起效 
@ConditionalOnWebApplication ： Web应用环境下起效 
@ConditionalOnNotWebApplication ： 非Web应用环境下起效

# 自动装配@Configuration
意思是声明一个类为配置类(替代以前的`applicationContext.xml`文件，完成`spring`容器的初始化。)并将其添加到`IOC`容器中。

```java
//改变jackson配置
@Configuration
public class JacksonConfig {

    /**
     * Jackson全局转化long类型为String，解决jackson序列化时long类型缺失精度问题
     *
     * @return Jackson2ObjectMapperBuilderCustomizer 注入的对象
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        Jackson2ObjectMapperBuilderCustomizer customizer = new Jackson2ObjectMapperBuilderCustomizer() {
            @Override
            public void customize(Jackson2ObjectMapperBuilder jacksonObjectMapperBuilder) {
                jacksonObjectMapperBuilder.timeZone(TimeZone.getTimeZone("GMT+8"));
                jacksonObjectMapperBuilder.dateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
                jacksonObjectMapperBuilder.serializerByType(Long.TYPE, ToStringSerializer.instance);
                jacksonObjectMapperBuilder.serializerByType(Long.class, ToStringSerializer.instance);
            }
        };
        return customizer;
    }
}
```
# 自动装配@ComponentScan
`@ComponentScan`用于类或接口上主要是指定扫描路径，`spring`会把指定路径下带有指定注解的类自动装配到`bean`容器里。会被自动装配的注解包括`@Controller、@Service、@Component、@Repository`等等。与`ComponentScan`注解相对应的`XML`配置就是`<context:component-scan/>`， 根据指定的配置自动扫描`package`，将符合条件的组件加入到`IOC`容器中；

[spring boot自动装配之@ComponentScan详解](https://blog.csdn.net/qq_39093474/article/details/124110591)

**总结**：`Spring Boot`之所以能够自动装配，是从配置文件中加载所有自动装配的类，然后根据规则排除不需要装配的类，最后将需要装配的类名称数组返回，`Spring`根据指定的配置自动扫描`package`，将符合条件的组件加入到`IOC`容器中；

# 自定义Starter
`Starter`是`Spring Boot`中的一个非常重要的概念，`Starter`相当于模块，它能将模块所需的依赖整合起来并对模块内的`Bean`根据环境（ 条件）进行自动配置。

使用者只需要依赖相应功能的`Starter`，无需做过多的配置和依赖，`Spring Boot`就能自动扫描并加载相应的模块并设置默认值，做到开箱即用。

[SpringBoot自定义Starter](https://www.cnblogs.com/cjsblog/p/10926408.html)
