(window.webpackJsonp=window.webpackJsonp||[]).push([[74],{477:function(t,a,v){"use strict";v.r(a);var e=v(0),s=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"网络编程的概述"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#网络编程的概述"}},[t._v("#")]),t._v(" 网络编程的概述")]),t._v(" "),a("h3",{attrs:{id:"网络"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#网络"}},[t._v("#")]),t._v(" 网络")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("多台计算机通过专门的外部设备连接在一起，从而是众多的计算机可以方便地互相传递信息，共享硬件，软件，数据信息等资源")])]),t._v(" "),a("li",[a("p",[t._v("局域网")]),t._v(" "),a("ul",[a("li",[t._v("在一个局部创建的网络环境")])])]),t._v(" "),a("li",[a("p",[t._v("城域网")]),t._v(" "),a("ul",[a("li",[t._v("在一个城市创建的网络环境")])])]),t._v(" "),a("li",[a("p",[t._v("广域网")]),t._v(" "),a("ul",[a("li",[t._v("万维网")])])])]),t._v(" "),a("h3",{attrs:{id:"网络通信"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#网络通信"}},[t._v("#")]),t._v(" 网络通信")]),t._v(" "),a("ul",[a("li",[t._v("计算机和计算机在网络中进行数据交互")])]),t._v(" "),a("h2",{attrs:{id:"网络编程的目的"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#网络编程的目的"}},[t._v("#")]),t._v(" 网络编程的目的")]),t._v(" "),a("h3",{attrs:{id:"直接或间接地通过网络协议与其它计算机进行通讯"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#直接或间接地通过网络协议与其它计算机进行通讯"}},[t._v("#")]),t._v(" 直接或间接地通过网络协议与其它计算机进行通讯")]),t._v(" "),a("h2",{attrs:{id:"网络通信要素"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#网络通信要素"}},[t._v("#")]),t._v(" 网络通信要素")]),t._v(" "),a("h3",{attrs:{id:"如何实现网络中的主机互相通信"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#如何实现网络中的主机互相通信"}},[t._v("#")]),t._v(" 如何实现网络中的主机互相通信")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("通信双方地址 （ip+端口号）")])]),t._v(" "),a("li",[a("p",[t._v("一定的规则（有两套参考模型）")]),t._v(" "),a("ul",[a("li",[t._v("OSI参考模型：模型过于理想化，未能在因特网上进行广泛推广")]),t._v(" "),a("li",[t._v("TCP/IP参考模型(或TCP/IP协议)：事实上的国际标准")])])])]),t._v(" "),a("h2",{attrs:{id:"ip-和-端口号"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ip-和-端口号"}},[t._v("#")]),t._v(" IP 和 端口号")]),t._v(" "),a("p",[t._v("通过IP+端口号找到程序")]),t._v(" "),a("p",[t._v("端口号与IP地址的组合得出一个网络套接字：Socket。")]),t._v(" "),a("h3",{attrs:{id:"ip-地址-inetaddress"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ip-地址-inetaddress"}},[t._v("#")]),t._v(" IP 地址：InetAddress")]),t._v(" "),a("ul",[a("li",[t._v("唯一的标识 Internet 上的计算机")]),t._v(" "),a("li",[t._v("本地回环地址(hostAddress)：127.0.0.1      主机名(hostName)：localhost")]),t._v(" "),a("li",[t._v("不易记忆")])]),t._v(" "),a("h3",{attrs:{id:"端口号"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#端口号"}},[t._v("#")]),t._v(" 端口号")]),t._v(" "),a("ul",[a("li",[t._v("标识正在计算机上运行的进程（程序）")]),t._v(" "),a("li",[t._v("不同的进程有不同的端口号")]),t._v(" "),a("li",[t._v("被规定为一个 16 位的整数 0~65535。其中，0~1023被预先定义的服务通信占用（如http占用端口80，Tomcat占用端口8080，MySql占用端口3306,Oracle占用端口1521等）。除非我们需要访问这些特定服务，否则，就应该使用 1024~65535 这些端口中的某一个进行通信，以免发生端口冲突。")])]),t._v(" "),a("h2",{attrs:{id:"inetaddress类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#inetaddress类"}},[t._v("#")]),t._v(" InetAddress类")]),t._v(" "),a("p",[t._v("Internet上的主机有两种方式表示地址：")]),t._v(" "),a("p",[t._v("域名(hostName)：www.baidu.com")]),t._v(" "),a("p",[t._v("IP 地址(hostAddress)：192.168.3.210")]),t._v(" "),a("h3",{attrs:{id:"主要用于表示一台计算机的通信信息"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#主要用于表示一台计算机的通信信息"}},[t._v("#")]),t._v(" 主要用于表示一台计算机的通信信息")]),t._v(" "),a("h3",{attrs:{id:"方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#方法"}},[t._v("#")]),t._v(" 方法")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("getLocaHost()")]),t._v(" "),a("ul",[a("li",[t._v("获得InetAddress对象（主要封存了主机名和IP地址）")])])]),t._v(" "),a("li",[a("p",[t._v("getHostName()")]),t._v(" "),a("ul",[a("li",[t._v("获得本机主机名")])])]),t._v(" "),a("li",[a("p",[t._v("getHostAddress()")]),t._v(" "),a("ul",[a("li",[t._v("获得主机IP地址")])])]),t._v(" "),a("li",[a("p",[t._v("getByName(主机名)")]),t._v(" "),a("ul",[a("li",[t._v("根据主机名的名称获取网络内的一个对象")])])])]),t._v(" "),a("h2",{attrs:{id:"tcp-和-udp"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tcp-和-udp"}},[t._v("#")]),t._v(" TCP 和 UDP")]),t._v(" "),a("p",[t._v("TCP/IP 以其两个主要协议：传输控制协议(TCP)和网络互联协议(IP)而得名，实际上是一组协议，包括多个具有不同功能且互为关联的协议。")]),t._v(" "),a("p",[t._v("TCP/IP协议模型从更实用的角度出发，形成了高效的四层体系结构，即物理链路层、IP层、传输层和应用层。")]),t._v(" "),a("h3",{attrs:{id:"传输控制协议tcp-transmission-control-protocol"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#传输控制协议tcp-transmission-control-protocol"}},[t._v("#")]),t._v(" 传输控制协议TCP(Transmission Control Protocol)")]),t._v(" "),a("ul",[a("li",[t._v("是面向连接")])]),t._v(" "),a("h3",{attrs:{id:"用户数据报协议udp-user-datagram-protocol-。"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#用户数据报协议udp-user-datagram-protocol-。"}},[t._v("#")]),t._v(" 用户数据报协议UDP(User Datagram Protocol)。")]),t._v(" "),a("ul",[a("li",[t._v("不是面向连接")])]),t._v(" "),a("h2",{attrs:{id:"基于tcp协议进行的网络编程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基于tcp协议进行的网络编程"}},[t._v("#")]),t._v(" 基于TCP协议进行的网络编程")]),t._v(" "),a("p",[t._v("服务器程序的工作过程包含以下四个基本的步骤：")]),t._v(" "),a("p",[t._v("调用 ServerSocket(int port) ：创建一个服务器端套接字，并绑定到指定端口上。用于监听客户端的请求。")]),t._v(" "),a("p",[t._v("调用 accept()：监听连接请求，如果客户端请求连接，则接受连接，返回通信套接字对象。")]),t._v(" "),a("p",[t._v("调用 该Socket类对象的 getOutputStream() 和 getInputStream ()：获取输出流和输入流，开始网络数据的发送和接收。")]),t._v(" "),a("p",[t._v("关闭ServerSocket和Socket对象：客户端访问结束，关闭通信套接字。")]),t._v(" "),a("h3",{attrs:{id:"_1-服务器建立-serversocket-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-服务器建立-serversocket-对象"}},[t._v("#")]),t._v(" 1.服务器建立 ServerSocket 对象")]),t._v(" "),a("p",[t._v("ServerSocket 对象负责等待客户端请求建立套接字连接，类似邮局某个窗口中的业务员。也就是说，服务器必须事先建立一个等待客户请求建立套接字连接的ServerSocket对象")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("ServerSocket ss = new ServerSocket(9999);")]),t._v(" "),a("ul",[a("li",[t._v("创建对象")]),t._v(" "),a("li",[t._v("IP地址默认是本机的")]),t._v(" "),a("li",[t._v("端口号自定义")])])]),t._v(" "),a("li",[a("p",[t._v("Socket s = ss.accept ();")]),t._v(" "),a("p",[t._v("所谓“接收”客户的套接字请求，就是accept()方法会返回一个 Socket 对象")]),t._v(" "),a("p",[t._v("在等待客户端连接")]),t._v(" "),a("ul",[a("li",[t._v("等待客户端连接")])])]),t._v(" "),a("li",[a("p",[t._v("InputStream in = s.getInputStream();")]),t._v(" "),a("ul",[a("li",[t._v("输出流")])])]),t._v(" "),a("li",[a("p",[t._v("byte[] buf = new byte[1024];")]),t._v(" "),a("ul",[a("li",[t._v("存入的数组")])])]),t._v(" "),a("li",[a("p",[t._v("int num = in.read(buf);")]),t._v(" "),a("ul",[a("li",[t._v("接受客户端输入")])])]),t._v(" "),a("li",[a("p",[t._v("System.out.println(s.getInetAddress().toString()+”:”+str);")])]),t._v(" "),a("li",[a("p",[t._v("s.close();")]),t._v(" "),a("ul",[a("li",[t._v("关闭资源")])])]),t._v(" "),a("li",[a("p",[t._v("ss.close();")])])]),t._v(" "),a("h3",{attrs:{id:"_2-客户端建立socket对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-客户端建立socket对象"}},[t._v("#")]),t._v(" 2.客户端建立Socket对象")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("Socket s = new Socket(“IP地址”端口号);")])]),t._v(" "),a("li",[a("p",[t._v("OutputStream out = s.getOutputStream();\nout.write(“hello”.getBytes());")]),t._v(" "),a("ul",[a("li",[t._v("str.getBytes()   String转byte[]")])])]),t._v(" "),a("li",[a("p",[t._v("s.close();")])])]),t._v(" "),a("h2",{attrs:{id:"基于udp协议进行的网络编程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基于udp协议进行的网络编程"}},[t._v("#")]),t._v(" 基于UDP协议进行的网络编程")]),t._v(" "),a("h3",{attrs:{id:"创建一端对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#创建一端对象"}},[t._v("#")]),t._v(" 创建一端对象")]),t._v(" "),a("ul",[a("li",[t._v("DatagramSocket ds=new DatagramSocket();//纯发送端\nDatagramSocket ds=new DatagramSocket(7777);发送端和接收端")])]),t._v(" "),a("h3",{attrs:{id:"创建数据报包-数据-目的地"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#创建数据报包-数据-目的地"}},[t._v("#")]),t._v(" 创建数据报包：数据 目的地")]),t._v(" "),a("ul",[a("li",[t._v("String str = input.next();\nbyte[] b = str.getBytes();\nDatagramPacket dp = new DatagramPacket(b, b.length, InetAddress.getLocalHost(), 8888);")])]),t._v(" "),a("h3",{attrs:{id:"发送"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#发送"}},[t._v("#")]),t._v(" 发送")]),t._v(" "),a("ul",[a("li",[t._v("ds.send(dp);")])]),t._v(" "),a("h3",{attrs:{id:"创建接收数据的数据报包"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#创建接收数据的数据报包"}},[t._v("#")]),t._v(" 创建接收数据的数据报包")]),t._v(" "),a("ul",[a("li",[t._v("byte[] b = new byte[1024];\nDatagramPacket dp = new DatagramPacket(b, b.length);")])]),t._v(" "),a("h3",{attrs:{id:"接收数据"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#接收数据"}},[t._v("#")]),t._v(" 接收数据")]),t._v(" "),a("ul",[a("li",[t._v("ds.receive(dp);\ndp.getLength();获得读取字节数")])])])}),[],!1,null,null,null);a.default=s.exports}}]);