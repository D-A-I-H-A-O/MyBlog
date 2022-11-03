---
title: 学不会的HashMap（一）
date: 2020-12-25
categories:
 - Java
tags:
 - HashMap
---

## 前言
`HashMap` 最早出现在 JDK 1.2中， 底层基于散列算法实现，是一个用于存储`Key-Value`键值对的集合，每一个键值对也叫做`Entry`。这些个键值对（`Entry`）分散存储在一个数组当中，这个数组就是`HashMap`的主干。数组里面都是`key-value`的实例，在`JDK1.8`之前叫做`Entry`，在`JDK1.8`之后叫做`Node`。**HashMap 允许 null 键和 null 值，在计算哈键的哈希值时，null 键哈希值为 0**。HashMap 并不保证键值对的顺序，这意味着在进行某些操作后，键值对的顺序可能会发生变化。

另外，需要注意的是，HashMap 是非线程安全类，在多线程环境下可能会存在问题。

`HashMap` 涉及知识特别多，在JDK 1.8中包括；1、散列表实现、2、扰动函数、3、初始化容量、4、负载因子、5、扩容元素拆分、6、链表树化、7、红黑树、8、插入、9、查找、10、删除、11、遍历、12、分段锁 等等。

# 源码分析
## 简单的HashMap的创建
（先了解这是一种怎么样的数据结构来存放数据）

问题：假设我们有一组7个字符串，需要存放到数组中，但要求在获取每个元素的时候时间复杂度是O(1)。也就是说你不能通过循环遍历的方式进行获取，而是要定位到数组ID直接获取相应的元素。

方案：如果说我们需要通过ID从数组中获取元素，那么就需要把每个字符串都计算出一个在数组中的位置ID。字符串获取ID你能想到什么方式？ 一个字符串最直接的获取跟数字相关的信息就是HashCode，可HashCode的取值范围太大了`[-2147483648, 2147483647]`，不可能直接使用。那么就需要使用HashCode与数组长度做与运算，得到一个可以在数组中出现的位置。如果说有两个元素得到同样的ID，那么这个数组ID下就存放两个字符串。

**代码：**
```java
        // 初始化一组字符串
        List<String> list = new ArrayList<>();
        list.add("jlkk");
        list.add("lopi");
        list.add("小傅哥");
        list.add("e4we");
        list.add("alpo");
        list.add("yhjk");
        list.add("plop");
        
        //定义要存放的数组
        String[] tab = new String[8];
        
        // 循环存放
        for (String key : list) {
            int idx = key.hashCode() & (tab.length - 1);  // 计算索引位置
            System.out.println(String.format("key值=%s Idx=%d" , key, idx));
            if (null == tab[idx]) {
                tab[idx] = key;
                continue;
            }
            tab[idx] = tab[idx] + "->" + key;
        }

        System.out.println(JSON.toJSONString(tab));
        //key值=jlkk Idx=2
        //key值=lopi Idx=4
        //key值=小傅哥 Idx=7
        //key值=e4we Idx=5
        //key值=alpo Idx=2
        //key值=yhjk Idx=0
        //key值=plop Idx=5
        //["yhjk",null,"jlkk->alpo",null,"lopi","e4we->plop",null,"小傅哥"]
```
这段代码整体看起来也是非常简单，并没有什么复杂度，主要包括以下内容；

* 初始化一组字符串集合，这里初始化了7个。
* 定义一个数组用于存放字符串，注意这里的长度是8，也就是2的倍数。这样的数组长度才会出现一个 `0111` 除高位以外都是1的特征，也是为了散列。
* 接下来就是循环存放数据，计算出每个字符串在数组中的位置。`key.hashCode() & (tab.length - 1)`。
* 在字符串存放到数组的过程，如果遇到相同的元素，进行连接操作模拟链表的过程。
* 最后输出存放结果。
* 
* 在测试结果首先是计算出每个元素在数组的Idx，也有出现重复的位置。
* 最后是测试结果的输出，1、3、6，位置是空的，2、5，位置有两个元素被链接起来e4we->plop。
* 这就达到了我们一个最基本的要求，将串元素散列存放到数组中，最后通过字符串元素的索引ID进行获取对应字符串。这样是HashMap的一个最基本原理，有了这个基础后面就会更容易理解HashMap的源码实现。

## Hash散列示意图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021150949791.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
这张图就是上面代码实现的全过程，将每一个字符串元素通过Hash计算索引位置，存放到数组中。
黄色的索引ID是没有元素存放、绿色的索引ID存放了一个元素、红色的索引ID存放了两个元素。

## 简单的HashMap有哪些问题
以上我们实现了一个简单的`HashMap`，或者说还算不上`HashMap`，只能算做一个散列数据存放的雏形。但这样的一个数据结构放在实际使用中，会有哪些问题呢？

* 这里所有的元素存放都需要获取一个索引位置，而如果元素的位置不够散列碰撞严重，那么就失去了散列表存放的意义，没有达到预期的性能。
* 在获取索引ID的计算公式中，需要数组长度是2的倍数，那么怎么进行初始化这个数组大小。
* 数组越小碰撞的越大，数组越大碰撞的越小，时间与空间如何取舍。
* 目前存放7个元素，已经有两个位置都存放了2个字符串，那么链表越来越长怎么优化。
* 随着元素的不断添加，数组长度不足扩容时，怎么把原有的元素，拆分到新的位置上去。

以上这些问题可以归纳为；`扰动函数`、`初始化容量`、`负载因子`、`扩容方法`以及`链表和红黑树`转换的使用等。接下来我们会逐个问题进行分析。

## 扰动函数
在`HashMap`存放元素时候有这样一段代码来处理哈希值，**这是java 8的散列值扰动函数，用于优化散列效果；**

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
### 为什么使用扰动函数
理论上来说字符串的`hashCode`是一个`int`类型值，那可以直接作为数组下标了，且不会出现碰撞。但是这个hashCode的取值范围是`[-2147483648, 2147483647]`，有将近40亿的长度，谁也不能把数组初始化的这么大，内存也是放不下的。（hashCode取值范围太大）

我们默认初始化的`Map`大小是**16**个长度 `DEFAULT_INITIAL_CAPACITY = 1 << 4`，所以获取的`Hash`值并不能直接作为下标使用，需要与数组长度进行取模运算得到一个下标值，也就是我们上面做的散列列子。

那么，`hashMap`源码这里不只是直接获取哈希值，还进行了一次扰动计算，`(h = key.hashCode()) ^ (h >>> 16)`。把哈希值右移16位，也就正好是自己长度的一半，之后与原哈希值做异或运算，这样就混合了原哈希值中的高位和低位，增大了**随机性**。计算方式如下图；
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021152222279.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
说白了，**使用扰动函数就是为了增加随机性，让数据元素更加均衡的散列，减少碰撞**。

## 初始化容量和负载因子
接下来我们讨论下一个问题，从我们模仿`HashMap`的例子中以及HashMap默认的初始化大小里，都可以知道，散列数组需要一个2的倍数的长度，因为只有2的倍数在减1的时候，才会出现`01111`这样的值。

那么这里就有一个问题，我们在初始化HashMap的时候，如果传一个17个的值`new HashMap<>(17)`，它会怎么处理呢？

### 寻找2的倍数最小值
在HashMap的初始化中，有这样一段方法；

```java
public HashMap(int initialCapacity, float loadFactor) {
    ...
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
```

* 阀值`threshold`，通过方法`tableSizeFor`进行计算，是根据初始化来计算的。
* 这个方法也就是要寻找比初始值大的，最小的那个2进制数值。比如传了17，我应该找到的是32。

**计算阀值大小的方法**

```java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

* `MAXIMUM_CAPACITY = 1 « 30`，这个是临界范围，也就是最大的Map集合。
* 乍一看可能有点晕😵怎么都在向右移位1、2、4、8、16，这主要是为了把二进制的各个位置都填上1，当二进制的各个位置都是1以后，就是一个标准的2的倍数减1了，最后把结果加1再返回即可。

那这里我们把17这样一个初始化计算阀值的过程，用图展示出来，方便理解：![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102115453769.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
### 负载因子

```java
static final float DEFAULT_LOAD_FACTOR = 0.75f;
```
**负载因子是做什么的？**

`HashMap`负载因子，就是存储到多少数据量了就进行扩容，不会等到存不下了才来扩容。

这里要提到上面做的`HashMap`例子，我们准备了7个元素，但是最后还有3个位置空余，2个位置存放了2个元素。 所以可能即使你数据比数组容量大时也是不一定能正正好好的把数组占满的，而是在某些小标位置出现了大量的碰撞，只能在同一个位置用链表存放，那么这样就失去了`Map`数组的性能。

所以，要选择一个合理的大小下进行扩容，`HashMap`**默认值0.75**就是说当阀值容量占了3/4时赶紧扩容，减少`Hash`碰撞。

同时0.75是一个默认构造值，在创建HashMap也可以调整，比如你希望用更多的空间换取时间，可以把负载因子调的更小一些，减少碰撞。

**为什么默认是0.75**

源码是有注释的，大概的意思就是负载因子是0.75的时候，空间利用率比较高，而且避免了相当多的Hash冲突，使得底层的链表或者是红黑树的高度比较低，提升了空间效率。
（负载因子越大，越晚扩容，查找成本会增加，产生更多Hash冲突）

## 扩容元素拆分
为什么扩容，因为数组长度不足了。那扩容最直接的问题，就是需要把元素拆分到新的数组中。拆分元素的过程中，原jdk1.7中会需要重新计算哈希值，但是到jdk1.8中已经进行优化，不在需要重新计算，提升了拆分的性能，设计的还是非常巧妙的。

**测试数据**
```java
List<String> list = new ArrayList<>();
        list.add("jlkk");
        list.add("lopi");
        list.add("jmdw");
        list.add("e4we");
        list.add("io98");
        list.add("nmhg");
        list.add("vfg6");
        list.add("gfrt");
        list.add("alpo");
        list.add("vfbh");
        list.add("bnhj");
        list.add("zuio");
        list.add("iu8e");
        list.add("yhjk");
        list.add("plop");
        list.add("dd0p");
 for (String key : list) {
      int hash = key.hashCode() ^ (key.hashCode() >>> 16);
      System.out.println("字符串：" + key + " \tIdx(16)：" + ((16 - 1) & hash) + " \tBit值：" + Integer.toBinaryString(hash) + " - " + Integer.toBinaryString(hash & 16) );
      System.out.println(" \t\tIdx(32)："+Integer.toBinaryString(key.hashCode()) + " " + Integer.toBinaryString(hash) + " " + Integer.toBinaryString((32 - 1) & hash));
  }
```
**测试结果**

```c
字符串：jlkk 	Idx(16)：3 	Bit值：1100011101001000010011 - 10000
 		Idx(32)：1100011101001000100010 1100011101001000010011 10011
字符串：lopi 	Idx(16)：14 	Bit值：1100101100011010001110 - 0
 		Idx(32)：1100101100011010111100 1100101100011010001110 1110
字符串：jmdw 	Idx(16)：7 	Bit值：1100011101010100100111 - 0
 		Idx(32)：1100011101010100010110 1100011101010100100111 111
字符串：e4we 	Idx(16)：3 	Bit值：1011101011101101010011 - 10000
 		Idx(32)：1011101011101101111101 1011101011101101010011 10011
字符串：io98 	Idx(16)：4 	Bit值：1100010110001011110100 - 10000
 		Idx(32)：1100010110001011000101 1100010110001011110100 10100
字符串：nmhg 	Idx(16)：13 	Bit值：1100111010011011001101 - 0
 		Idx(32)：1100111010011011111110 1100111010011011001101 1101
字符串：vfg6 	Idx(16)：8 	Bit值：1101110010111101101000 - 0
 		Idx(32)：1101110010111101011111 1101110010111101101000 1000
字符串：gfrt 	Idx(16)：1 	Bit值：1100000101111101010001 - 10000
 		Idx(32)：1100000101111101100001 1100000101111101010001 10001
字符串：alpo 	Idx(16)：7 	Bit值：1011011011101101000111 - 0
 		Idx(32)：1011011011101101101010 1011011011101101000111 111
字符串：vfbh 	Idx(16)：1 	Bit值：1101110010111011000001 - 0
 		Idx(32)：1101110010111011110110 1101110010111011000001 1
字符串：bnhj 	Idx(16)：0 	Bit值：1011100011011001100000 - 0
 		Idx(32)：1011100011011001001110 1011100011011001100000 0
字符串：zuio 	Idx(16)：8 	Bit值：1110010011100110011000 - 10000
 		Idx(32)：1110010011100110100001 1110010011100110011000 11000
字符串：iu8e 	Idx(16)：8 	Bit值：1100010111100101101000 - 0
 		Idx(32)：1100010111100101011001 1100010111100101101000 1000
字符串：yhjk 	Idx(16)：8 	Bit值：1110001001010010101000 - 0
 		Idx(32)：1110001001010010010000 1110001001010010101000 1000
字符串：plop 	Idx(16)：9 	Bit值：1101001000110011101001 - 0
 		Idx(32)：1101001000110011011101 1101001000110011101001 1001
字符串：dd0p 	Idx(16)：14 	Bit值：1011101111001011101110 - 0
 		Idx(32)：1011101111001011000000 1011101111001011101110 1110
```
* 这里我们随机使用一些字符串计算他们分别在16位长度和32位长度数组下的索引分配情况，看哪些数据被重新路由到了新的地址。

* 同时，这里还可以观察🕵出一个非常重要的信息，原哈希值与扩容新增出来的长度16，进行&运算，如果值等于0，则下标位置不变。如果不为0，那么新的位置则是原来位置上加16。｛这个地方需要好好理解下，并看实验数据｝

* 这样一来，就不需要在重新计算每一个数组中元素的哈希值了。

## 数据迁移
![bugstack.cn 数据迁移](https://img-blog.csdnimg.cn/20201021162329675.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)


* 这张图就是原16位长度数组元素，像32位数组长度中转移的过程。
* 其中黄色区域元素`zuio`因计算结果 `hash & oldCap` 不为0，则被迁移到下标位置24。
* 同时还是用重新计算哈希值的方式验证了，确实分配到24的位置，因为这是在二进制计算中补1的过程，所以可以通过上面简化的方式确定哈希值的位置。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201022142024134.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)

>  bugstack虫洞栈 [这里是引用](https://bugstack.cn/interview/2020/08/07/%E9%9D%A2%E7%BB%8F%E6%89%8B%E5%86%8C-%E7%AC%AC3%E7%AF%87-HashMap%E6%A0%B8%E5%BF%83%E7%9F%A5%E8%AF%86-%E6%89%B0%E5%8A%A8%E5%87%BD%E6%95%B0-%E8%B4%9F%E8%BD%BD%E5%9B%A0%E5%AD%90-%E6%89%A9%E5%AE%B9%E9%93%BE%E8%A1%A8%E6%8B%86%E5%88%86-%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0.html)

