---
title: Java中的加密与解密
date: 2023-03-01
categories:
 - Java
tags:
 - 加密解密
---

# BASE64加密/解密
Base64 编码会将字符串编码得到一个含有 A-Za-z0-9+/ 的字符串。标准的 Base64 并不适合直接放在URL里传输，因为URL编码器会把标准 Base64 中的“/”和“+”字符变为形如 “%XX” 的形式，而这些 “%” 号在存入数据库时还需要再进行转换，因为 ANSI SQL 中已将“%”号用作通配符。
```java
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import java.nio.charset.StandardCharsets;

public class Base64Util {

    /***
     * BASE64解密
     * @param key
     * @return
     * @throws Exception
     */
    public static byte[] decryBASE64(String key) throws Exception {
        return (new BASE64Decoder()).decodeBuffer(key);
    }

    /***
     * BASE64加密
     * @param key
     * @return
     * @throws Exception
     */
    public static String encryptBASE64(byte[] key) {
        return (new BASE64Encoder()).encode(key);
    }

    public static void main(String[] args) throws Exception {
        String base64 = encryptBASE64("DAIHAO".getBytes(StandardCharsets.UTF_8));
        System.out.println(base64);
        System.out.println(new String(decryBASE64(base64)));
    }
}
```

# MD5(Message Digest Algorithm)加密
MD5是一种信息摘要算法（message-digest algorithm 5 ），一种被广泛使用的密码散列函数，可以产生出一个128位（16字节）的散列值，用来确保信息传输完整一致性。


* 不可逆 知道密文和加密方式，无法反向计算出原密码 （但是有md5破解网站，专门查询MD5码）

>撞库：原理是：通过建立大型的数据库，把日常的各种句子通过md5加密成为密文，不断积累更新大量句子，放在庞大的数据库里；然后，有人拿了别人的密文，想查询真实的密码，就需要把密文拿到这个数据库的网站（免费MD5加密解密：https://md5.cn/）去查询。

* 长度固定 任意长度的数据，算出来的md5值长度都是固定的

* 强抗碰撞 想找到两个不同的数据，使它们具有相同的MD5值，是非常困难的。

* 容易计算 原理通俗易懂

* 细微性（高度离散性）对原数据进行任何改动，都会有很大的变化

```java
import java.security.MessageDigest;

public class MD5Util {

    public static final String KEY_MD5 = "MD5";

    /***
     * MD5加密（生成唯一的MD5值）
     * @param data
     * @return
     * @throws Exception
    x	 */
    public static byte[] encryMD5(byte[] data) throws Exception {
        MessageDigest md5 = MessageDigest.getInstance(KEY_MD5);
        md5.update(data);
        return md5.digest();
    }
}
```
# DES(Data Encryption Standard)对称加密
DES 是一种对称加密算法，所谓对称加密算法就是：加密和解密使用相同密钥的算法。DES 加密算法出自 IBM 的研究，后来被美国政府正式采用，之后开始广泛流传。但近些年使用越来越少，因为 DES 使用 56 位密钥，以现代的计算能力，24 小时内即可被破解。

顺便说一下 3DES（Triple DES），它是 DES 向 AES 过渡的加密算法，使用 3 条 56 位的密钥对数据进行三次加密。是 DES 的一个更安全的变形。它以 DES 为基本模块，通过组合分组方法设计出分组加密算法。比起最初的 DES，3DES 更为安全。

使用 Java 实现 DES 加密解密，注意密码长度要是 8 的倍数。加密和解密的 Cipher 构造参数一定要相同，不然会报错。

数据加密标准算法,和BASE64最明显的区别就是有一个工作密钥，该密钥既用于加密、也用于解密，并且要求密钥是一个长度至少大于8位的字符串。

```java
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import java.security.Key;
import java.security.SecureRandom;

public class DesUtil {
	private static Key key;
	private static String KEY_STR="DAIAHO";
	private static String CHARSETNAME="UTF-8";
	private static String ALGORITHM="DES";

	static {
		try {
			//生成DES算法对象
			KeyGenerator generator=KeyGenerator.getInstance(ALGORITHM);
			//运用SHA1安全策略
			SecureRandom secureRandom=SecureRandom.getInstance("SHA1PRNG");
			//设置上密钥种子
			secureRandom.setSeed(KEY_STR.getBytes());
			//初始化基于SHA1的算法对象
			generator.init(secureRandom);
			//生成密钥对象
			key=generator.generateKey();
			generator=null;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}


	/***
	 * 获取加密的信息
	 * @param str
	 * @return
	 */
	public static String getEncryptString(String str) {
		//基于BASE64编码，接收byte[]并转换成String
		BASE64Encoder encoder = new BASE64Encoder();
		try {
			//按utf8编码
			byte[] bytes = str.getBytes(CHARSETNAME);
			//获取加密对象
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			//初始化密码信息
			cipher.init(Cipher.ENCRYPT_MODE, key);
			//加密
			byte[] doFinal = cipher.doFinal(bytes);
			//byte[]to encode好的String 并返回
			return encoder.encode(doFinal);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}


	/***
	 * 获取解密之后的信息
	 * @param str
	 * @return
	 */
	public static String getDecryptString(String str) {
		BASE64Decoder decoder = new BASE64Decoder();
		try {
			//将字符串decode成byte[]
			byte[] bytes = decoder.decodeBuffer(str);
			//获取解密对象
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			//初始化解密信息
			cipher.init(Cipher.DECRYPT_MODE, key);
			//解密
			byte[] doFial = cipher.doFinal(bytes);

			return new String(doFial, CHARSETNAME);

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static void main(String[] args) {

		String daiaho = getEncryptString("DAIAHO");
		System.out.println(daiaho);

		String decryptString = getDecryptString(daiaho);
		System.out.println(decryptString);

	}
}
```

# AES(Advanced Encryption Standard)加密/解密
AES加密/解密算法是一种可逆的对称加密算法，这类算法在加密和解密时使用相同的密钥，或是使用两个可以简单地相互推算的密钥，一般用于服务端对服务端之间对数据进行加密/解密。它是一种为了替代原先DES、3DES而建立的高级加密标准（Advanced Encryption Standard）。


作为可逆且对称的块加密，AES加密算法的速度比公钥加密等加密算法快很多，在很多场合都需要AES对称加密，但是要求加密端和解密端双方都使用相同的密钥是AES算法的主要缺点之一。

```java
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AESUtil {

	public static final String algorithm = "AES";
	public static final String transformation = "AES/CBC/PKCS5Padding";
	public static final String key = "DAIHAODAIHAO9527";

	/***
	 * 加密
	 * @param original 需要加密的参数（注意必须是16位）
	 * @return
	 * @throws Exception
	 */
	public static String encryptByAES(String original) throws Exception {
		// 获取Cipher
		Cipher cipher = Cipher.getInstance(transformation);
		// 生成密钥
		SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), algorithm);
		// 指定模式(加密)和密钥
		// 创建初始化向量
		IvParameterSpec iv = new IvParameterSpec(key.getBytes());
		cipher.init(Cipher.ENCRYPT_MODE, keySpec, iv);
		// 加密
		byte[] bytes = cipher.doFinal(original.getBytes());

		return Base64Util.encryptBASE64(bytes);
	}

	/**
	 * 解密
	 * @param encrypted 需要解密的参数
	 * @return
	 * @throws Exception
	 */
	public static String decryptByAES(String encrypted) throws Exception {
		// 获取Cipher
		Cipher cipher = Cipher.getInstance(transformation);
		// 生成密钥
		SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), algorithm);
		// 指定模式(解密)和密钥
		// 创建初始化向量
		IvParameterSpec iv = new IvParameterSpec(key.getBytes());
		cipher.init(Cipher.DECRYPT_MODE, keySpec, iv);
		// 解密
		byte[] bytes = cipher.doFinal(Base64Util.decryBASE64(encrypted));

		return new String(bytes);
	}

	public static void main(String[] args) throws Exception {
		String s = encryptByAES("DAIHAO");
		System.out.println(s);
		System.out.println(decryptByAES(s));
	}
}
```

# HMAC (Hash Message Authentication Code)散列消息鉴别码
使用一个密钥生成一个固定大小的小数据块，即MAC，并将其加入到消息中，然后传输。接收方利用与发送方共享的密钥进行鉴别认证

```java
import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HMACUtil {

    public static final String KEY_MAC = "HmacMD5";

    /***
     * 初始化HMAC密钥
     * @return
     * @throws Exception
     */
    public static String initMacKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_MAC);
        SecretKey secreKey = keyGenerator.generateKey();
        return Base64Util.encryptBASE64(secreKey.getEncoded());
    }

    /**
     * HMAC加密
     *
     * @param data
     * @param key
     * @return
     * @throws Exception
     */
    public static byte[] encryHMAC(byte[] data, String key) throws Exception {
        SecretKey secreKey = new SecretKeySpec(Base64Util.decryBASE64(key), KEY_MAC);
        Mac mac = Mac.getInstance(secreKey.getAlgorithm());
        mac.init(secreKey);
        return mac.doFinal();
    }

    public static void main(String[] args) throws Exception {
        String key = initMacKey();
        byte[] daiahos = encryHMAC("DAIHAO".getBytes(StandardCharsets.UTF_8), key);
        for (byte daiaho : daiahos) {
            System.out.println(daiaho);
        }
    }
}

```

# 恺撒加密
恺撒密码的替换方法是通过排列明文和密文字母表，密文字母表示通过将明文字母表向左或向右移动一个固定数目的位置。例如，当偏移量是左移3的时候（解密时的密钥就是3）：

明文字母表：ABCDEFGHIJKLMNOPQRSTUVWXYZ ；
密文字母表：DEFGHIJKLMNOPQRSTUVWXYZABC。

使用时，加密者查找明文字母表中需要加密的消息中的每一个字母所在位置，并且写下密文字母表中对应的字母。需要解密的人则根据事先已知的密钥反过来操作，得到原来的明文。例如：

明文：THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG ；
密文：WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ。

```java
public class KaisaUtil {

	/***
	 * 使用凯撒加密方式加密数据
	 * @param orignal 原文
	 * @param key 密钥
	 * @return 加密后的字符
	 */
	private static String encryptKaisa(String orignal, int key) {
		//将字符串转换为数组
		char[] chars = orignal.toCharArray();
		StringBuffer buffer = new StringBuffer();
		//遍历数组
		for(char aChar : chars) {
			//获取字符的ASCII编码
			int asciiCode = aChar;
			//偏移数据
			asciiCode += key;
			//将偏移后的数据转为字符
			char result = (char)asciiCode;
			//拼接数据
			buffer.append(result);
		}
		return buffer.toString();
	}

	/**
	 * 使用凯撒加密方式解密数据
	 *
	 * @param encryptedData :密文
	 * @param key           :密钥
	 * @return : 源数据
	 */
	private static String decryptKaiser(String encryptedData, int key) {
	    // 将字符串转为字符数组
	    char[] chars = encryptedData.toCharArray();
	    StringBuilder sb = new StringBuilder();
	    // 遍历数组
	    for (char aChar : chars) {
	        // 获取字符的ASCII编码
	        int asciiCode = aChar;
	        // 偏移数据
	        asciiCode -= key;
	        // 将偏移后的数据转为字符
	        char result = (char) asciiCode;
	        // 拼接数据
	        sb.append(result);
	    }

	    return sb.toString();
	}


	public static void main(String[] args) {
		String encode = encryptKaisa( "DAIHAO", 3);
		System.out.println(encode);

		System.out.println(decryptKaiser(encode, 3));
	}

}

```

# SHA(Secure Hash Algorithm)安全散列算法

SHA-1是一种数据加密算法，该算法的思想是接收一段明文，然后以一种不可逆的方式将它转换成一段（通常更小）密文，也可以简单的理解为取一串输入码（称为预映射或信息），并把它们转化为长度较短、位数固定的输出序列即散列值（也称为信息摘要或信息认证代码）的过程。

　　单向散列函数的安全性在于其产生散列值的操作过程具有较强的单向性。如果在输入序列中嵌入密码，那么任何人在不知道密码的情况下都不能产生正确的散列值，从而保证了其安全性。SHA将输入流按照每块512位（64个字节）进行分块，并产生20个字节的被称为信息认证代码或信息摘要的输出。

　　该算法输入报文的长度不限，产生的输出是一个160位的报文摘要。输入是按512 位的分组进行处理的。SHA-1是不可逆的、防冲突，并具有良好的雪崩效应。

　　通过散列算法可实现数字签名实现，数字签名的原理是将要传送的明文通过一种函数运算（Hash）转换成报文摘要（不同的明文对应不同的报文摘要），报文摘要加密后与明文一起传送给接受方，接受方将接受的明文产生新的报文摘要与发送方的发来报文摘要解密比较，比较结果一致表示明文未被改动，如果不一致表示明文已被篡改。
　　
```java
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SHAUtil {

	public static final String KEY_SHA = "SHA";
    public static final String ALGORITHM = "SHA-256";

	/***
	 * SHA加密（比MD5更安全）
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public static byte[] encryptSHA(byte[] data) throws Exception{
		MessageDigest sha = MessageDigest.getInstance(KEY_SHA);
		sha.update(data);
		return sha.digest();
	}

	public static String SHAEncrypt(final String content) {
        try {
            MessageDigest sha = MessageDigest.getInstance(KEY_SHA);
            byte[] sha_byte = sha.digest(content.getBytes());
            StringBuffer hexValue = new StringBuffer();
            for (byte b : sha_byte) {
                //将其中的每个字节转成十六进制字符串：byte类型的数据最高位是符号位，通过和0xff进行与操作，转换为int类型的正整数。
                String toHexString = Integer.toHexString(b & 0xff);
                hexValue.append(toHexString.length() == 1 ? "0" + toHexString : toHexString);
            }
            return hexValue.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
       return "";
    }

    //SHA-256加密
    public static String SHA256Encrypt(String sourceStr) {
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance(ALGORITHM);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        if (null != md) {
            md.update(sourceStr.getBytes());
            String digestStr = getDigestStr(md.digest());
            return digestStr;
        }

        return null;
    }

    private static String getDigestStr(byte[] origBytes) {
        String tempStr = null;
        StringBuilder stb = new StringBuilder();
        for (int i = 0; i < origBytes.length; i++) {
            tempStr = Integer.toHexString(origBytes[i] & 0xff);
            if (tempStr.length() == 1) {
                stb.append("0");
            }
            stb.append(tempStr);

        }
        return stb.toString();
    }

    public static void main(String[] args) {

        System.out.println(SHAEncrypt("DAIHAO"));
        System.out.println(SHA256Encrypt("DAIHAO"));
    }
}
```

# RSA加密/解密
RSA算法是非对称密码算法。非对称密码又称为公钥密码，意思为每对加密包含一个公钥（可能为他人所知）和一个私钥（可能不为所有人所知）。有效的安全需要保持私钥的私密性；公钥可以在不影响安全性的情况下公开分发。

RSA 的安全性依赖于分解两个大素数乘积的实际困难，但相对较慢，可以称为“分解问题”。
```java
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

public class RSAUtil {
    private static String PUBLICKEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhX8nefMfPt7jY4wVr71XbDlwYc1D3ThS\n" +
            "fBJwUqzu1ZI9C5HHMUfQeA140fhdf3OaeCR41W4yMRrFKL1sasBs1nN/S5714CGqLICxTJq1bxlS\n" +
            "2cgvf/yW1y64U/2QaBolSIl1o/ltywD3Ztaarl3qBzjt1f5p7NYTtyO3lT97PHnY5H8WVCAbR5yu\n" +
            "zXRBj9lYFjaeUYWEhM/sd9OJeTfevnqzgVKXRq2jcAqKnI4RmdiJ4w5qacuN/TB8o6pRR6XVU/vx\n" +
            "jsDBta4AEe3ZWwgtS+RXMuEkjX7tddzwxVgyGhVRAj4yWWXxQu57i2Kq4MHdJ07IiyaarFpzo0CY\n" +
            "SwzJQwIDAQAB";
    private static String PRIVATEKEY = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCFfyd58x8+3uNjjBWvvVdsOXBh\n" +
            "zUPdOFJ8EnBSrO7Vkj0LkccxR9B4DXjR+F1/c5p4JHjVbjIxGsUovWxqwGzWc39LnvXgIaosgLFM\n" +
            "mrVvGVLZyC9//JbXLrhT/ZBoGiVIiXWj+W3LAPdm1pquXeoHOO3V/mns1hO3I7eVP3s8edjkfxZU\n" +
            "IBtHnK7NdEGP2VgWNp5RhYSEz+x304l5N96+erOBUpdGraNwCoqcjhGZ2InjDmppy439MHyjqlFH\n" +
            "pdVT+/GOwMG1rgAR7dlbCC1L5Fcy4SSNfu113PDFWDIaFVECPjJZZfFC7nuLYqrgwd0nTsiLJpqs\n" +
            "WnOjQJhLDMlDAgMBAAECggEAO8qEutkKkJUx0T9H40txoXZkgFl4YNe+EfYMOutbmWqDTvA/ADKD\n" +
            "C5I1IA4WimQTtmXXfPh7IIU18xZMPc/rr21RgWQ0CevqFT6aqo3MX3M/KW3A4JkYUk6Jnoy+JfI3\n" +
            "6rIub3/jDf5j0Lqj0x8bF5sG40as2LfVYrxrmDwzjRT15KyuX6k8ZLNxS/kyVKCReY4ZEipx4UrD\n" +
            "RBi4avIPFuKFHL5dg76bR7dUuVM9mjBxpEi4VglgZ9RoC+zFEF0qPeefgC8GI7dM/w8ium+SVVvd\n" +
            "NAKccYQi+UVmMx8irawwVHNySY5BThNHVnANh1y6udhKJ6VH8YvsqKnBjSWjiQKBgQD0KDamwoYh\n" +
            "dGuZVKQzT+8Dws443nqlWS07GkVjrmtsQWM/rg/olrdiNdjDtu4mK07pJlrd1WltwDzeN22mChUZ\n" +
            "mxcwn0UCJUU5oROSiU3NXSVVQtNCuJlXejEIpOI36I+qxKPMoNXG8toP7EEVedettnt0RQe6Qgcg\n" +
            "hZiYRX+m3wKBgQCL+NSvRF4wpf1xv+xETn1fKlwaMtkow55B6mOS6KpUJbTSZeg2eGNQ5ZvVmHdv\n" +
            "eG1jrkgc+32RgppCnAX1ohGu2Ut601xmkqxKTAMe9RUCgmF055ZcGtrjnh9LusrSMtuL8tzJgLTX\n" +
            "EF1apLoYcBQpKAKbqMqAGyvFbmDOIs9eHQKBgQDwkcb3nOeIgyuZ0tpPbM02yXVkd2IlFa8JcyM3\n" +
            "yp4x9mOSVTF7nTVn4WKJxO72UOnZtF8IAMV2zFmtIrQ5S+nqZvP8hpH6QTrqQ5oDYqJ0XPjx/3wl\n" +
            "W7pLhSxXNg9nww/71PEIKNk6xAK0ebbPMFSg5xLRR0sL7Q8Urk3ii2fxxQKBgDjlnQ7hq6f60Vs7\n" +
            "uL7LaQsWHPpJURzQ57PDo1ZEXXh3G1mrMwlxRm3L59ybbXFScqTiY03krNZJUItjAMkoaCe7DIOR\n" +
            "By5q0L4ix+H9ndy3QwZSXTxzbia4T+BovalUIwpwXm9Kcjg53rjJ3Rux84AHU4gSxL3uTYyjoZYp\n" +
            "cEHBAoGBAKsOCaiwHqnv1EHBhax3WAUgtcrS0DYANmRXBoaNBm0ijtaaDDOn+9km+LrA2JahbQhm\n" +
            "Rlsl2LTutHfMC1h00lkfwR/1g9MlKYYZWHVff8tGurPYvZhCfDf6Je1ssvhqU5t8IPAQGmAxVRLI\n" +
            "S4RHO29DU7Tpxn1fIcDt33m6bSzg";

    /**
     * RSA+BASE64加密（先RSA加密，然后Base64加密）
     *
     * @param secretContent：secretContent要加密的内容
     */
    public static String encrypt(String secretContent) {
        String byte2Base64 = "";
        try {
            //将Base64编码后的公钥转换成PublicKey对象
            PublicKey publicKey = string2PublicKey(RSAUtil.PUBLICKEY);
            //用公钥加密
            byte[] publicEncrypt = publicEncrypt(secretContent.getBytes(), publicKey);
            //加密后的内容Base64编码
            byte2Base64 = byte2Base64(publicEncrypt);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return byte2Base64;
    }

    /**
     * BASE64+RAS解密（先Base64解密，然后RSA解密）
     *
     * @param decodeContent ：解密字符串
     */
    public static String decode(String decodeContent) {
        byte[] privateDecrypt = new byte[]{};
        try {
            //将Base64编码后的私钥转换成PrivateKey对象
            PrivateKey privateKey = string2PrivateKey(PRIVATEKEY);
            //加密后的内容Base64解码
            byte[] base642Byte = base642Byte(decodeContent);
            //用私钥解密
            privateDecrypt = privateDecrypt(base642Byte, privateKey);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new String(privateDecrypt);
    }

    //生成秘钥对
    public static KeyPair getKeyPair() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        return keyPair;
    }

    //获取公钥(Base64编码)
    public static String getPublicKey(KeyPair keyPair) {
        PublicKey publicKey = keyPair.getPublic();
        byte[] bytes = publicKey.getEncoded();
        return byte2Base64(bytes);
    }

    //获取私钥(Base64编码)
    public static String getPrivateKey(KeyPair keyPair) {
        PrivateKey privateKey = keyPair.getPrivate();
        byte[] bytes = privateKey.getEncoded();
        return byte2Base64(bytes);
    }

    //将Base64编码后的公钥转换成PublicKey对象
    public static PublicKey string2PublicKey(String pubStr) throws Exception {
        byte[] keyBytes = base642Byte(pubStr);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        return publicKey;
    }

    //将Base64编码后的私钥转换成PrivateKey对象
    public static PrivateKey string2PrivateKey(String priStr) throws Exception {
        byte[] keyBytes = base642Byte(priStr);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        return privateKey;
    }

    //公钥加密
    public static byte[] publicEncrypt(byte[] content, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] bytes = cipher.doFinal(content);
        return bytes;
    }

    //私钥解密
    public static byte[] privateDecrypt(byte[] content, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] bytes = cipher.doFinal(content);
        return bytes;
    }

    //字节数组转Base64编码
    public static String byte2Base64(byte[] bytes) {
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(bytes);
    }

    //Base64编码转字节数组
    public static byte[] base642Byte(String base64Key) throws IOException {
        BASE64Decoder decoder = new BASE64Decoder();
        return decoder.decodeBuffer(base64Key);
    }

    public static void main(String[] args) throws Exception {
        String daihao = encrypt("DAIHAO");
        System.out.println(daihao);

       System.out.println(decode(daihao));
    }

}
```

# PBE加密/解密
PBE算法在加密过程中并不是直接使用口令来加密，而是加密的密钥由口令生成，这个功能由PBE算法中的KDF函数完成。

KDF函数的实现过程为：将用户输入的口令首先通过“盐”（salt）的扰乱产生准密钥，再将准密钥经过散列函数多次迭代后生成最终加密密钥，密钥生成后，PBE算法再选用对称加密算法对数据进行加密，可以选择DES、3DES、RC5等对称加密算法。

口令：一般与用户名对应，是某个用户自己编织的便于 记忆的一串单词、数字、汉字字符，口令的特点容易被记忆， 也容易泄露和被盗取，容易被社会工程学、暴力破解、撞库等方式获取。

密钥：是经过加密算法计算出来的，密钥一般不容易记忆，不容易被破解，而且很多时候密钥是作为算法的参数出现的，算法对于密钥长度也是有要求的，因为加密算法的作用就是利用密钥来扰乱明文顺序。

```java
import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;
import java.security.Key;
import java.security.SecureRandom;

public class PBEUtil {

    public static final String ALGORITHM = "PBEWITHMD5andDES";

    public static final int ITERATION_COUNT = 100;


    public static byte[] initSalt() throws Exception {
        //实例化安全随机数
        SecureRandom random = new SecureRandom();
        return random.generateSeed(8);
    }

    /***
     * 转换密钥
     * @param password 密码
     * @return 密钥
     * @throws Exception
     */
    private static Key toKey(String password) throws Exception {
        //密钥材料
        PBEKeySpec keySpec = new PBEKeySpec(password.toCharArray());
        //实例化
        SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);
        //生成密钥
        return factory.generateSecret(keySpec);
    }

    /***
     * 加密
     * @param data 待加密数据
     * @param password 密钥
     * @param salt
     * @return
     * @throws Exception
     */
    public static byte[] encrypt(byte[] data, String password, byte[] salt) throws Exception {
        //转换密钥
        Key key = toKey(password);
        //实例化PBE参数材料
        PBEParameterSpec spec = new PBEParameterSpec(salt, ITERATION_COUNT);
        //实例化
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        //初始化
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);
        return cipher.doFinal(data);
    }


    /***
     * 解密
     * @param data 待解密数据
     * @param password 密钥
     * @param salt
     * @return
     * @throws Exception
     */
    public static byte[] decrypt(byte[] data, String password, byte[] salt) throws Exception {
        //转换密钥
        Key key = toKey(password);
        //实例化PBE参数材料
        PBEParameterSpec spec = new PBEParameterSpec(salt, ITERATION_COUNT);
        //实例化
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        //初始化
        cipher.init(Cipher.DECRYPT_MODE, key, spec);
        //执行操作
        return cipher.doFinal(data);
    }


    private static String showByteArray(byte[] data) {
        if (null == data) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (byte b : data) {
            sb.append(b).append(",");
        }
        sb.deleteCharAt(sb.length() - 1);
        sb.append("");
        return sb.toString();
    }


    public static void main(String[] args) throws Exception {
        byte[] salt = initSalt();
        System.out.println("salt：" + showByteArray(salt));

        String password = "DAIHAO";
        System.out.println("口令：" + password);

        String data = "DAIHAO";
        byte[] encryptData = encrypt(data.getBytes(), password, salt);
        System.out.println("加密后数据：" + showByteArray(encryptData));

        byte[] decryptData = decrypt(encryptData, password, salt);
        System.out.println("解密后数据:" + new String(decryptData));
    }
}
```

# 安全级别
![在这里插入图片描述](https://img-blog.csdnimg.cn/6a593c38fd024ad08a37fe4d776dedb0.png)

