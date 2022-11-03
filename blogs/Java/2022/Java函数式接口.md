---
title: Java 函数式接口
date: 2022-11-01
categories:
 - Java
---

# 函数式接口
有且只有一个抽象方法的接口被称为函数式接口。

# @FunctionalInterface注解 
`Java 8` 为函数式接口引入一个注解 `@FunctionalInterface` 。该注解用于一个**接口**的定义上，一旦使用该注解来定义接口，编译器将会强制检查改接口是否确实**有且仅有一个抽象方法**，否则将会报错。该注解**不是必须**的，只要符合函数式接口的定义，那改接口就是函数式接口。
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface FunctionalInterface {}
```
# 函数式接口格式
```java
修饰符 interface 接口名称{
    //public abstract 可以不写 编译器自动加上
    public abstract 返回值 方法名称(参数列表)
    // 其他方式 
}
```

# 常用函数式接口

## Function<T,R>: 函数型接口
 `R apply(T t)`，传入一个参数，返回想要的结果。

```java
  Function<Integer, String> f1 = f -> String.valueOf(f * 3);
  Function<String, Integer> f2 = f -> Integer.valueOf(f) * 3;

  System.out.println(f1.apply(2));//6
  System.out.println(f2.apply("2"));//6
```
`compose(Function<? super V, ? extends T> before)`，先执行`compose`方法参数`before`中的`apply`方法，然后将执行结果传递给调用`compose`函数中的`apply`方法在执行。

```java
  Function<Integer, String> f1 = f -> String.valueOf(f * 3);
  Function<String, Integer> f2 = f -> Integer.valueOf(f) * 3;

  System.out.println(f1.compose(f2).apply("2"));//18
  System.out.println(f2.compose(f1).apply(2));//18
```
`andThen(Function<? super R, ? extends V> after)`，先执行调用`andThen`函数的`apply`方法，然后在将执行结果传递给`andThen`方法`after`参数中的`apply`方法在执行。它和`compose`方法整好是相反的执行顺序。

```java
  Function<Integer, String> f1 = f -> String.valueOf(f * 3);
  Function<String, Integer> f2 = f -> Integer.valueOf(f) * 3;

  System.out.println(f1.andThen(f2).apply(2));
  System.out.println(f2.andThen(f1).apply("2"));
```

```java
  Function<Integer, Integer> f1 = f -> f + 1;
  Function<Integer, Integer> f2 = f -> f * 3;

  System.out.println(f1.compose(f2).apply(2));//7 -> f2.apply -> f1.apply -> 2*3 -> 6+1
  System.out.println(f2.compose(f1).apply(2));//9 -> f1.apply -> f2.apply -> 2+1 -> 3*3

  System.out.println(f1.andThen(f2).apply(2));//9 -> f1.apply -> f2.apply -> 2+1 -> 3*3
  System.out.println(f2.andThen(f1).apply(2));//7 -> f2.apply -> f1.apply -> 2*3 -> 6+1
```
## Consumer<T>：消费型接口
 `void accept(T t)`，接收一个参数进行消费，但无需返回结果。
```bash
 Consumer<String> c1 = s -> {
    String[] split = s.split(",");
    System.out.println("key:" + split[0] + ",value=" + split[1]);
 };
 c1.accept("k,v");//key:k,value=v
```
`andThen(Consumer<? super T> after)`，先消费然后在消费，先执行调用`andThen`接口的`accept`方法，然后在执行`andThen`方法参数`after`中的`accept`方法。
```bash
  Consumer<String> c1 = s -> {
      System.out.println("c1");
  };

  Consumer<String> c2 = s -> {
      System.out.println("c2");
  };

  c1.andThen(c2).accept("1");// c1 -> c2
  c2.andThen(c1).accept("1");// c2 -> c1
```
## Supplier<T>: 供给型接口
`T get()`，无参数，有返回值。

```java
 Supplier<String> s = () -> "Hello World";

 System.out.println(s.get());//Hello World
```
## Predicate<T> ： 断言型接口
 `boolean test(T t)`,传入一个参数，返回一个布尔值。
 
```java
 Predicate<Integer> p1 = p -> p > 0;

 System.out.println(p1.test(1));//true
```
`and(Predicate<? super T> other)`，相当于逻辑运算符中的`&&`，当两个Predicate函数的返回结果都为`true`时才返回`true`。

```java
 Predicate<Integer> p1 = p -> p > 0;
 Predicate<Integer> p2 = p -> p > 1;

 System.out.println(p1.and(p2).test(1));//false
 System.out.println(p1.and(p2).test(2));//true
```
`or(Predicate<? super T> other)` ,相当于逻辑运算符中的||，当两个`Predicate`函数的返回结果有一个为`true`则返回`true`，否则返回`false`。

```java
 Predicate<Integer> p1 = p -> p > 0;
 Predicate<Integer> p2 = p -> p > 1;

 System.out.println(p1.or(p2).test(1));//true
 System.out.println(p1.or(p2).test(2));//true
```
`negate()` 方法的意思就是取反

```java
 Predicate<Integer> p1 = p -> p > 0;
 Predicate<Integer> p2 = p -> p > 1;

 System.out.println(p1.negate().test(1));//false
 System.out.println(p2.negate().test(2));//false
```
# Bi类型接口
`BiConsumer`、`BiFunction`、`BiPrediate` 是 `Consumer`、`Function`、`Predicate` 的扩展，可以传入多个参数，没有 `BiSupplier` 是因为 `Supplier` 没有入参。![在这里插入图片描述](https://img-blog.csdnimg.cn/29d43333677a415389479d4918e1febd.png)

