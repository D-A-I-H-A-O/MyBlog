---
title: Java IO
date: 2021-06-02
categories:
 - Java
tags:
 - IO
---



# IO流

流的概念和作用：流是一组有顺序的，有起点和终点的字节集合，是对数据传输的总称或抽象。即数据在两设备间的传输称为流，流的本质是数据传输，根据数据传输特性将流抽象为各种类，方便更直观的进行数据操作

* `I: input`     输入      外界(磁盘、网络、键盘...)---->程序  

* `O: output`    输出      程序---->外界(磁盘、网络、显示器...)

# IO流分类	
按流向分
* 输入流
* 输出流 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210621064928210.png)
> 上面四大基本流都是抽象类，都不能直接创建实例对象

按处理的单位分
* 字节流    视频、音频
* 字符流	  长文本

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620203256507.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620203303720.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


**字节流和字符流的区别** 

字节流读取单个字节，字符流读取单个字符(一个字符根据编码的不同，对应的字节也不同，如 UTF-8 编码是 3 个字节，中文编码是 2 个字节。) 字节流用来处理二进制文件(图片、MP3、视频文件)，字符流用来处理文本文件(可以看做是特殊的二进制文件，使用了某种编码，人可以阅读)。 简而言之，字节是个计算机看的，字符才是给人看的。

**字节转字符Input/OutputStreamReader/Writer**

编码就是把字符转换为字节，而解码是把字节重新组合成字符。

如果编码和解码过程使用不同的编码方式那么就出现了乱码

> GBK 编码中，中文字符占 2 个字节，英文字符占 1 个字节；
UTF-8 编码中，中文字符占 3 个字节，英文字符占 1 个字节；
UTF-16be 编码中，中文字符和英文字符都占 2 个字节

* 从数据来源或者说是操作对象角度看，IO 类可以分为:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620203631360.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
## FileInputStream
字节输入流 磁盘上的文件

```java
public class FileInputStream extends InputStream
```
**构造器**

```java
new FileInputStream(File file);
new FileInputStream(String pathname);
```

**读取方法**

```java
//读取一个字节(int表现形式)   读取到末尾再读返回-1
 public int read() throws IOException {
     return read0();
 }
```
```java
//将读取的内容放在数组中，返回读取字节的个数，如果没有了返回-1。
//在第二次以后读取并不会将byte数组中的数据清空
public int read(byte b[]) throws IOException {
    return readBytes(b, 0, b.length);
}
```

```java
//设置读取的字节数是len个，设置在数组的那个位置开始存off索引位置
public int read(byte b[], int off, int len) throws IOException {
    return readBytes(b, off, len);
}
```
IO流的操作步骤

a. 创建流对象  in=new FileInputStream(file);

b. 读写操作  in.read();

c. 关闭资源  in.close();

## FileOutputStream    
要保证文件前的路径是存在的，文件可以是不存在的，如果不存在创建流对象时会新建文件

**构造器** 

```java
new FileOutputStream(File file); //默认是将原内容覆盖掉
new FileOutputStream(File file,boolean append); //传true设置为追加内容
new FileOutputStream(String pathname); //默认是将原内容覆盖掉
new FileOutputStream(String pathname,boolean append); //传true设置为追加内容
```

**方法**

```java
write(int byte); //写入一个字节
out.write(byte[] b); //将byte数组中的数据全部写入
out.write(byte[] b, int off, int len); //设置从数组的off索引位置开始写，写len个字节
out.flush();   //刷新
out.close(); //关闭资源
```
##  FileReader
没有缓冲区，可以单个字符的读取，也可以自定义数组缓冲区。
```java
public class FileReader extends InputStreamReader {

    public FileReader(String fileName) throws FileNotFoundException {
        super(new FileInputStream(fileName));
    }


    public FileReader(File file) throws FileNotFoundException {
        super(new FileInputStream(file));
    }

    public FileReader(FileDescriptor fd) {
        super(new FileInputStream(fd));
    }

}
```
## FileWriter 
自带缓冲区，数据先写到到缓冲区上，然后从缓冲区写入文件。

```java
public class FileWriter extends OutputStreamWriter {


    public FileWriter(String fileName) throws IOException {
        super(new FileOutputStream(fileName));
    }

    
    public FileWriter(String fileName, boolean append) throws IOException {
        super(new FileOutputStream(fileName, append));
    }

    
    public FileWriter(File file) throws IOException {
        super(new FileOutputStream(file));
    }

    public FileWriter(FileDescriptor fd) {
        super(new FileOutputStream(fd));
    }

}
```

```java
    //将流对象放在try之外声明，并附为null，保证编译，可以调用close
    FileWriter writer = null;
    try {
        //将流对象放在里面初始化
        writer = new FileWriter("D:\\b.txt");
        writer.write("abc");
        
        //防止关流失败，没有自动冲刷，导致数据丢失
        writer.flush();
        
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        //判断writer对象是否成功初始化
        if(writer!=null) {
            //关流，无论成功与否
            try {
                writer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                //无论关流成功与否，都是有意义的：标为垃圾对象，强制回收
                writer = null;
            }
        }
    }
```
`JDK1.7` 提出了对流进行异常处理的新方式，任何 `AutoClosable` 类型的对象都可以用于 `try-with-resourses` 语法，实现自动关闭。

要求处理的对象的声明过程必须在 try 后跟的()中，在 try 代码块之外
```java
try(FileWriter writer = new FileWriter("D:\\c.txt")){
    writer.write("abc");
}catch (IOException e){
    e.printStackTrace();
}
```
 > 语法糖，最后编译还是使用finally 
## File类
概述：文件和目录路径名的抽象表示形式(对象)，与平台(操作系统)无关

功能：`File` 能新建、删除、重命名文件和目录，但 `File` 不能访问文件内容本身

作用：`File`对象可以作为参数传递给流的构造器

**构造器**

```java
File(String pathname);
//a. 绝对路径(从盘符开始)
//F:\java.txt
//b. 相对路径(从当前项目下开始寻找)
//src\\java.txt
```
```java
File(File parentFile,String child);
	由父级的File对象和子级的路径构建一个file对象
File(String parentPath,String child);
	由父级的路径和子级的路径构建一个file对象
```
**方法**


```java
//文件检测
	exists()   //是否存在
	canWrite()  //是否可写
	canRead()  //是否可读
	isFile()   //判断是否是文件(如果文件不存在返回false)
	isDirectory()  //判断是否是文件夹(如果文件夹不存在返回false)
//目录操作
	mkdir()   //新建一级文件夹
	mkdirs()  //新建多级文件夹
	delete()  //只能删除空白文件夹
	list()    //获得文件夹内所有内容的名字   String[]
	listFiles()  //获得文件夹内所有内容的File对象    File[]
//文件操作相关 
	createNewFile()  //新建文件(受检异常IOException)  有可能文件所在的路径是不存在的
	delete()   //删除文件
//访问文件名：
	getName()  //获得文件或文件夹名字
	getPath()  //获得路径
	getAbsoluteFile() // 获得由绝对路径获得的File类对象 
	getAbsolutePath()  //获得file对象的绝对路径
	getParent()  //获得当前对象上一级File对象的路径(String)
	getParentFile()  //获得当前对象上一级File对象(File)
	toPath()  //获得路径
	renameTo(File newName)  //重命名
//获取常规文件信息	
	lastModified()  //最后一次修改的时间   (毫秒数)
	length()     //获得字节数
```
## 缓冲流
**字符缓冲流**

`BufferedReader`：在构建的时候需要传入一个 `Reader` 对象，真正读取数据依靠的是传入的这个 `Reader` 对象，`BufferedRead` 从 `Reader` 对象中获取数据提供缓冲区。


```java
public static void main(String[] args) throws IOException {
    //真正读取文件的流是FileReader，它本身并没有缓冲区
    FileReader reader = new FileReader("D:\\b.txt");
    BufferedReader br = new BufferedReader(reader);
    //读取一行
    //String str = br.readLine();
    //System.out.println(str);

    //定义一个变量来记录读取的每一行的数据（回车）
    String str;
    //读取到末尾返回null
    while((str = br.readLine())!=null){
        System.out.println(str);
    }
    //关外层流即可
    br.close();
}
```


`BufferedWriter`：提供了一个更大的缓冲区，提供了一个 `newLine` 的方法用于换行，以屏蔽不同操作系统的差异性。

```java
public static void main(String[] args) throws Exception {
    //真正向文件中写数据的流是FileWriter,本身具有缓冲区
    //BufferedWriter 提供了更大的缓冲区
    BufferedWriter writer = new BufferedWriter(new FileWriter("E:\\b.txt"));
    writer.write("天乔");
    //换行： Windows中换行是 \r\n   linux中只有\n
    //提供newLine() 统一换行
    writer.newLine();
    writer.write("巴夏");
    writer.close();
}
```

**装饰设计模式**

缓冲流基于装饰设计模式，即利用同类对象构建本类对象，在本类中进行功能的改变或者增强。

例如，`BufferedReader` 本身就是 `Reader` 对象，它接收了一个 `Reader` 对象构建自身，自身提供缓冲区和其他新增方法，通过减少磁盘读写次数来提高输入和输出的速度。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210621070408551.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
除此之外，字节流同样也存在缓冲流，分别是 `BufferedInputStream` 和 `BufferedOutputStream`。

## 转换流
利用转换流可以实现字符流和字节流之间的转换。
* `OutputStreamWrite`

最终与文件接触的是字节流，意味着将传入的字符转换为字节。
```java
    public static void main(String[] args) throws Exception {
        //在构建转换流时需要传入一个OutputStream  字节流
        OutputStreamWriter ow = 
                new OutputStreamWriter(
                        new FileOutputStream("D:\\b.txt"),"utf-8");
        //给定字符--> OutputStreamWriter转化为字节-->以字节流形式传入文件FileOutputStream
        //如果没有指定编码，默认使用当前工程的编码
        ow.write("天乔巴夏");
        ow.close();
    }
```
* `InputStreamReader`

最初与文件接触的是字节流，意味着将读取的字节转化为字符。
```java
    public static void main(String[] args) throws IOException {
        //以字节形式FileInputStream读取,经过转换InputStreamReader -->字符
        //如果没有指定编码。使用的是默认的工程的编码
        InputStreamReader ir = 
                new InputStreamReader(
                        new FileInputStream("D:\\b.txt"));
        char[] cs = new char[5];
        int len;
        while((len=ir.read(cs))!=-1){
            System.out.println(new String(cs,0,len));
        }
        ir.close();
    }
```
## 标准流/系统流
程序的所有输入都可以来自于标准输入，所有输出都可以发送到标准输出，所有错误信息都可以发送到标准错误。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210621070956988.png)
可以直接使用 `System.out` 和 `System.err`，但是在读取 `System.in` 之前必须对其进行封装，例如我们之前经常会使用的读取输入：`Scanner sc = new Scanner(System.in)`;实际上就封装了 `System.in` 对象

* 标准流都是字节流。

* 标准流对应的不是类而是对象。

* 标准流在使用的时候不用关闭

```java
    /**
     * 从控制台获取一行数据 
     * 通过转换流，将 System.in 读取的标准输入字节流转化为字符流，发送到标准输出，打印显示。
     * @throws IOException  readLine 可能会抛出异常
     */
    public static void getLine() throws IOException {
        //获取一行字符数据 -- BufferedReader
        //从控制台获取数据 -- System.in
        //System是字节流，BufferedReader在构建的时候需要传入字符流
        //将字节流转换为字符流
        BufferedReader br =
                new BufferedReader(
                        new InputStreamReader(System.in));
        //接收标准输入并转换为大写
        String str = br.readLine().toUpperCase();
        //发送到标准输出
        System.out.println(str);
    }
```
## 打印流
打印流只有输出流没有输入流


`PrintStream`: 打印字节流
```java
    public static void main(String[] args) throws IOException {
        //创建PrintStream对象
        PrintStream p = new PrintStream("D:\\b.txt");
        p.write("abc".getBytes());
        p.write("def".getBytes());
        p.println("abc");
        p.println("def");
        //如果打印对象，默认调用对象身上的toString方法
        p.println(new Object());
        p.close();
    }
```
`PrintWriter`：打印字符流
```java
    //将System.out转换为PrintStream
    public static void main(String[] args) {
        //第二个参数autoFlash设置为true，否则看不到结果
        PrintWriter p = new PrintWriter(System.out,true);
        p.println("hello,world!");
    }
```
## 合并流
`SequenceInputStream` 用于将多个字节流合并为一个字节流的流。

有两种构建方式：将多个合并的字节流放入一个 `Enumeration` 中来进行。传入两个 `InputStream` 对象。

合并流只有输入流没有输出流。

以第一种构建方式为例，我们之前说过，`Enumeration` 可以通过 `Vector` 容器的 `elements` 方法创建。

```java
    public static void main(String[] args) throws IOException {
        FileInputStream in1 = new FileInputStream("D:\\1.txt");
        FileInputStream in2 = new FileInputStream("D:\\a.txt");
        FileInputStream in3 = new FileInputStream("D:\\b.txt");
        FileInputStream in4 = new FileInputStream("D:\\m.txt");

        FileOutputStream out = new FileOutputStream("D:\\union.txt");
        //准备一个Vector存储输入流
        Vector<InputStream> v = new Vector<>();
        v.add(in1);
        v.add(in2);
        v.add(in3);
        v.add(in4);

        //利用Vector产生Enumeration对象
        Enumeration<InputStream> e = v.elements();
        //利用迭代器构建合并流
        SequenceInputStream s = new SequenceInputStream(e);

        //读取
        byte[] bs = new byte[10];
        int len;
        while((len = s.read(bs))!=-1){
            out.write(bs,0,len);
        }
        out.close();
        s.close();
    }
```
## 序列化/反序列化流

序列化：将对象转化为字节数组的过程。

反序列化：将字节数组还原回对象的过程。

**序列化的意义**

对象序列化的目标是将对象保存在磁盘中，或允许在网络中直接传输对象。对象序列化机制允许把内存中的 `Java` 对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，通过网络将这种二进制流传输到另一个网络节点。其他程序一旦获得了这种流，都可以将这种二进制流恢复为原来的 `Java` 对象。

让某个对象支持序列化的方法很简单，让它实现 `Serializable` 接口即可：

```java
//这个接口没有任何的方法声明，只是一个标记接口，表明实现该接口的类是可序列化的。
public interface Serializable {
}
```
我们通常在 `Web` 开发的时候，`JavaBean` 可能会作为参数或返回在远程方法调用中，如果对象不可序列化会出错，因此，`JavaBean` 需要实现 `Serializable` 接口。

**序列化对象**

```java
//必须实现Serializable接口
@Data
class Person implements Serializable {
    //序列化ID serialVersionUID
    private static final long serialVersionUID = 6402392549803169300L;
    private String name;
    private int age;
}
```
创建序列化流，将对象转化为字节，并写入"`D:\1.data`"。
```java
public class ObjectOutputStreamDemo {
    public static void main(String[] args) throws IOException {
        Person p = new Person();
        p.setAge(18);
        p.setName("Niu");
        //创建序列化流
        //真正将数据写出的流是FileOutputStream
        //ObjectOutputStream将对象转化为字节
        ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("D:\\1.data"));
        out.writeObject(p);
        out.close();
    }
}
```
创建反序列化流，将从"`D:\1.data`"中读取的字节转化为对象。

```java
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        //创建反序列化流
        //真正读取文件的是FileInputStream
        //ObjectInputStream将读取的字节转化为对象
        ObjectInputStream in = new ObjectInputStream(new FileInputStream("D:\\1.data"));
        //读取数据必须进行数据类型的强制转换
        Person p = (Person)in.readObject();
        in.close();
        System.out.println(p.getName());//Niu
        System.out.println(p.getAge());//18

    }
```
需要注意的是：

* 如果一个对象要想被序列化，那么对应的类必须实现接口 `serializable`，该接口没有任何方法，仅仅作为标记使用。

* 被 `static` 或 `transient` 修饰的属性不会进行序列化。如果属性的类型没有实现 `serializable` 接口但是也没有用这两者修饰，会抛出 `NotSerializableException`。

* 在对象序列化的时候，版本号会随着对象一起序列化出去，在反序列化的时候，对象中的版本号和类中的版本号进行比较，如果版本号一致，则允许反序列化。如果不一致，则抛出 `InvalidClassException`。

* 集合允许被整体序列化 ，集合及其中元素会一起序列化出去。

* 如果对象的成员变量是引用类型，这个引用类型也需要是可序列化的。

* 当一个可序列化类存在父类时，这些父类要么有无参构造器，要么是需要可序列化的，否则将抛出 `InvalidClassException` 的异常。

* 一个类如果允许被序列化，那么这个类中会产生一个版本号 `serialVersonUID`。如果没有手动指定版本号，那么在编译的时候自动根据当前类中的属性和方法计算一个版本号，也就意味着一旦类中的属性发生改变，就会重新计算新的，导致前后不一致。但是，手动指定版本号的好处就是，不需要再计算版本号。

* 版本号的意义在于防止类产生改动导致已经序列化出去的对象无法反序列化回来。版本号必须用 `static` `final` 修饰，本身必须是 `long` 类型。

**自定义序列化的两种方法**
* `Serializable` 自定义

```java
// 实现writeObject和readObject两个方法
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person implements Serializable {

    private String name;
    private int age;

    // 将name的值反转后写入二进制流
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeObject(new StringBuffer(name).reverse());
        out.writeInt(age);
    }

    // 将读取的字符串反转后赋给name
    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        this.name = ((StringBuffer) in.readObject()).reverse().toString();
        this.age = in.readInt();
    }
}
```
还有一种更加彻底的自定义机制，直接将序列化对象替换成其他的对象，需要定义 `writeReplace`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person implements Serializable {

    private String name;
    private int age;

    private Object writeReplace(){
        ArrayList<Object> list = new ArrayList<>();
        list.add(name);
        list.add(age);
        return list;
    }
}
```
* `Externalizable` 自定义

```java
//Externalizable 实现了 Seriablizable 接口，并规定了两个方法
public interface Externalizable extends java.io.Serializable {

    void writeExternal(ObjectOutput out) throws IOException;

    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```
实现该接口，并给出两个方法的实现，也可以实现自定义序列化。

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements Externalizable {

    String name;
    int age;

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(new StringBuffer(name).reverse());
        out.writeInt(age);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        this.name = ((StringBuffer) in.readObject()).reverse().toString();
        this.age = in.readInt();
    }
}
```

[Java输入输出流](https://blog.csdn.net/zhaoyanjun6/category_10358999.html?spm=1001.2014.3001.5482)
