---
title: Java虚拟机——JVM
date: 2022-02-21
categories:
 - Java
tags:
 - JVM
---

﻿# 概述

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210703172421895.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

`JVM`即所谓的`Java虚拟机`，是一个软件，用来执行一系列虚拟计算机指令，是二进制字节码的`运行环境`，负责装载字节码到其内部，解释（编译）为对应平台上的机器指令执行。

其实，说`JVM`是`Java`的虚拟机已经不太准确，因为现在的`JVM`已经是一个跨语言的平台了，不仅是`Java`、`Kotlin`、`Clojure`，`Groovy`、`Scala`甚至`JavaScript`也可以通过特定的编译器进行编译生成字节码文件（字节码文件是编译后的二进制产物，不论是用什么语言进行编写的，只要能编译成对应的字节码文件，就能在`JVM`上运行）。因此，`JVM`就像是制定了一套自己的语言标准，其它任何语言都可以翻译到`JVM`，再由`JVM`和操作系统打交道，具体的针对不同平台的指令进行执行。

## JDK、JRE、JVM
* `JDK（Java Development Kit）Java开发工具包`：是用来编译、调式`Java`程序的开发工具包。包括`Java`工具`（javac/java/jdb等）`和`Java`基础的类库`（Java API）`

* `JRE（Java Runtime Environment）Java运行时环境`: 是`Java平台`，所有的程序都要在`JRE`下才能运行。包括`JVM`和`Java`核心类库和支持文件。


* `JVM（Java Virtual Machine）Java虚拟机`：是`JRE`的一部分。`JVM`主要工作是解释自己的指令集（即字节码）并映射到本地的`CPU`指令集和`OS`的系统调用。`Java`语言是跨平台运行的，不同的操作系统会有不用的`JVM`映射规则，使之与操作系统无关，完成跨平台性。

从大到小：JDK->JRE->JVM

使用`JDK`（调用`Java API`）开发`Java`程序后，通过`JDK`中的编译程序`(javac)`将`Java`程序编译为`Java`字节码，在`JRE`上运行这些字节码，`JVM`会解析并映射到真实操作系统的`CPU`指令集和`OS`的系统调用。

## JVM位置

`JVM`是运行在操作系统之上的，它与硬件没有直接的交互。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210703172701984.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
## JVM特点

1、一次编译，到处运行

2、自动内存管理

2、自动垃圾回收机制

## JVM结构
`Java虚拟机`在执行`Java`程序的过程中会把它所管理的内存划分为若干不同的数据区域。根据`Java虚拟机规范`的规定，`Java虚拟机`所管理的内存有以下几个区域：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210703172607896.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
在实际上，为了更好的适应`CPU`性能提升，最大限度提升`JVM`运行效率，`JDK`中各个版本对`JVM`进行了一些迭代：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210707135500757.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


`JDK1.6`、`JDK1.7`、`JDK1.8`主要有以下差异：
* `JDK1.6`：有永久代，静态变量存放在永久代上。
* `JDK1.7`：有永久代，但已经把字符串常量池、静态变量、存放在堆上。逐渐减少永久代的使用。
* `JDK1.8`：去除永久代。运行时常量池、类常量池都保存在元数据区，也就是常说的`元空间`。但是字符串常量池依然存放在堆上。

### Class常量池、运行时常量池、字符串常量池
> 为什么需要常量池

一个`Java`源文件中的类、接口，编译后会产生一个字节码文件，而`Java`中的字节码文件需要其他的数据支撑，通常这种数据很大，不能直接存放到字节码里面。所以把对这些数据的引用存放到常量池，在真正需要的时候，通过动态链接将符号引用转为直接引用。

>符号引用和直接引用

1、符号引用：符号引用是一组符号来描述是引用的目标，符号可以是任何形式的字面量，只要使用时能无歧义的定位到目标就行。符号引用与虚拟机实现的内存布局无关，引用的目标并不一定加载到了内存中。

2、直接引用：直接引用可以是指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄。直接目标与虚拟机内存布局相关，同一个符号引用在不同虚拟机实例上翻译出来的直接引用一般不会相同。如果有了直接引用，那说明引用的目标必定已经存在与内存之中了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210713221720356.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
`Constant Pool`也就是常量池中有22项内容，其中带`Utf8`的就是符号引用。比如`#2`，它的值是`com/xrq/test6/TestMain`，表示的是这个类的全限定名；又比如`#5`为`i`，`#6`为`I`，它们是一对的，表示变量是`Integer（int）`类型的，名字叫做`i`；`#6`为`D`、`#7`为`d`也是一样，表示一个`Double（double）`类型的变量，名字为`d`；`#18`、`#19`表示的都是方法的名字。

* Class常量池

当`Java`类被编译后形成`class`文件，`class`文件中除了包含类的版本、字段、方法、接口等描述信息外。还有一项信息就是常量池，用于存放编译期生成的各种字面量和符号引用。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210714160929458.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210714150642804.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
* 运行时常量池

常量池指的是字节码中的`Constant pool`部分，当字节码文件被加载到内存中后，方法区中会存放字节码文件的`Constant pool`相关信息，这时候也就成为了运行时常量池。运行时常量池中包含多种不同的常量，包括编译期就已经明确的数值字面量，也包括到运行期解析后才能够获得的方法或字段引用。此时不再是常量池中的符号地址了，而是真实地址。

另外，运行时常量池具有动态性。也就是在方法区中的运行时常量池是可以发生变化的。而常量池不是，它是静态的，当编译生成字节码文件后就不变了。

* 字符串常量池

全局字符串常量池（也就是字符串常量池 `string pool`也有叫做`string literal pool`）里的内容是在类加载完成，经过验证，准备阶段之后在堆中生成字符串对象实例，然后将该字符串对象实例的引用值存到字符串常量池中。（字符串常量池中存的是引用值，而不是具体的实例对象，具体的实例对象是在堆中开辟的一块空间存放的。）在`HotSpot VM`里实现的字符串常量池功能是一个`StringTable`类，它是一个哈希表，里面存的是驻留字符串（也就是常说的用双引号括起来的）的引用（而不是驻留字符串实例本身），也就是说在堆中的某些字符串实例被这个`StringTable`引用之后就等同被赋予了“驻留字符串”的身份。这个`StringTable`在每个`HotSpot VM`的实例只有一份，被所有的类共享。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210714163820170.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

## Class File
[java class文件详解](https://www.cnblogs.com/zsql/p/12907120.html)

## 类加载机制
`Java虚拟机`把描述类的数据从`Class`文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的`Java`类的原型（类模板对象），这就是虚拟机的类加载机制。

>所谓类模板对象，其实就是`Java`类在`JVM`内存中的一个快照，`JVM`将从字节码文件中解析出的常量池、类字段、类方法等信息存储到类模板中。这样`JVM`在运行期便能通过类模板而获取`Java`类中的任意信息。能够对`Java`类的成员变量进行遍历，也能进行`Java`方法的调用。

### 类的生命周期
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210714073817321.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

#### 类的加载
类的加载指的就是将类的`class`文件中的二进制数据读取到内存中，存放在运行时数据区的方法区中，并在堆中创建一个大的`java.lang.Class`对象，用来封装方法区内的数据结构。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210712074659537.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
>加载时虚拟机做了什么
* 通过类的全名，获取类的二进制数据流
* 解析类的二进制数据流为方法区内的数据结构（`Java`类模型）
* 创建`java.lang.Class`类的实例,表示该类型。作为方法区这个类的各种数据的访问入口。（一般这个`class`对象会存储在堆中，不过`HotSpot`虚拟机比较特殊，这个`class`对象是放在方法区中的。）


>何时加载
* 预加载：在虚拟机启动的时候会加载，加载的时`JAVA_HOME/lib`下的`rt.class`下的`.class`文件，是`java`程序运行时需要的类。比如`java.lang.*`以及`java,util.*`等
* 运行时加载：虚拟机中在用到一个`.class`文件时，首先会去内存找你查找这个`.class`文件有没有被加载，没有被加载会根据这个类的全限定名去加载。
>怎么获取类的二进制流

* 通过文件系统读入一个`class`后缀的文件
* 从`zip`包中获取，这就是以后`jar`、`ear`、`war`格式的基础
* 从网络中获取，典型应用就是`Applet`
* 运行时计算生成，典型应用就是动态代理技术
* 由其他文件生成，典型应用就是`JSP`，即由`JSP`生成对应的`.class`文件
* 从数据库中读取，这种场景比较少见

其实无论是通过`ZIP`，还是通过网络，还是通过其他文件生成，最终都是通过一个类的全限定名来获取类的二进制字节流。 通过一个类的全限定名来获取类的二进制字节流是目的，`ZIP`，网络，文件是手段。
#### 类的验证
即验证`Class`文件的字节流中包含的信息符合当前虚拟机的要求，保证被加载类的正确性，不会危害虚拟机自身安全。

>四种验证

* 文件格式验证：验证字节流是否符合`Class`文件规范，符合规范通过验证才能保证输入的字节流能正确的被解析并存储到方法区。

* 元数据验证：对类的元数据信息进行语义校验

* 字节码验证：检验程序语义是否符合规范，符合逻辑，对类的方法进行校验

* 符号引用验证：发生在将符号引用转换为直接引用的时候，可以看作是对类自身以外（常量池中各种符号的应用）信息的匹配校验。如：符号引用中通过字符串描述的全限定名是否能找到对应的类；符号引用中的类、字段、方法的访问性（`private、protected、public、default`）是否可被当前类访问

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021071321551948.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

#### 类的准备
准备：为类变量分配内存并默认初始化值。

注意：
* 只为类变量，即被`static`修饰的变量分配内存，实例变量在实例初始化的时候会随对象一起分配在堆中。
* 这个阶段初始化赋值的变量不包括`final`修饰的`static`变量，因为`final`在编译的时候就会分配了,准备阶段会显式赋值。
* `Java`并不支持`boolean`类型，对于`boolean`类型，内部实现是`int`,由于`int`的默认值是0,故对应的，`boolean`的默认值就是`false`
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021071322090133.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
#### 类的解析
解析：将常量池中的符号引用转为直接引用的过程。（将类、接口、字段和方法的符号引用转为直接引用）。


虚拟机在加载`Class`文件时才会动态链接，也就是说，`Class`文件中不会保存各个方法和字段的最终内存布局信息。因此，这些字段和方法的符号引用不经过转换是无法直接被虚拟机使用的。当虚拟机运行，要从常量池中获得对应的符号引用，再在类加载过程中（初始化阶段）将其替换成直接引用。

`Java`虚拟机规范并没有明确要求解析阶段一定要按照顺序执行。在`HotSpot VM`中,加载、验证、准备和初始化会按照顺序有条不紊地执行,但链接阶段中的解析操作往往会伴随着`JVM`在执行完初始化之后再执行
#### 类的初始化
开始真正执行类中定义的`Java`代码，初始化过程就是执行类构造器`<clint>()`的过程。之前的准备阶段是给类变量分配内存赋初始值，初始化是将类变量赋予用户指定的值。

此方法不需要定义，是`javac`编译器自动收集类中的所有类变量的赋值动作和静态代码块中的语句合并而来。

若类有父类，`JVM`会保证在子类的`<clint>()`执行前，先完成父类的`<clint>()`。`<clint>()`不同与类的构造方法`init`(由父及子，静态先行)

`Java`编译器不会为所有的类都产生`<clint>()`初始化方法。有些类在编译为字节码后，字节码文件中不会包含`<clint>()`方法。
* 一个类中没有声明任何变量，也没有静态代码块时
* 一个类中声明类变量，但是没有明确使用类变量的初始化语句以及静态代码块来执行初始化操作时
* 一个类中包含`static，final`修饰的基本数据类型的字段，这些类字段初始化语句采用编译时常量表达式（如果这个`static，final`不是通过方法或者构造器，则在链接阶段。）

```java
/**
 * 哪些场景下，java编译器就不会生成<clinit>()方法
 */
public class InitializationTest {
    //对应非静态的字段，不管是否进行了显式赋值，都不会生成<clinit>()方法
    public int num = 1;
    //静态的字段，没有显式的赋值，不会生成<clinit>()方法
    public static int num1;
    //比如对于声明为static final的基本数据类型的字段，不管是否进行了显式赋值，都不会生成<clinit>()方法
    public static final int num2 = 1;
}
```

```java
/**
 * 说明：使用static + final修饰的字段的显式赋值的操作，到底是在哪个阶段进行的赋值？
 * 情况1：在链接阶段的准备环节赋值
 * 情况2：在初始化阶段<clinit>()中赋值
 * 结论：
 * 在链接阶段的准备环节赋值的情况：
 * 1. 对于基本数据类型的字段来说，如果使用static final修饰，
 * 则显式赋值(直接赋值常量，而非调用方法）通常是在链接阶段的准备环节进行
 * 
 * 2. 对于String来说，如果使用字面量的方式赋值，使用static final修饰的话，
 * 则显式赋值通常是在链接阶段的准备环节进行
 *
 * 在初始化阶段<clinit>()中赋值的情况：
 * 排除上述的在准备环节赋值的情况之外的情况。
 * 最终结论：使用static + final修饰，
 * 且显示赋值中不涉及到方法或构造器调用的基本数据类型或String类型的显式赋值，
 * 是在链接阶段的准备环节进行。
 */
public class InitializationTest {
    public static int a = 1;//在初始化阶段<clinit>()中赋值
    public static final int INT_CONSTANT = 10;//在链接阶段的准备环节赋值

    public static final Integer INTEGER_CONSTANT1 = Integer.valueOf(100);//在初始化阶段<clinit>()中赋值
    public static Integer INTEGER_CONSTANT2 = Integer.valueOf(1000);//在初始化阶段<clinit>()中赋值

    public static final String s0 = "helloworld0";//在链接阶段的准备环节赋值
    public static final String s1 = new String("helloworld1");//在初始化阶段<clinit>()中赋值

    public static String s2 = "helloworld2";
    public static final int NUM1 = new Random().nextInt(10);//在初始化阶段<clinit>()中赋值
}
```

**触发初始化**

如果一个类被直接引用，就会触发类的初始化。在`java`中，直接引用的情况有：

* 通过`new`关键字实例化对象、读取或设置类的静态变量、调用类的静态方法。

* 通过反射方式执行以上三种行为。

* 初始化子类的时候，会触发父类的初始化。

* 作为程序入口直接运行时（也就是直接调用`main`方法）。

* `JDK1.7`开始提供的动态语言支持，如果一个`java.lang.invoke.MethodHandle`实例最后的解析结果`REF_getStatic、REF_putStatic、REF_invokeStatic`的方法句柄，并且这个方法句柄所对应的类没有进行过初始化，则需要先触发其初始化

除了以上的情况属于主动使用，其他的情况均属于被动使用。被动使用不会引起类的初始化。意味着没有`<clint>()`的调用

* 调用`ClassLoader`类的`loadClass()`方法加载一个类，并不是对类的主动使用，不会导致类的初始化

* 当访问一个静态字段时，只有真正声明这个字段的类才会被初始化。当通过子类引用父类的静态变量，不会导致子类初始化

* 引用常量不会触发此类或接口的初始化。因为常量在链接阶段就已经被显式赋值了

* 通过数组定义类引用，不会触发此类的初始化

```java
# 这里不会进行初始化,因为相当于parent只开辟了空间,没赋值
Parent[]parent=new Parent[10]; 
```
#### 类的使用
任何一个类型在使用之前都必须经历过完整的加载、链接和初始化3个类加载步骤。一旦一个类型成功经历过这3个步骤之后，便"万事俱备,只欠东风"就等着开发者使用了

开发人员可以在程序中访问和调用它的静态类成员信息(比如：静态字段、静态方法)或者使用`new`关键字为其创建对象实例

#### 类的卸载
卸载类即该类的`Class` 对象被 `GC`。

卸载类需要满足 3 个要求:

* 该类的所有的实例对象都已被 `GC`，也就是说堆不存在该类的实例对象。
* 该类没有在其他任何地方被引用
* 该类的类加载器的实例已被 `GC`

所以，在 `JVM` 生命周期内，由 `jvm` 自带的类加载器加载的类是不会被卸载的。但是由我们自定义的类加载器加载的类是可能被卸载的。

`jdk` 自带的 `BootstrapClassLoader, ExtClassLoader, AppClassLoader` 负责加载 `jdk` 提供的类，所以它们(类加载器的实例)肯定不会被回收。而我们自定义的类加载器的实例是可以被回收的，所以使用我们自定义加载器加载的类是可以被卸载掉的。
## 类加载器
类加载器`ClassLoader`，是 `Java` 的核心组件，只负责加载`class`文件，`class`文件在文件开头有特定的文件标示，将`class`文件字节码内容加载到内存中。`ClassLoader`只负责`class`文件的加载，至于它是否可以运行，则由执行引擎`Execution Engine`决定。

>JVM自带的加载器

*  启动类加载器：`BootstrapClassLoader` 主要加载的是JVM自身需要的类，这个类加载使用`C++`语言实现的，是虚拟机自身的一部分，它负责将 `<JAVA_HOME>/lib`路径下的核心类库或`-Xbootclasspath`参数指定的路径下的`jar包`加载到内存中，注意由于虚拟机是按照文件名识别加载`jar包`的，如`rt.jar`，如果文件名不被虚拟机识别，即使把`jar包`丢到`lib`目录下也是没有作用的(出于安全考虑，`Bootstrap`启动类加载器只加载包名为`java、javax、sun`等开头的类)。

* 扩展类加载器：`ExtensionClassLoader` 扩展类加载器是`sun.misc.Launcher$ExtClassLoader`类，由`Java`语言实现的，是`Launcher`的静态内部类，它负责加载`<JAVA_HOME>/lib/ext`目录下或者由系统变量`-Djava.ext.dir`指定位路径中的类库，开发者可以直接使用标准扩展类加载器。

* 系统类加载器：`AppClassLoader`也叫应用类程序加载器，也是由`Java`实现的。它从环境变量`classpath`或者系统属性`java.class.path`所指定的目录中加载类，它是用户自定义的类加载器的默认父加载器。
> 用户自定义加载器

* `java.lang.ClassLoader`的子类，用户可以定制类的加载方式。

### 双亲委派机制
当`JVM`加载一个类的时候，下层的加载器会将任务给上一层类加载器，上一层加载检查它的命名空间中是否已经加载这个类，如果已经加载，则直接使用这个类。如果没有加载，继续往上委托直到顶部。检查之后，按照相反的顺序进行加载。如果`Bootstrap`加载不到这个类，则往下委托，直到找到这个类，如果都不能加载则`ClassNotFoundException` 。一个类可以被不同的类加载器加载。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210706145538210.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

可见性限制：下层的加载器能够看到上层加载器中的类，反之则不行，委派只能从下到上。

 不允许卸载类：类加载可以加载一个类，但不能够卸载一个类。但是类加载器可以被创建或者删除。

**ClassLoader源码（双亲委派机制模型）**
（往上看有没有被加载过，有就使用，则确保唯一性和安全性，如果都没有则往下尝试加载，也是有就使用，如果都不能加载则`ClassNotFoundException` ）
```java
protected Class<?> loadClass(String name, boolean resolve)
            throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // 首先检查这个classsh是否已经加载过了
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    // c==null表示没有加载，如果有父类的加载器则让父类加载器加载
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        //如果父类的加载器为空 则说明递归到bootStrapClassloader了
                        //bootStrapClassloader比较特殊无法通过get获取
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {}
                if (c == null) {
                    //如果bootstrapClassLoader 仍然没有加载过，则递归回来，尝试自己去加载class
                    long t1 = System.nanoTime();
                    c = findClass(name);
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```
**委托机制的意义**
* 防止内存中出现多份同样的字节码。
比如两个类A和类B都要加载`System`类，如果不用委托而是自己加载自己的，那么类A就会加载一份`System`字节码，然后类B又会加载一份`System`字节码，这样内存中就出现了两份`System`字节码。如果使用委托机制，会递归的向父类查找，也就是首选用`Bootstrap`尝试加载，如果找不到再向下。这里的`System`就能在`Bootstrap`中找到然后加载，如果此时类B也要加载`System`，也从`Bootstrap`开始，此时`Bootstrap`发现已经加载过了`System`那么直接返回内存中的`System`即可而不需要重新加载，这样内存中就只有一份`System`的字节码了。
* 安全性
黑客自定义一个`java.lang.String`类，该`String`类具有系统的`String`类一样的功能，只是在某个函数稍作修改。比如`equals`函数，这个函数经常使用，如果在这这个函数中，黑客加入一些“病毒代码”。并且通过自定义类加载器加入到`JVM`中。此时，如果没有双亲委派模型，那么`JVM`就可能误以为黑客自定义的`java.lang.String`类是系统的`String`类，导致“病毒代码”被执行。而有了双亲委派模型，黑客自定义的`java.lang.String`类永远都不会被加载进内存。因为首先是最顶端的类加载器加载系统的`java.lang.String`类，最终自定义的类加载器无法加载`java.lang.String`类。
或许你会想，我在自定义的类加载器里面强制加载自定义的`java.lang.String`类，不去通过调用父加载器不就好了吗?确实，这样是可行。但是，在`JVM`中，判断一个对象是否是某个类型时，如果该对象的实际类型与待比较的类型的类加载器不同，那么会返回`false`。


[Java类加载原理解析](http://www.blogjava.net/zhuxing/archive/2008/08/08/220841.html)

[JVM 类加载机制及双亲委派模型](https://juejin.cn/post/6844903633574690824)

## 运行时数据区
### 堆
对于大多数应用来说，`Java堆`是`Java`虚拟机所管理的内存最大的一块，`Java堆`是被所有线程共享的区域，在虚拟机启动时创建。此内存区域唯一的目的性就是存放对象实例，几乎所有的对象实例都在这里分配内存。

`Java堆`是垃圾收集器管理的主要区域，因此被称为`GC堆`。如果从内存回收的角度看，由于现在的收集器基本上都是采用的分代收集算法，所以`Java堆`还可以细分为：新生代和老年代，在细致一点有`Eden空间`、`From Survivor 空间`、`To Survivor空间`等。

根据`Java虚拟机`规范，`Java堆`可以处于物理上不连续的内存空间中，只要逻辑上是连续的即可，就像磁盘空间一样，实现时既可以实现成固定大小，也可以时可扩展的，不过当前主流的虚拟机都是按照可扩展来实现的（通过`-Xmx`和`-Xms`控制）。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210710104559178.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

堆大小=新生代+老年代。堆的大小可以通过参数`-Xms`、`-Xmx`来指定.

新生代与老年代默认的比值为1:2,（该值可以通过参数 `-XX:NewRatio`来指定，默认`-XX:NewRatio=2`年轻代占整个堆的1/3，老年代占堆的2/3；假如`-XX:NewRatio=4`新生代占1,老年代占4,年轻代占整个堆的1/5，`NewRatio`就是设置老年代的占比,剩下的1给新生代）。

默认情况下，`Edem:from:to=8:1:1`，可以通过参数`-XX:SurvivorRatio`来设置`Eden`区与每一个`Survivor`区的比值.

`JVM` 每次只会使⽤`Eden` 和其中的⼀块 `Survivor`区域来为对象服务，所以⽆论什么时候，总是有⼀块 `Survivor`区域是空闲着的。因此，新⽣代实际可⽤的内存空间为 9/10 ( 即90% )的新⽣代空间。



### 方法区
方法区和`Java堆`一样，是各个线程共享的内存区域，它用于存储已被虚拟机加载的`类信息、常量、静态变量、即时编译器编译后的代码`等数据。虽然`Java虚拟机`规范把方法区描述为堆的一个逻辑部分，但是它却有一个别名叫做`Non-Heap(非堆)`，目的应该就是与`Java堆`区分开来。

在`JDK1.8`以前，`HotSpot`使用永久代来实现方法区，所以某些场合也认为方法区和永久代是一个概念。

在`JDK 1.6`的 时候`HotSpot`开发团队就有放弃永久代，逐步改为采用本地内存（`Native Memory`）来实现方法区的计划了，到了`JDK 1.7`的`HotSpot`，已经把原本放在永久代的字符串常量池、静态变量等移出，而到了 `JDK 1.8`，终于完全废弃了永久代的概念，改用在本地内存中实现的元空间（`Meta- space`）来代替，把`JDK 1.7`中永久代还剩余的内容（主要是类型信息）全部移到元空间中。

元空间的本质和永久代类似，都是对 `JVM `规范中方法区的实现。元空间与永久代最大的区别在于：永久代使用的是堆内存，但是`Java8`以后的元空间并不在虚拟机中而是使用本机物理内存。

`Java虚拟机`规范对方法区的限制非常宽松，除了和`Java堆`一样不需要连续的内存和可以选择固定大小或者可以扩展外，还可以选择不实现垃圾收集。相对而言，垃圾收集行为在这个区域是比较少出现的，但并非数据进入了方法区就如永久代名字一样“永久”存在了。这个区域的内存回收目标主要是针对常量池的回收和类型的卸载，一般来说这个区域的回收“成绩”比较难以令人满意，尤其是对类型的卸载，条件相当苛刻，但这个区域的回收确实是有必要的.

根据`Java虚拟机`规范，当方法区无法满足内存分配需求是，将抛出`OutOfMemoryError`异常。


### 程序计数器
`Program Counter Register`是一块比较小的内存空间，它的作用可以看做是当前线程所执行的字节码的行号指示器。在虚拟机的概念模型里（仅是概念模型，不用虚拟机不同方法实现），字节码解释器工作是就是通过改变这个计数器的值来选取下一条需要执行的字节码指令，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。

由于`Java虚拟机`的多线程是通过线程轮流切换并分配处理器执行时间来实现的，在任何一个确定的时刻，一个处理器（对于多核处理器来说是一个内核）只会执行一条线程中的指令。因此，为了线程切换后能够恢复到正确的执行位置，每条线程都需要一个独立的程序计数器，各线程之间的计数器互不影响，独立存储，称这类内存区域为`线程私有`的内存。

如果线程正在执行的是一个`Java`方法，这个计数器记录的是正在执行的虚拟机字节码指令的地址，如果正在执行的是`Natvie`方法，这个计数器值则为空`（Undefined）`。

此内存空间是唯一一个在`Java虚拟机`规范中没有规定`OutOfMemoryError`情况的区域。

### 栈
与程序计数器一样，`Java虚拟机栈`也是线程私有的，它的生命周期与线程相同。虚拟机栈描述的是`Java`方法执行的内存模型，每个方法被执行的时候都会同时创建一个栈帧用于存储`局部变量表`、`操作栈`、`动态链接`、`方法出口`、等信息。每一个方法被调用直至执行完成的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。

局部变量表存放了编译器可知的各种基本数据类型`(boolean、byte、char、short、int、float、long、double)`，对象引用`(reference类型`，它不等同于对象本身，根据不同的虚拟机实现，它可能是一个指向对象起始地址的引用指针，也可能指向一个代表对象的句柄或者其他与此对象相关的位置)和`returnAdress类型`(指向了一条字节码指令的地址)。

其中64位长度的`long`和`double`类型的数据会占用2个局部变量空间`(Slot)`，其余的数据类型只占用1个。局部变量表所需的内存空间在编译期间完成分配，当进入一个方法时，这个方法需要在栈帧中分配多大的局部变量空间是完全确定的，在方法运行期间不会改变局部变量表的大小。

在`Java虚拟机`规范中，对这个区域规定了两种异常状况：如果线程请求的栈深度大于虚拟机所允许的深度，将抛出`StackOverflowError`异常；如果虚拟机可以动态扩展（当前大部分`Java虚拟机`都可以动态扩展，只不过`Java`虚拟机规范中也允许固定长度的虚拟机栈），当扩展是无法申请到足够的内存时会抛出`OOM`异常。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210707134716772.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


### 本地方法栈
`Native Method Stacks`与虚拟机栈作用类似，其区别不过是虚拟机栈为虚拟机执行`Java`方法（也就是字节码）服务，而本地方法栈则是为虚拟机使用到的`Native`方法服务。虚拟机规范中对本地方法栈中的方法使用的语言、使用方式与数据结构并没有强制规定，因此具体的虚拟机可以自由实现它。甚至有的虚拟机（如`Sun HotSpot虚拟机`）直接就把本地方法栈和虚拟机栈合二为一。与虚拟机栈一样，本地方法栈区域也会抛出`StackOverflowError`和`OOM`异常.

方法的执行都是伴随着线程的。原始类型的本地变量以及引用都存放在线程栈中。而引用关联的对象比如`String`，都存在在堆中。为了更好的理解上面这段话，我们可以看一个例子：

```java
import java.text.SimpleDateFormat;import java.util.Date;import org.apache.log4j.Logger;
 public class HelloWorld {
    private static Logger LOGGER = Logger.getLogger(HelloWorld.class.getName());
    public void sayHello(String message) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.YYYY");
        String today = formatter.format(new Date());
        LOGGER.info(today + ": " + message);
    }}
```
这段程序的数据在内存中的存放如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210706160752161.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
### OutOfMemoryError

```java
Exception in thread “main”: java.lang.OutOfMemoryError: Java heap space
```

原因：对象不能被分配到堆内存中

```java
Exception in thread “main”: java.lang.OutOfMemoryError: PermGen space
```

原因：类或者方法不能被加载到持久代。它可能出现在一个程序加载很多类的时候，比如引用了很多第三方的库；

```java
Exception in thread “main”: java.lang.OutOfMemoryError: Requested array size exceeds VM limit
```

原因：创建的数组大于堆内存的空间

```java
Exception in thread “main”: java.lang.OutOfMemoryError: request  bytes for . Out of swap space?
```

原因：分配本地分配失败。`JNI`、本地库或者`Java虚拟机`都会从本地堆中分配内存空间。

```java
Exception in thread “main”: java.lang.OutOfMemoryError:  （Native method）
```

原因：同样是本地方法内存分配失败，只不过是`JNI`或者本地方法或者`Java虚拟机`发现

## 为什么Java要在虚拟机里运行？

`Java`作为一门高级语言，语法复杂，抽象程度高。因此，直接在硬件上运行这样复杂的程序并不现实。所以呢，在运行`Java`程序之前，需要对其进行一番转换。

将`Java`程序转成`Java`字节码，这样便可以在不同平台上的虚拟机实现运行。这便是`一次编写，到处运行`。

虚拟机的另外一个好处是它带来了一个托管环境，这个托管环境能代替我们处理一些代码中冗长而且容易出错的部分。比如自动内存管理与垃圾回收。除此之外，还提供了诸如数组越界、动态类型、安全权限等等动态检测，使得我们不用书写这些无关业务逻辑的代码。




## Java文件编译到执行的过程

1、`Java`源码`.java文件`首先通过`Java编译器`进行编译，其中编译原理包含6部分内容。

2、字节码文件被`Java虚拟机`通过`类加载器`加载到内存，（加载后的`Java`类会被存放在`方法区`中，实际运行时，虚拟机会执行方法区中的代码。）并通过`字节码校验器`进行字节码的合法性校验，即可通过翻译字节码`(解释执行)`或者`JIT`编译器`(编译执行)`进行程序的运行，无论经过哪种方式，都需要经过不同操作系统提供的具体指令。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210703172504696.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210703210351245.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


> 之所以称为Java字节码，是因为Java字节码指令的操作码（opcode）被固定为一个字节。

>解释执行：即逐条将字节码翻译成机器码进行执行。
>即时编译：即将一个方法中包含的所有字节码编译成机器码后再执行。
前者优势在于无需等待编译，而后者的优势在于实际运行速度更快。HotSpot默认采用混合模式，综合了两者的优点。它会先解释执行字节码，而后将其中反复执行的热点代码，以方法为单位进行即时编译。

## JVM是如何执行方法调用

```java
public class VariableParameterDemo {

    static void invoke(Object obj, Object... args) {
        System.out.println("1111111");
    }

    static void invoke(String s, Object obj, Object... args) {
        System.out.println("222222");
    }

    static void invokeInt(int i) {
        System.out.println("int");
    }

    static void invokeInt(Integer i) {
        System.out.println("Integer");
    }

    public static void main(String[] args) {
        invoke(null, 1);//222222
        invoke(null, 1, 2);//222222
        
        // 只有手动绕开可变长参数的语法糖，才能调用第一个 invoke 方法
        invoke(null, new Object[]{1});

        invokeInt(1);

    }
    /**
     * 1、同一个类中出现多个名字相同，并且参数类型相同的方法，无法通过编译。
     * 也就是说，如果想在同一个类中定义名字相同的方法，那么它们参数类型必须不同。
     * 这些方法之间的关系，叫做重载。
     *
     * 重载除了同一个类中的方法，也可以作用于这个类所继承来的方法。
     * 也就是说，如果子类和父类中非私有方法同名的方法，而这两个方法参数类型不同，或参数长度不同，
     * 那么这两个方法同样构成了重载。
     *
     * 如果子类定义了与父类中非私有方法同名的方法，且两个方法的参数类型都相同。
     * 当这个两个方法都是静态的，那么子类中的方法隐藏了父类中的方法(super调用不到)
     * 当这两个方法都不是静态的，且都不是私有的，那么子类的方法重写了父类中的方法。
     *
     * 2、重载的方法在编译过程中即可完成识别。具体到每一个方法调用，Java编译器会根据
     * 所传入参数的声明类型（注意于实际类型区分）来选取重载方法。
     *
     * 2.1、选取的过程分为三个阶段：
     * 1、在不考虑对基本类型自动装拆箱，以及可变长参数的情况下选取重载方法。
     * 2、如果在第一个阶段中没有找到适配的方法，那么在允许自动拆箱，但不允许可变长参数的情况下选取重载方法。
     * 3、如果在第二个阶段中没有找到适配的方法，那么在允许自动拆箱以及可变长参数的情况下选择重载方法。
     *
     * 如果 Java 编译器在同一个阶段中找到了多个适配的方法，那么它会在其中选择一个最为贴切的，
     * 而决定贴切程度的一个关键就是形式参数类型的继承关系。
     *
     * 在上面invoke中，当传入 null 时，它既可以匹配第一个方法中声明为 Object 的形式参
     * 数，也可以匹配第二个方法中声明为 String 的形式参数。由于 String 是 Object 的子类，
     * 因此 Java 编译器会认为第二个方法更为贴切。
     */
}
```
### JVM的静态绑定和动态绑定

1、`Java虚拟机`识别方法的关键在于类名、方法名以及方法描述符。

2、方法描述符：它是由方法的参数类型以及返回类型所构成的。在同一个类中，如果同时出现多个名字相同且描述符也相同的方法，那么`Java虚拟机`会在类验证阶段报错。

3、`Java虚拟机`对方法的重写判断同样基于方法描述符。也就是说，如果子类定义了与父类中非私有，非静态方法同名的方法，那么只有当这两个方法的参数类型以及返回类型一致，才会被判定为重写。

4、由于对重载方法的区分在编译阶段已经完成，可以认为`Java虚拟机`不存在重载这一概念。因此在某些地方，重载也被称为静态绑定，或者编译时多态，而重写则被称为动态绑定。

这个说法在`Java虚拟机`语境下并非完全正确。这是因为某个类中的重载方法可能被它的子类所重写，因此`Java编译器`会将所有对非私有实例方法的调用编译为需要动态绑定的类型。确切地说，`Java虚拟机`中的静态绑定是指在解析时便能够直接识别目标方法的情况，而动态绑定则指的是需要在运行过程中根据调用者的动态类型来识别目标方法的情况。

`Java虚拟机`的动态绑定是通过方法表这一数据结构（本质就是个数组）来实现的。方法表中每一个重写方法的索引值，与父类方法表中被重写的方法的索引值一致。

在解析虚方法（方法重写的方法，可认为就是虚方法）调用时，`Java虚拟机`会记录下所声明的目标方法的索引值，并且在运行时根据这个索引值查找具体的目标方法。

`Java虚拟机`中的即时编译器会使用内联缓存来加速动态绑定。`Java虚拟机`所采用的单态内联缓存将记录调用者的动态类型，以及它所对应的目标方法。当碰到新的调用者时，如果其动态类型与缓存中的类型匹配，则直接调用缓存的目标方法。否则，`Java虚拟机`将内联缓存劣化为超多态内联缓存，在今后的执行过程中直接使用方法表进行动态绑定。

## JVM是如何处理异常的？

### 异常
`Java`语言规范中，所有异常都是`Throwable`l类或者其子类的实例。

`Throwable`有两个直接子类

1、`Error`：涵盖程序不应捕获的异常，当程序触发`Error`，它的执行状态已经无法恢复，需要中止线程甚至是中止虚拟机。

2、`Exception`：涵盖程序可能需要捕获并且处理的异常。`Exception`有一个特殊的子类`RuntimeException`，用来表示“程序虽然无法继续执行，但是还能抢救一下”的情况。`RuntimeException`和`Error`都是非检查异常。其他的异常都属于检查异常。在`Java`中，所有的检查异常都需要程序显示的捕获。或者在方法声明中使用`throws`关键字标注。

### JVM如何捕获异常
在编译生成的字节码中，每个方法都附带一个异常表。异常表中的每一个条目代表一个异常
处理器，并且由 `from` 指针、`to` 指针、`target `指针以及所捕获的异常类型构成。这些指针
的值是字节码索引`（bytecode index，bci）`，用以定位字节码。

其中，`from` 指针和 `to` 指针标示了该异常处理器所监控的范围，例如 `try` 代码块所覆盖的
范围。`target` 指针则指向异常处理器的起始位置，例如 `catch` 代码块的起始位置。

当程序触发异常时，`Java 虚拟机`会从上至下遍历异常表中的所有条目。当触发异常的字节
码的索引值在某个异常表条目的监控范围内，`Java 虚拟机`会判断所抛出的异常和该条目想
要捕获的异常是否匹配。如果匹配，`Java 虚拟机`会将控制流转移至该条目 `target `指针指向
的字节码。

如果遍历完所有异常表条目，`Java 虚拟机`仍未匹配到异常处理器，那么它会弹出当前方法
对应的 `Java 栈帧`，并且在调用者`（caller）`中重复上述操作。在最坏情况下，`Java 虚拟机`
需要遍历当前线程` Java 栈`上所有方法的异常表。


[从实际案例聊聊Java应用的GC优化](https://tech.meituan.com/2017/12/29/jvm-optimize.html)
## GC类型
* Full GC （Major GC）：发生于老年代，耗时较长，发生频率低。
* Minor GC ： 发生于年轻代，耗时较短、发生频率高。

## GC原理
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210710104637279.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

> GC大致过程

新生区是类的诞生、成长、消亡的区域，一个类在这产生，应用，最后被垃圾回收器收集，结束生命。

新生区又分为两个部分：伊甸区`Eden`和幸存者区`Survivor`，所有的类都是在伊甸区被`new`出来的。幸存者区有两个：`from`区和`to`区。当伊甸园区的空间用完时，程序又需要创建对象，`JVM`的垃圾回收器将对伊甸园区进行垃圾回收`(Minor GC)`，将伊甸园区中的不在被其他对象所引用的对象进行销毁，然后将伊甸园区中的剩余对象移动到`from`区，若`from`区也满了，再对该区进行垃圾回收，然后移动到`to`区，

如果`to`区也满了，再移动到养老区，若养老区也满了，这时将产生`Major GC(Full GC)`，进行养老区的内存清理，若养老区执行了清理之后依然无法进行对象的保存，就会报`OOM`异常。

> Minor GC 过程

 1. `Eden`、`Survivor From`复制到`Survivor To`，年龄+1
首次，当`Eden`区满的时候会触发第一次`GC`，把还活着的对象拷贝到`Survivor From`区，当`Eden`区再次触发`GC`的时候会扫描`Eden`区和`From`区域，对这两个区域进行垃圾回收，经过这次回收后还存活的对象，则直接复制到`To`区域（如果有对象的年龄已经达到了老年的标准，则赋值到老年代区），同时把这些对象的年龄+1。

 2. 清空`Eden`、`Survivor From `
然后清空`Eden`、`Survivor From`中的对象

 3. 复制之后又交换，谁空谁是`To`
 最后，`Survivor From`和`Survivor To`互换，原`Survivor` 成为下一次`GC`时的`Survivor From`区。部分对象会在`From`区和`To`区域中复制来复制去，如此交换默认15次（由`JVM`参数`MaxTenuringThreshold`控制，默认等于15），如果最终还是存活，就存入到老年代。

 ⽆论是`Minor GC`还是`Full GC`，都会产⽣停顿现象，即`Stop-the-World`。`Minor GC`停顿时间较短，⽽`Full GC`因耗时较⻓将导致⻓时间停顿、系统⽆响应，极⼤地影响系统性能。因此，对`Full GC`⽇志的监控及分析在性能优化中极为重要。

## GC控制参数
* -Xms设置堆的最小空间大小。

* -Xmx设置堆的最大空间大小。

* -XX:NewSize设置新生代最小空间大小。

* -XX:MaxNewSize设置新生代最大空间大小。

* -XX:PermSize设置永久代最小空间大小。

* -XX:MaxPermSize设置永久代最大空间大小。

* -Xss设置每个线程的堆栈大小。

*  -XX:NewRatio设置老年代的占比,剩下的1给新生代

* -XX:SurvivorRatio设置`Eden`区与每一个`Survivor`区的比值

* -XX:MaxTenuringThreshold 来设定年轻代对象移动到老年代年龄，默认年龄是 15 岁。


没有直接设置老年代的参数，但是可以设置堆空间大小和新生代空间大小两个参数来间接控制。

老年代空间大小=堆空间大小-年轻代大空间大小


## GC日志
* 开启GC

在`JVM`中设置参数`-verbose:gc`或`-XX:+PrintGC`，默认`GC`日志是关闭的。

* 其他参数

`-XX:+PrintGCDetails` 创建更详细的`GC`⽇志，默认关闭；

`-XX:+PrintGCTimeStamps`或`-XX:+PrintGCDateStamps` 可⽤于分析GC之间的时间间隔，默认关闭，建议开启；

`-Xloggc:filename` 指定将`GC`⽇志输出到具体⽂件，默认为标准输出；

-`XX:NumberOfGCLogfiles`及`-XX:UseGCLogfileRotation` 控制⽇志⽂件循环，默认是0，即不作任何限制。
## GC数据
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210710164605622.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210710164716799.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
通过`jstat -gc 23995 1000`可以实时查看`GC`情况，23995是进程号，1000是刷新频率-即1秒。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210710164826683.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
参数说明
* S0C：年轻代中第⼀个survivor（幸存区）的容量 (字节)
* S1C：年轻代中第⼆个survivor（幸存区）的容量 (字节)
* S0U：年轻代中第⼀个survivor（幸存区）⽬前已使⽤空间 (字节)
* S1U：年轻代中第⼆个survivor（幸存区）⽬前已使⽤空间 (字节)
* EC：年轻代中Eden（伊甸园）的容量 (字节)
* EU：年轻代中Eden（伊甸园）⽬前已使⽤空间 (字节)
* OC：Old代的容量 (字节)
* OU：Old代⽬前已使⽤空间 (字节)
* PC：Perm(持久代)的容量 (字节)
* PU：Perm(持久代)⽬前已使⽤空间 (字节)
* YGC：从应⽤程序启动到采样时年轻代中gc次数
* YGCT：从应⽤程序启动到采样时年轻代中gc所⽤时间(s)
* FGC：从应⽤程序启动到采样时old代(全gc)gc次数
* FGCT：从应⽤程序启动到采样时old代(全gc)gc所⽤时间(s)
* GCT：从应⽤程序启动到采样时gc⽤的总时间(s)

>http://gceasy.io是⼀个在线分析GC⽇志⼯具，国内访问速度和分析速度都较快，分析结果较为详细。分免费版、商业版等。

## 性能分析和可监控的各种可视工具

[给，你们想要的排查问题的可视化工具](https://segmentfault.com/a/1190000038225249)

[Jvm 系列(七):Jvm 调优-工具篇](http://www.ityouknow.com/jvm/2017/09/22/jvm-tool.html)


## 判断对象存亡
>引用计数法

* 为每一个对象添加一个引用计数器，用来统计指向该对象的引用个数。一旦某个对象的引用计数器为0，则说明该对象已经死亡，便可以回收了。
* 具体实现：如果有一个引用，被赋值为某一对象，那么将该对象的引用计数+1。如果一个指向某一对象的引用，被赋值为其他值，那么将该对象的引用计数器-1。也就是说，我们需要截获所有的引用更新操作，并相应地增减目标对象的引用计数器。
* 缺点：无法处理循环引用对象。比如对象a与b相互引用，除此之外没有其他引用指向a或者b。在这种情况下，a和b实际上已经死了，但由于他们的引用计数器皆不为0，在引用计数法中，这两个对象还活着。因此，这些循环对象所占据的空间将不可回收，从而造成了内存泄漏。


>可达性分析算法

* 将一系列`GC Roots`作为初始的存活对象集合，然后从该集合出发，探索所有能够被该集合引用到的对象，并将其加入到该集合中，这个过程也称之为标记。最终，没有被探索到的对象便是死亡的，是可以回收的。
* `GC Roots`:可理解为由堆外指向堆内的引用，一般而言，`GC Roots`包括（但不限于）以下几种

1、`Java`方法栈帧中的局部变量
2、已加载类的静态变量
3、JNI handles
4、已启动且未停止的`Java`线程

* 可达性分析可以解决引用计数法所不能解决的循环问题。即时对象a和b相互引用，只要`GC Roots`出发无法到达a和b，那么可达性分析便不会将它们加入存活对象合集中。
* 缺点：在多线程环境下，其他线程可能会更新已经访问过的对象中的引用，从而造成误报（将引用设置为null）或者漏报（将引用设置为未被访问过的对象）。    

## 垃圾回收算法
[Jvm垃圾回收器（算法篇）](https://www.cnblogs.com/chenpt/p/9799095.html)

## 垃圾回收器
[Jvm垃圾回收器（终结篇）](https://www.cnblogs.com/chenpt/p/9803298.html)

## JVM调优
[JVM调优的正确姿势](https://www.liaoxuefeng.com/article/1336345083510818)
