---
title: Stream的distinct()方法
date: 2021-01-26
categories:
 - Java
tags:
 - Stream
---

**源码**
```java
/**
     * Returns a stream consisting of the distinct elements (according to
     * {@link Object#equals(Object)}) of this stream.
     *
     * <p>For ordered streams, the selection of distinct elements is stable
     * (for duplicated elements, the element appearing first in the encounter
     * order is preserved.)  For unordered streams, no stability guarantees
     * are made.
     *
     * <p>This is a <a href="package-summary.html#StreamOps">stateful
     * intermediate operation</a>.
     *
     * @apiNote
     * Preserving stability for {@code distinct()} in parallel pipelines is
     * relatively expensive (requires that the operation act as a full barrier,
     * with substantial buffering overhead), and stability is often not needed.
     * Using an unordered stream source (such as {@link #generate(Supplier)})
     * or removing the ordering constraint with {@link #unordered()} may result
     * in significantly more efficient execution for {@code distinct()} in parallel
     * pipelines, if the semantics of your situation permit.  If consistency
     * with encounter order is required, and you are experiencing poor performance
     * or memory utilization with {@code distinct()} in parallel pipelines,
     * switching to sequential execution with {@link #sequential()} may improve
     * performance.
     *
     * @return the new stream
     */
    Stream<T> distinct();
```

`distinct()`是`Java 8`中`Stream`提供的方法，返回的是由该流中不同元素组成的流。对于有序流，对不同元素的选择是稳定的；对于重复元素，将保留在遇到顺序中排在最前面的元素。对于无序流，则不保证稳定性。

通过API注释第一句：

```text
Returns a stream consisting of the distinct elements (according to * {@link Object#equals(Object)}) of this stream.
```
可以得知，distinct()在去重时，是根据对象的equals()方法去处理，如果我们对象类没有覆盖超类Object的equals()方法，就会使用Object的。但是Object的equals()方法只有在两个对象完全相同时才返回true。而我们想要的效果是只要对象的某个属性相同，就认为两个对象是同一个。
所以可以重写equals()方法来达到某些特殊需求的去重。(重写了一个类的equals()方法，那么就必须一起重写它的hashCode()方法)


## 对于String集合的去重
```java
public void test() {
    List<String> strList = new ArrayList<>();
    strList.add("A");
    strList.add("A");
    strList.add("B");
    strList.add("B");
    strList.add("C");
    System.out.print("去重前：");                        

    strList.forEach(str -> System.out.print(str));//去重前：AABBC  

    strList = strList.stream().distinct().collect(Collectors.toList());

    System.out.println("");
    System.out.print("去重后：");

    strList.forEach(str -> System.out.print(str));//去重后：ABC
}
```

## 对于对象集合的去重

>使用了 Lombok 插件的@Data注解，可自动覆写 equals() 以及 hashCode() 方法。
```java
@Data
@AllArgsConstructor
public class Person  {
    private String name;
    private int age;
}
```
```java
@Test
public void test() {
    List<Person> personList =new ArrayList<>();
    personList.add(new Person("zhangsan",18));
    personList.add(new Person("zhangsan",18));
    personList.add(new Person("lisi",18));

    System.out.print("去重前：");
    personList.forEach(person -> System.out.print(person));//去重前：Person(name=zhangsan, age=18)Person(name=zhangsan, age=18)Person(name=lisi, age=18)

    personList = personList.stream().distinct().collect(Collectors.toList());

    System.out.println("");
    System.out.print("去重后：");
    personList.forEach(person -> System.out.print(person));//去重后：Person(name=zhangsan, age=18)Person(name=lisi, age=18)
}
```

## 对于对象集合中对象某个属性的去重
> 引用Collectors两个静态方法collectingAndThen()和toCollection(),以及TreeSet<>来去重
```java
@Test
public void test()  {
    List<Person> personList = new ArrayList<>();
    personList.add(new Person("zhangsan", 18));
    personList.add(new Person("zhangsan", 19));
    personList.add(new Person("lisi", 18));

    System.out.print("去重前：");
    personList.forEach(person -> System.out.print(person));//去重前：Person(name=zhangsan, age=18)Person(name=zhangsan, age=19)Person(name=lisi, age=18)


    personList = personList.stream().distinct().collect(Collectors.toList());

    System.out.println("");
    System.out.print("distinct去重后：");
    personList.forEach(person -> System.out.print(person));//distinct去重后：Person(name=zhangsan, age=18)Person(name=zhangsan, age=19)Person(name=lisi, age=18)

    personList = personList.stream().collect(
            Collectors.collectingAndThen(
                    Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(Person::getName))), ArrayList::new
            ));

    System.out.println("");
    System.out.print("去重后：");
    personList.forEach(person -> System.out.print(person));//去重后：Person(name=lisi, age=18)Person(name=zhangsan, age=18)
}
```

>重写equals()和hashCode()去重
```java
@Data
@AllArgsConstructor
public class Person {
    private String name;
    private int age;

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Person))
            return false;
        Person person = (Person) obj;
        return this.name.equals(person.name);
    }

   //只有当hashCode()返回的hashCode相同的时候，才会调用equals()进行更进一步的判断。如果连hashCode()返回的hashCode都不同，那么可以认为这两个对象一定就是不同的了
    @Override
    public int hashCode() {
        int n = 31;
        n = n * 31 + this.name.hashCode();
        return n;
    }
}
```

```java
@Test
public void test()  {
    List<Person> personList = new ArrayList<>();
    personList.add(new Person("zhangsan", 18));
    personList.add(new Person("zhangsan", 19));
    personList.add(new Person("lisi", 18));

    System.out.print("去重前：");
    personList.forEach(person -> System.out.print(person));//去重前：Person(name=zhangsan, age=18)Person(name=zhangsan, age=19)Person(name=lisi, age=18)


    personList = personList.stream().distinct().collect(Collectors.toList());

    System.out.println("");
    System.out.print("重写equals()和hashCode()后使用distinct去重后：");
    personList.forEach(person -> System.out.print(person));//重写equals()和hashCode()后使用distinct去重后：Person(name=zhangsan, age=18)Person(name=lisi, age=18)
}
```

>巧用“filter() + 自定义函数”取代distinct()
```java
private static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
    Map<Object, Boolean> map = new ConcurrentHashMap<>();
    return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
}
```
* 输入元素的类型是T及其父类，keyExtracctor是映射函数，返回Object，整个传入的函数的功能应该是提取key的。distinctByKey函数返回的是Predicate函数，类型为T
* 传入一个函数，将传入对象key放入ConcurrentHashMap，数据不重复，返回true，不重复的数据通过filter。
```java
@Test
public void test()  {
    List<Person> personList = new ArrayList<>();
    personList.add(new Person("zhangsan", 18));
    personList.add(new Person("zhangsan", 19));
    personList.add(new Person("lisi", 18));

    System.out.print("去重前：");
    personList.forEach(person -> System.out.print(person));//去重前：Person(name=zhangsan, age=18)Person(name=zhangsan, age=19)Person(name=lisi, age=18)

    personList = personList.stream().filter(distinctByKey(Person::getName)).collect(Collectors.toList());

    System.out.println("");
    System.out.print("巧用“filter() + 自定义函数”取代distinct()去重后：");
    personList.forEach(person -> System.out.print(person));//巧用“filter() + 自定义函数”取代distinct()去重后：Person(name=zhangsan, age=18)Person(name=lisi, age=18)
}
```