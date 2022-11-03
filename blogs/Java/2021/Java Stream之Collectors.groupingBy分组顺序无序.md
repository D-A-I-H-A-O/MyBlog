---
title: Java Stream之Collectors.groupingBy分组顺序无序
date: 2021-05-13
categories:
 - Java
tags:
 - 集合
 - Stream

---

`Collectors.groupingBy`是`Java steam`常用分组方法，但默认情况下分组的数据是无序的（因为默认使用的是`HashMap`），`groupingBy`有三个参数：

* 第一个参数就是`key`的`Function`了，指定分组按照什么分类

* 第二个参数是一个`map`工厂，也就是最终结果的容器，一般默认的是采用的`HashMap::new`,指定分组最后用什么容器保存返回

* 第三个参数是一个`downstream`，类型是`Collector`，也是一个收集器，指定按照第一个参数分类后，对应的分类的结果如何收集

```java
//一个参数的Collectors.groupingBy方法：
//第二个参数默认是HashMap::new， 第三个参数收集器其实默认是Collectors.toList
public static <T, K> Collector<T, ?, Map<K, List<T>>>
    groupingBy(Function<? super T, ? extends K> classifier) {
        return groupingBy(classifier, toList());
    }
```

```java
public static <T, K, A, D>
    Collector<T, ?, Map<K, D>> groupingBy(Function<? super T, ? extends K> classifier,
                                          Collector<? super T, A, D> downstream) {
        return groupingBy(classifier, HashMap::new, downstream);
    }
```

```java
 public static <T, K, D, A, M extends Map<K, D>>
    Collector<T, ?, M> groupingBy(Function<? super T, ? extends K> classifier,
                                  Supplier<M> mapFactory,
                                  Collector<? super T, A, D> downstream) {
        Supplier<A> downstreamSupplier = downstream.supplier();
        BiConsumer<A, ? super T> downstreamAccumulator = downstream.accumulator();
        BiConsumer<Map<K, A>, T> accumulator = (m, t) -> {
            K key = Objects.requireNonNull(classifier.apply(t), "element cannot be mapped to a null key");
            A container = m.computeIfAbsent(key, k -> downstreamSupplier.get());
            downstreamAccumulator.accept(container, t);
        };
        BinaryOperator<Map<K, A>> merger = Collectors.<K, A, Map<K, A>>mapMerger(downstream.combiner());
        @SuppressWarnings("unchecked")
        Supplier<Map<K, A>> mangledFactory = (Supplier<Map<K, A>>) mapFactory;

        if (downstream.characteristics().contains(Collector.Characteristics.IDENTITY_FINISH)) {
            return new CollectorImpl<>(mangledFactory, accumulator, merger, CH_ID);
        }
        else {
            @SuppressWarnings("unchecked")
            Function<A, A> downstreamFinisher = (Function<A, A>) downstream.finisher();
            Function<Map<K, A>, M> finisher = intermediate -> {
                intermediate.replaceAll((k, v) -> downstreamFinisher.apply(v));
                @SuppressWarnings("unchecked")
                M castResult = (M) intermediate;
                return castResult;
            };
            return new CollectorImpl<>(mangledFactory, accumulator, merger, finisher, CH_NOID);
        }
    }
```
为了保持原有顺序可以指定`LinkedHashMap`来存放数据
```java
LinkedHashMap<String, List<JSONObject>> map = list.stream()
                .collect(Collectors.groupingBy(d -> d.getString("id"),
                LinkedHashMap::new,
                Collectors.toList()));
```
