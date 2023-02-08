---
title: 四、Spring—MVC
date: 2023-02-08
categories:
 - Spring
tags:
 - Spring
---

# MVC
`MVC` ：`Model View Controller`，是模型(`model`)－视图(`view`)－控制器(`controller`)的缩写，一种软件设计规范。本质上也是一种解耦。

* `Model`（模型）是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据。

* `View`（视图）是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的。

* `Controller`（控制器）是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据。


#  Spring-MVC
`Spring-MVC` 是一种基于`Java` 的实现了`Web MVC`设计模式的请求驱动类型的轻量级`Web` 框架，即使用了`MVC`架构模式的思想，将 `web` 层进行职责解耦，基于请求驱动指的就是使用请求-响应模型，框架的目的就是帮助我们简化开 发，`Spring-MVC`也是要简化我们日常`Web`开发的。


## Spring MVC的请求流程
![在这里插入图片描述](https://img-blog.csdnimg.cn/a987ec937b4445b88aefa4b240d8f1b0.png)

 1. 首先用户发送请求——>`DispatcherServlet`，前端控制器收到请求后自己不进行处理，而是委托给其他的解析器进行处理，作为统一访问点，进行全局的流程控制；
 2. `DispatcherServlet`——>`HandlerMapping`， `HandlerMapping` 将会把请求映射为`HandlerExecutionChain` 对象（包含一 个`Handler` 处理器（页面控制器）对象、多个`HandlerInterceptor` 拦截器）对象，通过这种策略模式，很容易添加新 的映射策略；
 3. `DispatcherServlet`——>`HandlerAdapter`，`HandlerAdapter` 将会把处理器包装为适配器，从而支持多种类型的处理器， 即适配器设计模式的应用，从而很容易支持很多类型的处理
 4. `HandlerAdapter`——>处理器功能处理方法的调用，`HandlerAdapter` 将会根据适配的结果调用真正的处理器的功能处理方法，完成功能处理；并返回一个`ModelAndView` 对象（包含模型数据、逻辑视图名）；
 5. `ModelAndView` 的逻辑视图名——> `ViewResolver`，`ViewResolver` 将把逻辑视图名解析为具体的`View`，通过这种策略模式，很容易更换其他视图技术；
 6. `View`——>渲染，`View` 会根据传进来的`Model` 模型数据进行渲染，此处的`Model` 实际是一个`Map` 数据结构，因此 很容易支持其他视图技术；
 7. 返回控制权给`DispatcherServlet`，由`DispatcherServlet` 返回响应给用户，到此一个流程结束。

