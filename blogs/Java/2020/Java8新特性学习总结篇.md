---
title: Java8新特性
date: 2020-12-25
categories:
 - Java
tags:
 - Java8
---

## Java8新特性

## Lambda 表达式

> Lambda 是一个**匿名函数**，我们可以把 Lambda 表达式理解为是一段**可以传递的代码**（将代码像数据一样进行传递，它没有名称，但它有参数列表，函数主体，返回类型，可能还有一个可以抛出的异常列表。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使Java的语言表达能力得到了提升。


### 从匿名类到Lambda表达式的转换

```java
 //匿名内部类
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("Hello World");
            }
        };
```

```java
 /**
  *  “->” 操作符或剪头操作符，将Lambda分为两个部分
  *  左侧：指定了 Lambda 表达式需要的所有参数
  *  右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能。
  */
//Lambda表达式
Runnable runnable1 = () -> {
    System.out.println("Hello World");
l     
};
```

```java
//原来使用匿名内部类作为参数传递
TreeSet<String> stringTreeSet = new TreeSet<>(new Comparator<String>() {
    @Override
    public int compare(String s1, String s2) {
        return Integer.compare(s1.length(), s2.length());
    }
});
```

```java
/**
 *  “->” 操作符或剪头操作符，将Lambda分为两个部分
 *  左侧：指定了 Lambda 表达式需要的所有参数
 *  右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能。
 */

//Lambda作为参数传递
TreeSet<String> stringTreeSet1 = new TreeSet<>((s1, s2) ->
        Integer.compare(s1.length(), s2.length())
);
```

### 语法格式一：无参，无返回值，Lambda体只需要一条语句

```Java
Runnable r1 = () -> {
    System.out.println("Hello World");
};
```

### 语法格式二：Lambda需要一个参数

```Java

Consumer<Integer> square = (x) -> System.out.println("print square : " + x * x);
//Consumer 消费者 只对入参做一些列的操作，没有返回值
square.accept(10);
```

### 语法格式三：Lambda只需要一个参数时，参数的小括号可以省略

```Java
Consumer<Integer> square1 = (x) -> System.out.println("print square : " + x * x);
```

### 语法格式四：Lambda需要两个参数，并且有返回值

```java
BinaryOperator<Long> bo = (Long x, Long y) -> {
    System.out.println("实现函数接口方法");
    return x + y;
};
// BinaryOperator 用于执行lambda表达式并返回一个T类型的返回值
System.out.println(bo.apply(6L, 6L));//实现函数接口方法 12
```

### 语法格式五：Lambda体只有一条语句，return和大括号后可以省略

```java
BinaryOperator<Long> bo1 = (Long x, Long y) -> x + y;
System.out.println(bo1.apply(6L, 6L));//12
```

### 语法格式六：类型推断 类型可省略

```java
BinaryOperator<Long> bo2 = (x, y) -> x + y;
System.out.println(bo1.apply(6L, 6L));//12
```

> Lambda 表达式中的参数类型都是由编译器推断得出的。Lambda 表达式中无需指定类型，程序依然可以编译，这是因为 javac 根据程序的上下文，在后台推断出了参数的类型。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的。这就是所谓的“类型推断”。



## 函数式接口

1、只包含一个抽象方法的接口，称为**函数式接口**。 

2、你可以通过 Lambda 表达式来创建该接口的对象。（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。

3、 我们可以在任意函数式接口上使用 @FunctionalInterface 注解，这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。

### 自定义函数式接口

```java
@FunctionalInterface
public interface MyFunctionalInterface&lt;T&gt; {
    T getValue(T t);
}
```

### 函数式接口中使用泛型

```java
public String MyToUpperString(MyFunctionalInterface<String> mf, String str) {
    return mf.getValue(str);
}
```

### 作为参数传递Lambda表达式

```java
@Test
public void test1() {
    //作为参数传递Lambda表达式
    String s = MyToUpperString((str) -> str.toUpperCase(), "abcdefg");
    System.out.println(s);//ABCDEFG
}
```

<font color="red">作为参数传递 Lambda 表达式：为了将 Lambda 表达式作为参数传递，接收Lambda 表达式的参数类型必须是与该 Lambda 表达式兼容的函数式接口的类型</font>

### Java 内置四大核心函数式接口  

```java

public class JavaFunctionalInterfaceTest {


    /**
     * 函数式接口：Consumer&lt;T&gt; 消费型接口
     * 参数类型： T
     * 返回类型：void
     * 作用：对类型为T的对象应用操作
     * 包含方法：void accept(T t)
     */
    @Test
    public void testConsumer() {
        Consumer<Double> money = (x) -> {
            System.out.println("一共消费" + (x * 0.8) + "元");
        };

        money.accept(10000d);//一共消费8000.0元
    }

    /**
     * 函数式接口：Supplier&lt;T&gt; 供给型接口
     * 参数类型： 无
     * 返回类型：T
     * 作用：返回类型为T的对象
     * 包含方法：T get()
     */
    @Test
    public void testSupplier() {
        Supplier supplier = () -> (int) (Math.random() * 100);

        System.out.println(supplier.get());//24
    }


    /**
     * 函数式接口：Function<T, R> 函数型接口
     * 参数类型： T
     * 返回类型：R
     * 作用：对类型为T的对象应用操作，并返回结果。结果是R类型的对象
     * 包含方法：R apply(T t)
     */
    @Test
    public void testFunction() {
        Function function = (x) -> {
            int i = (int) (Math.random() * 100);
            return i;
        };
    }

    /**
     * 函数式接口：Predicate&lt;T&gt; 断定型接口
     * 参数类型： T
     * 返回类型：boolean
     * 作用：确定类型为T的对象是否满足某约束，并返回boolean值。
     * 包含方法：boolean test(T t)
     */
    @Test
    public void testPredicate() {

        Predicate<String> predicate = (x) -> {
            return x.equals("DAIAHO");
        };
        boolean b = predicate.test("DAIAHO");
        System.out.println(b);//true

    }
}
```



## 方法引用与构造器引用

### 方法引用

当要传递给Lambda体的操作，已经有实现的方法了，可以使用方法引用！（ 实现抽象方法的参数列表，必须与方法引用方法的参数列表保持一致！ ）方法引用：使用操作符<font color="red">::</font>将方法名和对象或类的名字分隔开来。

如下三种主要使用情况：

1. 对象::实例方法

2. 类::静态方法

3. 类::实例方法  

举例：学生类

```Java
   class Student {
       private Integer id;
       private String name;
   
       Student(Integer id, String name) {
           this.id = id;
           this.name = name;
       }
       public Student(Integer id) {
           this.id = id;
       }
   
       public Integer getId() {
           return id;
       }
   
       public String getName() {
           return name;
       }
   }
```

```java
//利用供给型接口获取student信息
@Test
public void testSupplier() {
    Student student = new Student(1, "DAIHAO");
    Supplier<String> s1 = () -> student.getName();
    System.out.println(s1.get());//DAIHAO
    //get()方法和getName()方法参数列表和返回值类型相同（符合方法引用的条件）
    //student.getName()是get方法的实现体
    //() -> student.getName()是要获得“DAIHAO”，要实现这个Lambda表达式逻辑
    // 就需要调用get()方法，而get()方法中的getName()实现的逻辑也还是获取“DAIHAO‘
    //所以说”当要彻底给Lambda体的操作，已经有了实现方法，可以使用方法引用“

    //对象名:实例方法（非静态方法）
    Supplier<String> s2 = student::getName;
    System.out.println(s2.get());
}
```

```java
@Test
public void testComparator() {
    Comparator<Integer> c1 = (x, y) -> Integer.compare(x, y);
    System.out.println(c1.compare(1, 2));//-1

    //类名：静态方法
    Comparator<Integer> c2 = Integer::compare;
    System.out.println(c2.compare(1, 2));//-1

}
```

```java
@Test
public void testBiPredicate() {
    //BiPredicate 输入两个参数判断
    BiPredicate<String, String> b1 = (x, y) -> x.equals(y);
    System.out.println(b1.test("A", "a"));//false

    //类名:实例方法（非静态方法）
    //需满足方法的第一个参数（x）是被调用方法（equals）的调用者
    //方法的第二个参数（y）是被调用方法的参数
    BiPredicate<String , String > b2 = String::equals;
    System.out.println(b2.test("A", "a"));//false
}
```

### 构造器引用

格式： Student::new
与函数式接口相结合，自动与函数式接口中方法兼容。
可以把构造器引用赋值给定义的方法，与构造器参数
列表要与接口中抽象方法的参数列表一致  

```java
@Test
public void testFunction() {
    Function<Integer, Student> f1 = (id) -> new Student(id);
    Student s1 = f1.apply(1);
    System.out.println(s1.getId());//1

    //构造器引用
    Function<Integer, Student> f2 = Student::new;
    Student s2 = f2.apply(1);
    System.out.println(s2.getId());//1
}
```

### 数组引用

```java
@Test
public void testType() {
    Function<Integer, Integer[]> f1 = (n) -> new Integer[n];
    Integer[] a1 = f1.apply(3);
    System.out.println(a1.length);//3

    //数组引用
    Function<Integer, Integer[]> f2 = Integer[]::new;
    Integer[] a2 = f2.apply(3);
    System.out.println(a2.length);//3
}
```

## Stream API

### Stream介绍

Java8中有两大最为重要的改变。第一个是 Lambda 表达式；另外一个则是 Stream API(java.util.stream.*)。
Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。
使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式

### 流 

流是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。“集合讲的是数据，流讲的是计算！ ”
注意：
①Stream 自己不会存储元素。
②Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream。
③Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行  

### Stream操作过程

1、创建 Stream
一个数据源（如： 集合、数组）， 获取一个流
2、中间操作
一个中间操作链，对数据源的数据进行处理
3、终止操作(终端操作)
一个终止操作，执行中间操作链，并产生结果  

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-0aKaHCGT-1586795122189)(C:\Users\daiha\Desktop\Java8 新特性.jpg)\]](https://img-blog.csdnimg.cn/20200518114929407.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

### 创建Stream

Java8 中的 Collection 接口被扩展，提供了
两个获取流的方法：

```java
default Stream<E> stream() : 返回一个顺序流
```

```java
default Stream<E> parallelStream() : 返回一个并行流  
```

> 顺序流-串行流：一条线程按顺序依次处理
>
> 并行流:就是把一个内容分成多个数据块，并用不同的线程分 别处理每个数据块的流

#### 由数组创建流

Java8 中的 Arrays 的静态方法 stream() 可
以获取数组流： 

```java
static &lt;T&gt; Stream&lt;T&gt; stream(T[] array): 返回一个流
```

重载形式，能够处理对应基本类型的数组：

```java
public static IntStream stream(int[] array)
public static LongStream stream(long[] array)
public static DoubleStream stream(double[] array)  
```

#### 由值创建流

可以使用静态方法 Stream.of(), 通过显示值
创建一个流。它可以接收任意数量的参数。

```java
public static&lt;T&gt; Stream&lt;T&gt; of(T... values) : 返回一个流  
```

#### 由函数创建流：创建无限流

可以使用静态方法 Stream.iterate() 和
Stream.generate(), 创建无限流。
**迭代**

```java
public static&lt;T&gt; Stream&lt;T&gt; iterate(final T seed, final
UnaryOperator&lt;T&gt; f)
```

**生成**

```java
public static&lt;T&gt; Stream&lt;T&gt; generate(Supplier&lt;T&gt; s) 
```

### Stream 的中间操作

多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！而在终止操作时一次性全部处理，称为“惰性求值”   

#### 筛选与切片

|        方 法        |                            描 述                             |
| :-----------------: | :----------------------------------------------------------: |
| filter(Predicate p) |              接收 Lambda ， 从流中排除某些元素               |
|     distinct()      | 筛选，通过流所生成元素的 hashCode() 和 equals() 去&lt;br/&gt;除重复元素 |
| limit(long maxSize) |                截断流，使其元素不超过给定数量                |
|    skip(long n)     | 跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素&lt;br/&gt;不足 n 个，则返回一个空流。与 limit(n) 互补 |

#### 映射 

|              方 法              |                            描 述                             |
| :-----------------------------: | :----------------------------------------------------------: |
|         map(Function f)         | 接收一个函数作为参数，该函数会被应用到每个元 素上，并将其映射成一个新的元素 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 DoubleStream |
|    mapToInt(ToIntFunction f)    | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 IntStream |
|   mapToLong(ToLongFunction f)   | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 LongStream |
|       flatMap(Function f)       | 接收一个函数作为参数，将流中的每个值都换成另 一个流，然后把所有流连接成一个流 |

#### 排序

|          方 法          |               描 述                |
| :---------------------: | :--------------------------------: |
|        sorted()         |  产生一个新流，其中按自然顺序排序  |
| sorted(Comparator comp) | 产生一个新流，其中按比较器顺序排序 |

### Stream 的终止操作

终端操作会从流的流水线生成结果。其结果可以是任何不是流的值，例如： List、 Integer，甚至是 void 

#### 查找与匹配

|         方 法          |                            描 述                             |
| :--------------------: | :----------------------------------------------------------: |
| allMatch(Predicate p)  |                     检查是否匹配所有元素                     |
| anyMatch(Predicate p)  |                   检查是否至少匹配一个元素                   |
| noneMatch(Predicate p) |                   检查是否没有匹配所有元素                   |
|      findFirst()       |                        返回第一个元素                        |
|       findAny()        |                    返回当前流中的任意元素                    |
|        count()         |                       返回流中元素总数                       |
|   max(Comparator c)    |                        返回流中最大值                        |
|   min(Comparator c)    |                        返回流中最小值                        |
|  forEach(Consumer c)   | 内部迭代(使用 Collection 接口需要用户去做迭 代，称为外部迭代。相反， Stream API 使用内部 迭代——它帮你把迭代做了) |

#### 归约

|               方法               |                             描述                             |
| :------------------------------: | :----------------------------------------------------------: |
| reduce(T iden, BinaryOperator b) |       可以将流中元素反复结合起来，得到一个值。 返回 T        |
|     reduce(BinaryOperator b)     | 可以将流中元素反复结合起来，得到一个值。 返回 Optional&lt;T&gt; |

备注： map 和 reduce 的连接通常称为 map-reduce 模式，因 Google 用它
来进行网络搜索而出名。

> 备注： map 和 reduce 的连接通常称为 map-reduce 模式，因 Google 用它
> 来进行网络搜索而出名  

#### 收集

|        方 法         |                            描 述                             |
| :------------------: | :----------------------------------------------------------: |
| collect(Collector c) | 将流转换为其他形式。接收一个 Collector接口的 实现，用于给Stream中元素做汇总的方法 |

Collector 接口中方法的实现决定了如何对流执行收集操作(如收集到 List、 Set、 Map)。但是 Collectors 实用类提供了很多静态方法，可以方便地创建常见收集器实例， 具体方法与实例如下表  

|       方法        |       返回类型        |                             作用                             |                             使用                             |
| :---------------: | :-------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|      toList       |        List&lt;T&gt;        |                     把流中元素收集到List                     | List&lt;Employee&gt; emps= list.stream().collect(Collectors.toList()); |
|       toSet       |        Set&lt;T&gt;         |                     把流中元素收集到Set                      | Set&lt;Employee&gt; emps= list.stream().collect(Collectors.toSet()); |
|   toCollection    |     Collection&lt;T&gt;     |                  把流中元素收集到创建的集合                  | Collection &lt;Employee&gt; emps=list.stream().collect(Collectors.toCollection(ArrayList::new)); |
|     counting      |         Long          |                      计算流中元素的个数                      |  long count = list.stream().collect(Collectors.counting());  |
|    summingInt     |        Integer        |                   对流中元素的整数属性求和                   | inttotal=list.stream().collect(Collectors.summingInt(Employee::getSalary)); |
|   averagingInt    |        Double         |               计算流中元素Integer属性的平均 值               | doubleavg= list.stream().collect(Collectors.averagingInt(Employee::getSalary)); |
|  summarizingInt   | IntSummaryStatistics  |           收集流中Integer属性的统计值。 如：平均值           | IntSummaryStatisticsiss= list.stream().collect(Collectors.summarizingInt(Employee::getSalary)); |
|      joining      |        String         |                      连接流中每个字符串                      | String str= list.stream().map(Employee::getName).collect(Collectors.joining()); |
|       maxBy       |      Optional&lt;T&gt;      |                     根据比较器选择最大值                     | Optional&lt;Emp&gt;max= list.stream().collect(Collectors.maxBy(comparingInt(Employee::getSalary))); |
|       minBy       |      Optional&lt;T&gt;      |                     根据比较器选择最小值                     | Optional&lt;Emp&gt; min = list.stream().collect(Collectors.minBy(comparingInt(Employee::getSalary))); |
|     reducing      |    归约产生的类型     | 从一个作为累加器的初始值 开始， 利用BinaryOperator与 流中元素逐个结合， 从而归 约成单个值 | inttotal=list.stream().collect(Collectors.reducing(0, Employee::getSalar, Integer::sum)); |
| collectingAndThen |  转换函数返回的类型   |             包裹另一个收集器， 对其结 果转换函数             | inthow= list.stream().collect(Collectors.collectingAndThen(Collectors.toList(), List::size)); |
|    groupingBy     |    Map&lt;K, List&lt;T&gt;&gt;    |          根据某属性值对流分组， 属 性为K， 结果为V           | Map&lt;Emp.Status, List&lt;Emp&gt;&gt; map= list.stream() .collect(Collectors.groupingBy(Employee::getStatus)); |
|  partitioningBy   | Map&lt;Boolean, List&lt;T&gt;&gt; |                   根据true或false进行分区                    | Map&lt;Boolean,List&lt;Emp&gt;&gt;vd= list.stream().collect(Collectors.partitioningBy(Employee::getManage)) |


## 并行流与串行流

并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。
Java 8 中将并行进行了优化，我们可以很容易的对数据进行并行操作。 Stream API 可以声明性地通过 parallel() 与sequential() 在并行流与顺序流之间进行切换  
[参考](https://www.cnblogs.com/shenlanzhizun/p/6027042.html)

## Fork/Join 框架 

在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 join 汇总  

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518115056503.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


### Fork/Join 框架与传统线程池的区别

采用 “工作窃取”模式（ work-stealing）：
当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中

相对于一般的线程池实现,fork/join框架的优势体现在对其中包含的任务的处理方式上.在一般的线程池中,如果一个线程正在执行的任务由于某些原因无法继续运行,那么该线程会处于等待状态.而在fork/join框架实现中,如果某个子问题由于等待另外一个子问题的完成而无法继续运行.那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了线程的等待时间,提高了性能  



## 接口中的默认方法与静态方法

###  默认方法

Java 8中允许接口中包含具有具体实现的方法，该方法称为“默认方法”，默认方法使用 default 关键字修饰。

**接口默认方法的” 类优先” 原则**
若一个接口中定义了一个默认方法，而另外一个父类或接口中又定义了一个同名的方法时
1、选择父类中的方法。如果一个父类提供了具体的实现，那么接口中具有相同名称和参数的默认方法会被忽略。
2、接口冲突。如果一个父接口提供一个默认方法，而另一个接也提供了一个具有相同名称和参数列表的方法（不管方法是否是默认方法）， 那么必须覆盖该方法来解决冲突  

```java
/**
 * @program: MyProject
 * @description: Java8默认方法
 * @author: DAIHAO
 * @created: 2020/04/13 23:50
 */
interface SayOne {

    default String say() {
        return "这是Java8接口中的默认方法";
    }
}

interface SayTwo  {
    default String say() {
        return "这也是一个Java8接口中的默认方法";
    }
}

public class Say implements SayOne, SayTwo {

    @Override
    public String say() {
        return SayOne.super.say();
        //return SayOne.super.say();
    }
}
```

  

```java
/**
 * @program: MyProject
 * @description: 测试Java8接口中的默认方法
 * @author: DAIHAO
 * @created: 2020/04/13 23:58
 */
public class SayTest {
    public static void main(String[] args) {
        Say say = new Say();
        System.out.println(say.say());
        //当return SayTwo.super.say();输出：这也是一个Java8接口中的默认方法
        //当return SayOne.super.say();输出：这是Java8接口中的默认方法
    }
}
```

### 静态方法

Java8 中，接口中允许添加静态方法  

```java
interface SayOne {

    default String say() {
        return "这是Java8接口中的默认方法";
    }
    static void show(){
        System.out.println("这是Java8接口中的静态方法");
    }
}
```

```java
SayOne.show();//这是Java8接口中的静态方法
```

##  新时间日期 API

### LocalDate、 LocalTime、 LocalDateTime  

LocalDate、 LocalTime、 LocalDateTime 类的实例是不可变的对象，分别表示使用 ISO-8601日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信息。也不包含与时区相关的信息  

| 方法                                               | 描述                                                         | 示例                                                         |
| -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| now()                                              | 静态方法， 根据当前时间创建对象                              | LocalDate localDate = LocalDate.now(); LocalTime localTime = LocalTime.now(); LocalDateTime localDateTime = LocalDateTime.now(); |
| of()                                               | 静态方法， 根据指定日期/时间创建 对象                        | LocalDate localDate = LocalDate.of(2016, 10, 26); LocalTime localTime = LocalTime.of(02, 22, 56); LocalDateTime localDateTime = LocalDateTime.of(2016, 10, 26, 12, 10, 55); |
| plusDays, plusWeeks, plusMonths, plusYears         | 向当前 LocalDate 对象添加几天、 几周、 几个月、 几年         |                                                              |
| minusDays, minusWeeks, minusMonths, minusYears     | 从当前 LocalDate 对象减去几天、 几周、 几个月、 几年         |                                                              |
| plus, minus                                        | 添加或减少一个 Duration 或 Period                            |                                                              |
| withDayOfMonth, withDayOfYear, withMonth, withYear | 将月份天数、 年份天数、 月份、 年 份 修 改 为 指 定 的 值 并 返 回 新 的 LocalDate 对象 |                                                              |
| getDayOfMonth                                      | 获得月份天数(1-31)                                           |                                                              |
| getDayOfYear                                       | 获得年份天数(1-366)                                          |                                                              |
| getDayOfWeek                                       | 获得星期几(返回一个 DayOfWeek 枚举值)                        |                                                              |
| getMonth                                           | 获得月份, 返回一个 Month 枚举值                              |                                                              |
| getMonthValue                                      | 获得月份(1-12)                                               |                                                              |
| getYear                                            | 获得年份                                                     |                                                              |
| until                                              | 获得两个日期之间的 Period 对象， 或者指定 ChronoUnits 的数字 |                                                              |
| isBefore, isAfter                                  | 比较两个 LocalDate                                           |                                                              |
| isLeapYear                                         | 判断是否是闰年                                               |                                                              |

### Instant 时间戳

 用于“时间戳”的运算。它是以Unix元年(传统的设定为UTC时区1970年1月1日午夜时分)开始所经历的描述进行运算  

### Duration 和 Period

1、Duration:用于计算两个“时间”间隔
2、Period:用于计算两个“日期”间隔  

### 日期的操纵

1、TemporalAdjuster : 时间校正器。有时我们可能需要获取例如：将日期调整到“下个周日”等操作。
2、TemporalAdjusters : 该类通过静态方法提供了大量的常用 TemporalAdjuster 的实现  

```java
LocalDate day = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
System.out.println(day);//2020-04-19
```

### 解析与格式化

java.time.format.DateTimeFormatter 类：该类提供了三种格式化方法：
1、预定义的标准格式
2、 语言环境相关的格式
3、自定义的格式  

### 时区的处理

Java8 中加入了对时区的支持，带时区的时间为分别为：ZonedDate、 ZonedTime、 ZonedDateTime

其中每个时区都对应着 ID，地区ID都为 “ {区域}/{城市}”的格式。例如 ： Asia/Shanghai 等
ZoneId：该类中包含了所有的时区信息
getAvailableZoneIds() : 可以获取所有时区时区信息
of(id) : 用指定的时区信息获取 ZoneId 对象  

### 与传统日期处理的转换  

| 类                                                      | To 遗留类                              | From 遗留类                 |
| ------------------------------------------------------- | -------------------------------------- | --------------------------- |
| java.time.Instant java.util.Date                        | Date.from(instant)                     | date.toInstant()            |
| java.time.Instant java.sql.Timestamp                    | Timestamp.from(instant)                | timestamp.toInstant()       |
| java.time.ZonedDateTime java.util.GregorianCalendar     | GregorianCalendar.from(zonedDateTim e) | cal.toZonedDateTime()       |
| java.time.LocalDate java.sql.Time                       | Date.valueOf(localDate)                | date.toLocalDate()          |
| java.time.LocalTime java.sql.Time                       | Date.valueOf(localDate)                | date.toLocalTime()          |
| java.time.LocalDateTime java.sql.Timestamp              | Timestamp.valueOf(localDateTime)       | timestamp.toLocalDateTime() |
| java.time.ZoneId java.util.TimeZone                     | Timezone.getTimeZone(id)               | timeZone.toZoneId()         |
| java.time.format.DateTimeFormatter java.text.DateFormat | formatter.toFormat()                   | 无                          |


## 其他新特性

### Optional 类
Optional&lt;T&gt; 类(java.util.Optional) 是一个容器类，代表一个值存在或不存在，原来用 null 表示一个值不存在，现在 Optional 可以更好的表达这个概念。并且可以避免空指针异常。

1、什么是Null类型？

在java中，我们通过引用去访问一个对象，当我们的的引用没有指向一个具体的对象时，我们就会把这个引用置为Null，用于标识该引用没有值。

虽然null值的使用非常普遍，但是我们很少会去仔细地研究它。例如一个类的成员变量会被自动初始化为null，程序员通常会给没有初始值的引用类型置null，总体上说，null值主要用于我们不知道具体的或者没有具体指向的引用类型。

在java中，null是一个具体而又特殊的数据类型，因为它没有名字，所以我们不能声明一个类型为null的变量或者将一个类型
强转为null；实际上，仅仅有一个能和null有关联的值（即文字null）。请记住，null不像java中的其他类型，一个空引用能
完全正确，安全地赋给其他的任何引用类型，而且不报任何错。

2、返回null值有什么问题？

通常来说，API的设计者会附上详细的文档，并说明在某种情况下，这个API会返回一个null值，现在问题是，因为一些原因，我们在调用API的时候可能不会去读API文档，然后就忘记了处理null值的情况，这在未来一定会是一个bug。

相信我，这是经常发生的，而且是空指针异常的主要原因之一，虽然并不是唯一的原因。因此，请牢记，在第一次调用API时看看它的文档说明

现在我们知道了在大多数情况下，null值是一个问题，那么处理null值最好的方式是什么呢？
一个比较好的解决方案是在定义引用类型时总是去将它初始化为某个值，并且不要初始化为null。采用这种方式，你的程序永远不会抛出 空指针异常 。但是有些情况下，引用并没有一个默认的初始值，那么我们又该怎么去处理呢？

上述的解决方案在很多情况下是行得通的。然而，Java 8 Optionals 无疑是最好的方案。

3、Java 8的Optionals提供了一种怎样的解决方案？

Optional提供了一种可以替代一个指向非空值但是可以为空T的方法。一个Optional类或许包含了一个指向非空变量的引用（这种情况下我们说这个引用是Present的），或者什么也没包含（这种情况下我们说这个引用是absent）。

> 请记住，永远不要说optional包含null

```javascript
Optional<Integer> canBeEmpty1 = Optional.of(5);
canBeEmpty1.isPresent();                    // returns true
canBeEmpty1.get();                          // returns 5
Optional<Integer> canBeEmpty2 = Optional.empty();
canBeEmpty2.isPresent();                    // returns false
```

我们可以看到 **Optional作为保存单变量的容器，既可以保存值，也可以不保存值**

必须要指出Optional类并不是为了简单地去替代每一个null引用。它的出现是为了帮助设计更易于理解的API，以便我们只需要读方法的声明，就能分辨是否是一个Optional变量。这迫使你去捕获Optional中的变量，然后处理它，同时也处理optional为空的情形。这才是解决因为空引用导致的 NullPointerException的正确之道


常用方法：
Optional.of(T t) : 创建一个 Optional 实例
Optional.empty() : 创建一个空的 Optional 实例
Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例
isPresent() : 判断是否包含值
orElse(T t) : 如果调用对象包含值，返回该值，否则返回t
orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值
map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回 Optional.empty()
flatMap(Function mapper):与 map 类似，要求返回值必须是Optional  

## 重复注解与类型注解

Java 8对注解处理提供了两点改进：可重复的注解及可用于类型的注解  

参考[https://www.jianshu.com/p/234f8f1c7df5]: 

还需要继续学习，加深理解！

