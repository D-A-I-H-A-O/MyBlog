---
title: Fastjson之SerializerFeature属性读取JSON写入文件
date: 2023-02-26
categories:
 - Java
tags:
 - Fastjson
---

**安装**

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>2.0.23</version>
</dependency>
```
SerializerFeature属性
```java
public enum SerializerFeature {
    /**
     * 输出key时是否使用双引号,默认为true
     */
    QuoteFieldNames,
    /**
     * 使用单引号而不是双引号,默认为false
     */
    UseSingleQuotes,
    /**
     * 是否输出值为null的字段,默认为false
     */
    WriteMapNullValue,
    /**
     * 用枚举toString()值输出
     */
    WriteEnumUsingToString,
    /**
     * 用枚举name()输出
     */
    WriteEnumUsingName,
    /**
     * Date使用ISO8601格式输出，默认为false
     */
    UseISO8601DateFormat,
    /**
     * List字段如果为null,输出为[],而非null
     */
    WriteNullListAsEmpty,
    /**
     * 字符类型字段如果为null,输出为”“,而非null
     */
    WriteNullStringAsEmpty,
    /**
     * 数值字段如果为null,输出为0,而非null
     */
    WriteNullNumberAsZero,
    /**
     * Boolean字段如果为null,输出为false,而非null
     */
    WriteNullBooleanAsFalse,
    /**
     * 如果是true，类中的Get方法对应的Field是transient，序列化时将会被忽略。默认为true
     */
    SkipTransientField,
    /**
     * 按字段名称排序后输出。默认为false
     */
    SortField,
    /**
     * 把\t做转义输出，默认为false
     */
    @Deprecated
    WriteTabAsSpecial,
    /**
     * 结果是否格式化,默认为false
     */
    PrettyFormat,
    /**
     * 序列化时写入类型信息，默认为false。反序列化是需用到
     */
    WriteClassName,

    /**
     * 消除对同一对象循环引用的问题，默认为false
     */
    DisableCircularReferenceDetect, // 32768

    /**
     * 对斜杠’/’进行转义
     */
    WriteSlashAsSpecial,

    /**
     * 将中文都会序列化为\uXXXX格式，字节数会多一些，但是能兼容IE 6，默认为false
     */
    BrowserCompatible,

    /**
     * 全局修改日期格式,默认为false。JSON.DEFFAULT_DATE_FORMAT = “yyyy-MM-dd”;JSON.toJSONString(obj, SerializerFeature.WriteDateUseDateFormat);
     */
    WriteDateUseDateFormat,

    /**
     * @since 1.1.15
     */
    NotWriteRootClassName,

    /**
     * 一个对象的字符串属性中如果有特殊字符如双引号，将会在转成json时带有反斜杠转移符。如果不需要转义，可以使用这个属性。默认为false
     * @deprecated
     */
    DisableCheckSpecialChar,

    /**
     * 	将对象转为array输出
     */
    BeanToArray,

    /**
     * @since 1.1.37
     */
    WriteNonStringKeyAsString,
    
    /**
     * @since 1.1.42
     */
    NotWriteDefaultValue,
    
    /**
     * @since 1.2.6
     */
    BrowserSecure,
    
    /**
     * @since 1.2.7
     */
    IgnoreNonFieldGetter,
    
    /**
     * @since 1.2.9
     */
    WriteNonStringValueAsString,
    
    /**
     * @since 1.2.11
     */
    IgnoreErrorGetter,

    /**
     * @since 1.2.16
     */
    WriteBigDecimalAsPlain,

    /**
     * @since 1.2.27
     */
    MapSortField;

    SerializerFeature(){
        mask = (1 << ordinal());
    }

    public final int mask;

    public final int getMask() {
        return mask;
    }

    public static boolean isEnabled(int features, SerializerFeature feature) {
        return (features & feature.mask) != 0;
    }
    
    public static boolean isEnabled(int features, int featuresB, SerializerFeature feature) {
        int mask = feature.mask;
        
        return (features & mask) != 0 || (featuresB & mask) != 0;
    }

    public static int config(int features, SerializerFeature feature, boolean state) {
        if (state) {
            features |= feature.mask;
        } else {
            features &= ~feature.mask;
        }

        return features;
    }
    
    public static int of(SerializerFeature[] features) {
        if (features == null) {
            return 0;
        }
        
        int value = 0;
        
        for (SerializerFeature feature: features) {
            value |= feature.mask;
        }
        
        return value;
    }
    
    public final static SerializerFeature[] EMPTY = new SerializerFeature[0];

    public static final int WRITE_MAP_NULL_FEATURES
            = WriteMapNullValue.getMask()
            | WriteNullBooleanAsFalse.getMask()
            | WriteNullListAsEmpty.getMask()
            | WriteNullNumberAsZero.getMask()
            | WriteNullStringAsEmpty.getMask()
            ;
}

```
改变SerializerFeature属性读取JSON写入文件
```java
public class JsonUtils {

    public static boolean createJsonFile(Object jsonData, String filePath) {

        //SerializerFeature.PrettyFormat:格式化输出
        //SerializerFeature.WriteMapNullValue:是否输出值为null的字段,默认为false

        //  JSON.DEFFAULT_DATE_FORMAT = "yyyy-MM-dd";

        /**
         * SerializerFeature.PrettyFormat:结果是否格式化,默认为false
         * SerializerFeature.WriteMapNullValue:显示值为null的字段
         * SerializerFeature.WriteNullStringAsEmpty:将为null的字段值显示为""
         * SerializerFeature.DisableCircularReferenceDetect:消除循环引用
         * SerializerFeature.WriteDateUseDateFormat,JSON.DEFFAULT_DATE_FORMAT:日期格式
         */

        /**
         * SortField:按字段名称排序后输出。默认为false
         * 这里使用的是fastjson：为了更好使用sort field martch优化算法提升parser的性能，fastjson序列化的时候，
         * 缺省把SerializerFeature.SortField特性打开了。
         * 反序列化的时候也缺省把SortFeidFastMatch的选项打开了。
         * 这样，如果你用fastjson序列化的文本，输出的结果是按照fieldName排序输出的，parser时也能利用这个顺序进行优化读取。
         * 这种情况下，parser能够获得非常好的性能。
         */

        JSON.DEFFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

        String content = JSON.toJSONString(jsonData,
                SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.DisableCircularReferenceDetect,
                SerializerFeature.WriteNullListAsEmpty,
                SerializerFeature.WriteNullStringAsEmpty,
                SerializerFeature.WriteNullNumberAsZero,
                SerializerFeature.WriteNullBooleanAsFalse,
                SerializerFeature.WriteDateUseDateFormat,
                SerializerFeature.SortField);

        try {
            File file = new File(filePath);
            // 创建上级目录
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            // 如果文件存在，则删除文件
            if (file.exists()) {
                file.delete();
            }
            // 创建文件
            file.createNewFile();
            // 写入文件
            Writer write = new OutputStreamWriter(new FileOutputStream(file), StandardCharsets.UTF_8);
            write.write(content);
            write.flush();
            write.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void main(String[] args) {

        String json = "{\n" + "    \"A\": \"1\",\n" + "    \"data\": [\n" + "        {\n" + "            \"A\": \"1\",\n" + "            \"data\": [\n" + "                {\n" + "                    \"A\": \"1\",\n" + "                    \"data\": {\n" + "                        \"A\": \"1\"\n" + "                    }\n" + "                }\n" + "            ]\n" + "        },\n" + "        {\n" + "            \"A\": \"1\",\n" + "            \"data\": [\n" + "                {\n" + "                    \"A\": \"1\",\n" + "                    \"data\": {\n" + "                        \"A\": \"1\"\n" + "                    }\n" + "                }\n" + "            ]\n" + "        }\n" + "    ]\n" + "}";

        JSONObject data = new JSONObject();
        data.put("A", 1);
        data.put("B", 2);
        data.put("C", 3);

        JSONObject data1 = new JSONObject();
        data1.put("A", 1);
        data1.put("B", 2);
        data1.put("C", 3);

        data.put("data1", data1);


        JSONObject obj = new JSONObject();
        obj.put("name", "测试");
        obj.put("data", data);
        obj.put("null", null);
        obj.put("ArrayList", new ArrayList<>());
        obj.put("date", new Date());
        obj.put("data1", data1);

        createJsonFile(obj, "D:\\development\\project\\demo\\temp" + "A.json");

    }
}
```

