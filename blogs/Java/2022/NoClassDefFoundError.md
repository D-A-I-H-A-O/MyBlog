---
title: NoClassDefFoundError
date: 2022-03-03
categories:
 - Java
tags:
 - 异常
---

#  问题描述

`java.lang.NoClassDefFoundError` ，意味着找不到类定义，当`JVM`或者`ClassLoader`实例尝试装载该类的定义（这通常是一个方法调用或者`new`表达式创建一个实例过程的一部分）而这个类定义并没有找时所抛出的错误。

# 问题原因
该异常一般出现在编译环境和运行环境不一致的情况下，就是说有可能在编译过后更改了`Classpath`或者`jar`包所以导致在运行的过程中`JVM`或者`ClassLoader`无法找到这个类的定义。

`NoClassDefFoundError`错误的发生，是因为`Java`虚拟机在编译时能找到合适的类，而在运行时不能找到合适的类导致的错误。例如在运行时我们想调用某个类的方法或者访问这个类的静态成员的时候，发现这个类不可用，此时`Java`虚拟机就会抛出`NoClassDefFoundError`错误。与`ClassNotFoundException`的不同在于，这个错误发生只在运行时需要加载对应的类不成功，而不是编译时发生。很多`Java`开发者很容易在这里把这两个错误搞混。

# NoClassDefFoundError和ClassNotFoundException区别
我们经常被`java.lang.ClassNotFoundException`和`java.lang.NoClassDefFoundError`这两个错误迷惑不清，尽管他们都与`Java classpath`有关，但是他们完全不同。`NoClassDefFoundError`发生在`JVM`在动态运行时，根据你提供的类名，在`classpath`中找到对应的类进行加载，但当它找不到这个类时，就发生了`java.lang.NoClassDefFoundError`的错误，而`ClassNotFoundException`是在编译的时候在`classpath`中找不到对应的类而发生的错误。`ClassNotFoundException`比`NoClassDefFoundError`容易解决，是因为在编译时我们就知道错误发生，并且完全是由于环境的问题导致。而如果你在`J2EE`的环境下工作，并且得到`NoClassDefFoundError`的异常，而且对应的错误的类是确实存在的，这说明这个类对于类加载器来说，可能是不可见的。

# 怎么解决NoClassDefFoundError错误
可能的原因如下：

 1. 对应的`Class`在`java`的`classpath`中不可用
 2. 你可能用`jar`命令运行你的程序，但类并没有在`jar`文件的`manifest`文件中的`classpath`属性中定义
 3. 可能程序的启动脚本覆盖了原来的`classpath`环境变量
 4. 因为`NoClassDefFoundError`是`java.lang.LinkageError`的一个子类，所以可能由于程序依赖的原生的类库不可用而导致
 5. 检查日志文件中是否有`java.lang.ExceptionInInitializerError`这样的错误，`NoClassDefFoundError`有可能是由于静态初始化失败导致的
 6. 如果你工作在`J2EE`的环境，有多个不同的类加载器，也可能导致`NoClassDefFoundError`
 7. 跨进程调用  导致找不到那个类

# NoClassDefFoundError解决示例
* 当发生由于缺少`jar`文件，或者`jar`文件没有添加到`classpath`，或者`jar`的文件名发生变更会导致`java.lang.NoClassDefFoundError`的错误。

* 当类不在`classpath`中时，这种情况很难确切的知道，但如果在程序中打印出`System.getproperty(“java.classpath”)`，可以得到程序实际运行的`classpath`

* 运行时明确指定你认为程序能正常运行的 `-classpath` 参数，如果增加之后程序能正常运行，说明原来程序的`classpath`被其他人覆盖了。

* `NoClassDefFoundError`也可能由于类的静态初始化模块错误导致，当你的类执行一些静态初始化模块操作，如果初始化模块抛出异常，哪些依赖这个类的其他类会抛出`NoClassDefFoundError`的错误。如果你查看程序日志，会发现一些`java.lang.ExceptionInInitializerError`的错误日志，`ExceptionInInitializerError`的错误会导致`java.lang.NoClassDefFoundError: Could not initialize class`，如下面的代码示例：

```java
/**
 * Java program to demonstrate how failure of static initialization subsequently cause
 * java.lang.NoClassDefFoundError in Java.
 * @author Javin Paul
 */
public class NoClassDefFoundErrorDueToStaticInitFailure {

    public static void main(String args[]){

        List<User> users = new ArrayList<User>(2);

        for(int i=0; i<2; i++){
            try{
            users.add(new User(String.valueOf(i))); //will throw NoClassDefFoundError
            }catch(Throwable t){
                t.printStackTrace();
            }
        }         
    }
}

class User{
    private static String USER_ID = getUserId();

    public User(String id){
        this.USER_ID = id;
    }
    private static String getUserId() {
        throw new RuntimeException("UserId Not found");
    }     
}

Output
java.lang.ExceptionInInitializerError
    at testing.NoClassDefFoundErrorDueToStaticInitFailure.main(NoClassDefFoundErrorDueToStaticInitFailure.java:23)
Caused by: java.lang.RuntimeException: UserId Not found
    at testing.User.getUserId(NoClassDefFoundErrorDueToStaticInitFailure.java:41)
    at testing.User.<clinit>(NoClassDefFoundErrorDueToStaticInitFailure.java:35)
    ... 1 more
java.lang.NoClassDefFoundError: Could not initialize class testing.User
    at testing.NoClassDefFoundErrorDueToStaticInitFailure.main(NoClassDefFoundErrorDueToStaticInitFailure.java:23)


Read more: http://javarevisited.blogspot.com/2011/06/noclassdeffounderror-exception-in.html#ixzz3dqtbvHDy
```

* 由于`NoClassDefFoundError`是`LinkageError`的子类，而`LinkageError`的错误在依赖其他的类时会发生，所以如果你的程序依赖原生的类库和需要的`dll`不存在时，有可能出现`java.lang.NoClassDefFoundError`。这种错误也可能抛出`java.lang.UnsatisfiedLinkError: no dll in java.library.path Exception Java`这样的异常。解决的办法是把依赖的类库和`dll`跟你的`jar`包放在一起。

* 如果你使用`Ant`构建脚本来生成`jar`文件和`manifest`文件，要确保`Ant`脚本获取的是正确的`classpath`值写入到`manifest.mf`文件

* `Jar`文件的权限问题也可能导致`NoClassDefFoundError`，如果你的程序运行在像`linux`这样多用户的操作系统种，你需要把你应用相关的资源文件，如`Jar`文件，类库文件，配置文件的权限单独分配给程序所属用户组，如果你使用了多个用户不同程序共享的`jar`包时，很容易出现权限问题。比如其他用户应用所属权限的`jar`包你的程序没有权限访问，会导致`java.lang.NoClassDefFoundError`的错误。

* 基于`XML`配置的程序也可能导致`NoClassDefFoundError`的错误。比如大多数`Java`的框架像`Spring`，`Struts`使用`xml`配置获取对应的`bean`信息，如果你输入了错误的名称，程序可能会加载其他错误的类而导致`NoClassDefFoundError`异常。我们在使用`Spring MVC`框架或者`Apache Struts`框架，在部署`War`文件或者`EAR`文件时就经常会出现`Exception in thread “main” java.lang.NoClassDefFoundError。`

* 在有多个`ClassLoader`的`J2EE`的环境中，很容易出现`NoClassDefFoundError`的错误。由于`J2EE`没有指明标准的类加载器，使用的类加载器依赖与不同的容器像`Tomcat`、`WebLogic`，`WebSphere`加载`J2EE`的不同组件如`War`包或者`EJB-JAR`包。关于类加载器的相关知识可以参考这篇文章类加载器的工作原理。

* 总结来说，类加载器基于三个机制：委托、可见性和单一性，委托机制是指将加载一个类的请求交给父类加载器，如果这个父类加载器不能够找到或者加载这个类，那么再加载它。可见性的原理是子类的加载器可以看见所有的父类加载器加载的类，而父类加载器看不到子类加载器加载的类。单一性原理是指仅加载一个类一次，这是由委托机制确保子类加载器不会再次加载父类加载器加载过的类。现在假设一个`User`类在`WAR`文件和`EJB-JAR`文件都存在，并且被`WAR ClassLoader`加载，而`WAR ClassLoader`是加载`EJB-JAR ClassLoader`的子`ClassLoader`。当`EJB-JAR`中代码引用这个`User`类时，加载`EJB-JAR`所有`class`的`Classloader`找不到这个类，因为这个类已经被`EJB-JAR classloader`的子加载器`WAR classloader`加载。

* 这会导致的结果就是对`User`类出现`NoClassDefFoundError`异常，而如果在两个`JAR`包中这个`User`类都存在，如果你使用`equals`方法比较两个类的对象时，会出现`ClassCastException`的异常，因为两个不同类加载器加载的类无法进行比较。

* 有时候会出现`Exception in thread “main” java.lang.NoClassDefFoundError: com/sun/tools/javac/Main` 这样的错误，这个错误说明你的`Classpath`, `PATH` 或者 `JAVA_HOME`没有安装配置正确或者`JDK`的安装不正确。这个问题的解决办法时重新安装你的`JDK`。

* `Java`在执行`linking`操作的时候，也可能导致`NoClassDefFoundError`。例如在前面的脚本中，如果在编译完成之后，我们删除`User`的编译文件，再运行程序，这个时候你就会直接得到`NoClassDefFoundError`，而错误的消息只打印出`User`类的名称。

```java
java.lang.NoClassDefFoundError: testing/User
    at testing.NoClassDefFoundErrorDueToStaticInitFailure.main(NoClassDefFoundErrorDueToStaticInitFailure.java:23)
```

# 实际情况
更新服务在停止旧服务之前没有休眠，而是立即启动了新服务。（测试休眠一会再启动新服务后不报错，所以猜测是这个原因。）


