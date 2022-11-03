---
title: Java中的BigDecimal
date: 2022-10-27
categories:
 - Java
tags:
 - BigDecimal
---

>使用BigDecimal，使用字符串构造函数而非浮点类型；或者使用valueOf方法。

```java
		//0.1的二进制表示是无限循环的。
		//由于计算机的资源是有限的，所以是没办法用二进制精确的表示 0.1，只能用「近似值」来表示
		
        //源码
        // public BigDecimal(double val) {
        //        this(val,MathContext.UNLIMITED);
        //}
        
        BigDecimal a = new BigDecimal(0.01);
        System.out.println("a = " + a);//a = 0.01000000000000000020816681711721685132943093776702880859375

        //源码
        // public static BigDecimal valueOf(double val) {
        //        return new BigDecimal(Double.toString(val));
        //}    
        BigDecimal b = BigDecimal.valueOf(0.01);
        System.out.println("b = " + b);//b = 0.01

   		BigDecimal c = new BigDecimal("0.01");
        System.out.println("c = " + c);//c = 0.01
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6211e8e2d9514bc3bb9909792d946a6f.png)
> BigDecimal只比较值用compareTo，比较精度用equals
```java
   BigDecimal a = new BigDecimal("9527");
   BigDecimal b = new BigDecimal("9527.000");

   System.out.println("equals:" + a.equals(b));//equals:false

   //-1:小于、0:等于、1:大于
   System.out.println("compareTo:" + a.compareTo(b));//compareTo:0
```
**BigDecimal的equals源码**

`equals`方法不仅比较了值是否相等，还比较了精度是否相同
```java
  @Override
    public boolean equals(Object x) {
        if (!(x instanceof BigDecimal))
            return false;
        BigDecimal xDec = (BigDecimal) x;
        if (x == this)
            return true;
         //精度比较
        if (scale != xDec.scale)
            return false;
        long s = this.intCompact;
        long xs = xDec.intCompact;
        if (s != INFLATED) {
            if (xs == INFLATED)
                xs = compactValFor(xDec.intVal);
            return xs == s;
        } else if (xs != INFLATED)
            return xs == compactValFor(this.intVal);

        return this.inflated().equals(xDec.inflated());
    }
```

> 使用BigDecimal，记得指定精度。在除法（divide）运算过程中，如果商是一个无限小数，而操作的结果预期是一个精确的数字，那么将会抛出ArithmeticException异常。

```java
   BigDecimal a = new BigDecimal("1");
   BigDecimal b = new BigDecimal("3");
  // a.divide(b);
   BigDecimal c = a.divide(b, 2, RoundingMode.HALF_UP);
   System.out.println(c);//0.33
```

**RoundingMode枚举类**

* `RoundingMode.UP`：舍入远离零的舍入模式。在丢弃非零部分之前始终增加数字(始终对非零舍弃部分前面的数字加1)。注意，此舍入模式始终不会减少计算值的大小。

* `RoundingMode.DOWN`：接近零的舍入模式。在丢弃某部分之前始终不增加数字(从不对舍弃部分前面的数字加1，即截短)。注意，此舍入模式始终不会增加计算值的大小。

* `RoundingMode.CEILING`：接近正无穷大的舍入模式。如果 `BigDecimal` 为正，则舍入行为与 ROUNDUP 相同;如果为负，则舍入行为与 `ROUNDDOWN` 相同。注意，此舍入模式始终不会减少计算值。

* `RoundingMode.FLOOR`：接近负无穷大的舍入模式。如果 `BigDecimal` 为正，则舍入行为与 `ROUNDDOWN` 相同;如果为负，则舍入行为与 `ROUNDUP` 相同。注意，此舍入模式始终不会增加计算值。

* `RoundingMode.HALF_UP`：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。如果舍弃部分 >= 0.5，则舍入行为与 `ROUND_UP` 相同;否则舍入行为与 `ROUND_DOWN` 相同。注意，这是我们在小学时学过的舍入模式(四舍五入)。

* `RoundingMode.HALF_DOWN`：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为上舍入的舍入模式。如果舍弃部分 > 0.5，则舍入行为与 `ROUND_UP` 相同;否则舍入行为与 `ROUND_DOWN` 相同(五舍六入)。

* `RoundingMode.HALF_EVEN`：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则向相邻的偶数舍入。如果舍弃部分左边的数字为奇数，则舍入行为与 `ROUNDHALFUP` 相同;如果为偶数，则舍入行为与 `ROUNDHALF_DOWN` 相同。注意，在重复进行一系列计算时，此舍入模式可以将累加错误减到最小。此舍入模式也称为“银行家舍入法”，主要在美国使用。四舍六入，五分两种情况。如果前一位为奇数，则入位，否则舍去。以下例子为保留小数点1位，那么这种舍入方式下的结果。1.15 ==> 1.2 ,1.25 ==> 1.2

* `RoundingMode.UNNECESSARY`：断言请求的操作具有精确的结果，因此不需要舍入。如果对获得精确结果的操作指定此舍入模式，则抛出`ArithmeticException`。

> BigDecimal转换为String，科学计数法问题

* `toString()` 某些场景下使用科学计数法

* `toPlainString()` 不使用任何计数法

* `toEngineeringString()` 某些场景下使用工程计数法

```java
   BigDecimal a = new BigDecimal("0.000000000000");
   System.out.println(a.toString());//0E-12

   //抹零
   a = new BigDecimal("3550.00");
   System.out.println(a.stripTrailingZeros().toString());//3.55E+3

   a = new BigDecimal("3550.00");
   System.out.println(a.stripTrailingZeros().toPlainString());//3550
```

