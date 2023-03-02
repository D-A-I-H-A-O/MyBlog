---
title: 六、SpringBoot_项目搭建
date: 2023-03-02
categories:
 - Spring
tags:
 - SpringBoot
---


# 日志
[Java 主流日志工具库](https://blog.csdn.net/D_A_I_H_A_O/article/details/129229384)


# 统一接口

**什么是 REST？**

`Representational State Transfer`——“表现层状态转化”。可以总结为一句话：`REST` 是所有 `Web` 应用都应该遵守的架构设计指导原则。面向资源是 `REST` 最明显的特征，对于同一个资源的一组不同的操作。资源是服务器上一个可命名的抽象概念，资源是以名词为核心来组织的，首先关注的是名词。`REST` 要求，必须通过统一的接口来对资源执行各种操作。对于每个资源只能执行一组有限的操作。

**什么是 RESTful API？**

符合 `REST` 设计标准的 `API`，即 `RESTful API`。`REST` 架构设计，遵循的各项标准和准则，就是 `HTTP` 协议的表现，换句话说，`HTTP` 协议就是属于 `REST` 架构的设计模式。比如，无状态，请求-响应。

[Restful相关文档](https://restfulapi.net/)

**统一接口的目的**

前后分离的模式进行开发，统一返回方便前端进行开发和封装，以及出现时给出响应编码和信息

## 状态码

```java
@Getter
@AllArgsConstructor
public enum ResponseStatus {

    SUCCESS("200", "success"),
    FAIL("500", "failed"),

    HTTP_STATUS_200("200", "ok"),
    HTTP_STATUS_400("400", "request error"),
    HTTP_STATUS_401("401", "no authentication"),
    HTTP_STATUS_403("403", "no authorities"),
    HTTP_STATUS_500("500", "server error");

    public static final List<ResponseStatus> HTTP_STATUS_ALL = Collections.unmodifiableList(
            Arrays.asList(HTTP_STATUS_200, HTTP_STATUS_400, HTTP_STATUS_401, HTTP_STATUS_403, HTTP_STATUS_500
            ));

    /**
     * response code
     */
    private final String responseCode;

    /**
     * description.
     */
    private final String description;

}
```
## 结果封装
* `timestamp` 接口返回时间
* `status` 状态,
* `message` 消息
* `data` 数据
* 考虑到数据的序列化（比如在网络上传输），这里`data`有时候还会`extends Serializable`。

```java
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class R<T> {

    /**
     * response timestamp.
     */
    private long timestamp;

    /**
     * response code, 200 -> OK.
     */
    private String status;

    /**
     * response message.
     */
    private String message;

    /**
     * response data.
     */
    private T data;

    /**
     * response success result wrapper.
     *
     * @param <T> type of data class
     * @return response result
     */
    public static <T> R<T> success() {
        return success(null);
    }

    /**
     * response success result wrapper.
     *
     * @param data response data
     * @param <T>  type of data class
     * @return response result
     */
    public static <T> R<T> success(T data) {
        return R.<T>builder().data(data)
                .message(ResponseStatus.SUCCESS.getDescription())
                .status(ResponseStatus.SUCCESS.getResponseCode())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * response error result wrapper.
     *
     * @param message error message
     * @param <T>     type of data class
     * @return response result
     */
    public static <T extends Serializable> R<T> fail(String message) {
        return fail(null, message);
    }

    /**
     * response error result wrapper.
     *
     * @param data    response data
     * @param message error message
     * @param <T>     type of data class
     * @return response result
     */
    public static <T> R<T> fail(T data, String message) {
        return R.<T>builder().data(data)
                .message(message)
                .status(ResponseStatus.FAIL.getResponseCode())
                .timestamp(System.currentTimeMillis())
                .build();
    }

}
```

## 返回结果

```java
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/test")
public class TestController {

    @PostMapping("list/{id}")
    public R<HashMap> list(@PathVariable("id") Long id) {
        //  service.list(id)
        HashMap<Object, Object> map = new HashMap<>();
        map.put("id", id);
        return R.success(map);
    }
}
```

# 参数校验
采用 **spring validation** 对参数绑定进行校验

**参数类**

```java
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.*;
import java.io.Serializable;

@Data
@Builder
public class TestParam implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotEmpty(message = "could not be empty")
    private String userId;

    @NotEmpty(message = "could not be empty")
    @Email(message = "invalid email")
    private String email;

    @NotEmpty(message = "could not be empty")
    @Pattern(regexp = "^(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X)$", message = "invalid ID")
    private String cardNo;

    @NotEmpty(message = "could not be empty")
    @Length(min = 1, max = 10, message = "nick name should be 1-10")
    private String nickName;

    @NotNull(message = "could not be empty")
    @Range(min = 0, max = 1, message = "sex should be 0-1")
    private int sex;

    @Max(value = 100, message = "Please input valid age")
    private int age;
    
}
```
**控制器**

```java
    @PostMapping("add")
    public ResponseEntity<String> add(@Valid @RequestBody TestParam testParam, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<ObjectError> errors = bindingResult.getAllErrors();
            errors.forEach(p -> {
                FieldError fieldError = (FieldError) p;
                log.error("Invalid Parameter : object - {},field - {},errorMessage - {}", fieldError.getObjectName(), fieldError.getField(), fieldError.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body("invalid parameter");
        }

        return ResponseEntity.ok("success");
    }
```
**测试**
![!\[**加粗样式**\](https://img-blog.csdnimg.cn/deb7efda517244189de25a84e41551c4.png](https://img-blog.csdnimg.cn/755f5eb85cbc4a079f75e298fdd1b6bd.png)

```java
2023-02-27 23:32:20.978 [http-nio-8080-exec-5] ERROR c.daihao.springbootdemo.controller.TestController - Invalid Parameter : object - testParam,field - cardNo,errorMessage - invalid ID
```
## 分组校验
有参数在添加时可以为空，在修改是不能为空，这时则可以使用分组校验

### 分组接口

```java
public interface AddValidationGroup {
}
```
```java
public interface EditValidationGroup {
}
```
### 参数字段添加分组
```java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TestValidationGroupParam implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotEmpty(message = "{test.msg.userId.notEmpty}", groups = {EditValidationGroup.class}) 
    private String userId;
}
```
### @Validated注解分组校验

```java
  @PostMapping("testValidationGroup/add")
    public ResponseEntity<TestValidationGroupParam> add(@Validated(AddValidationGroup.class) @RequestBody TestValidationGroupParam param) {
        return ResponseEntity.ok(param);
    }


    @PostMapping("testValidationGroup/edit")
    public ResponseEntity<TestValidationGroupParam> edit(@Validated(EditValidationGroup.class) @RequestBody TestValidationGroupParam param) {
        return ResponseEntity.ok(param);
    }
```
**测试**
![在这里插入图片描述](https://img-blog.csdnimg.cn/ec00e835d27248ed9670da34abaf1a57.png)
### @Validated和@Valid什么区别？
在检验`Controller`的入参是否符合规范时，使用`@Validated`或者`@Valid`在基本验证功能上没有太多区别。但是在分组、注解地方、嵌套验证等功能上两个有所不同

**分组**

* `@Validated`：提供了一个分组功能，可以在入参验证时，根据不同的分组采用不同的验证机制

* `@Valid`：作为标准`JSR-303`规范，还没有吸收分组的功能。

**注解地方**

`@Validated`：可以用在类型、方法和方法参数上。但是不能用在成员属性（字段）上

`@Valid`：可以用在方法、构造函数、方法参数和成员属性（字段）上嵌套类型

### 常用注解

`JSR303/JSR-349`: `JSR303`是一项标准,只提供规范不提供实现，规定一些校验规范即校验注解，如`@Null`，`@NotNull`，`@Pattern`，位于`javax.validation.constraints`包下。`JSR-349`是其的升级版本，添加了一些新特性。

```java
@AssertFalse            被注释的元素只能为false
@AssertTrue             被注释的元素只能为true
@DecimalMax             被注释的元素必须小于或等于{value}
@DecimalMin             被注释的元素必须大于或等于{value}
@Digits                 被注释的元素数字的值超出了允许范围(只允许在{integer}位整数和{fraction}位小数范围内)
@Email                  被注释的元素不是一个合法的电子邮件地址
@Future                 被注释的元素需要是一个将来的时间
@FutureOrPresent        被注释的元素需要是一个将来或现在的时间
@Max                    被注释的元素最大不能超过{value}
@Min                    被注释的元素最小不能小于{value}
@Negative               被注释的元素必须是负数
@NegativeOrZero         被注释的元素必须是负数或零
@NotBlank               被注释的元素不能为空
@NotEmpty               被注释的元素不能为空
@NotNull                被注释的元素不能为null
@Null                   被注释的元素必须为null
@Past                   被注释的元素需要是一个过去的时间
@PastOrPresent          被注释的元素需要是一个过去或现在的时间
@Pattern                被注释的元素需要匹配正则表达式"{regexp}"
@Positive               被注释的元素必须是正数
@PositiveOrZero         被注释的元素必须是正数或零
@Size                   被注释的元素个数必须在{min}和{max}之间
```
### 自定义注解

**自定义校验器**

```java
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class TelephoneNumberValidator implements ConstraintValidator<TelephoneNumber, String> {
    private static final String REGEX_TEL = "0\\d{2,3}[-]?\\d{7,8}|0\\d{2,3}\\s?\\d{7,8}|13[0-9]\\d{8}|15[1089]\\d{8}";

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        try {
            return Pattern.matches(REGEX_TEL, s);
        } catch (Exception e) {
            return false;
        }
    }
}
```

**自定义注解**

```java
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {TelephoneNumberValidator.class}) // 指定校验器
public @interface TelephoneNumber {
    String message() default "Invalid telephone number";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}
```

**参数指定**

```java
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
@Builder
public class TelephoneNumberParam implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotEmpty(message = "{test.msg.userId.notEmpty}", groups = {EditValidationGroup.class})
    private String userId;

    @TelephoneNumber(message = "invalid telephone number")
    private String telephone;
}
```
# 统一异常

## 错误码枚举

```java
/***
 * 错误码和错误信息定义类
 * 1. 错误码定义规则为5为数字
 * 2. 前两位表示业务场景，最后三位表示错误码。例如：100001。10:通用 001:系统未知异常
 * 3. 维护错误码后需要维护错误描述，将他们定义为枚举形式
 * 错误码列表：
 *  10: 通用
 *      001：参数格式校验
 */
public enum BizCodeEnum {
    UNKNOW_EXCEPTION("10000", "系统未知异常"), VAILD_EXCEPTION("10001", "参数格式校验失败");
    private String code;
    private String msg;

    BizCodeEnum(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
```
## 全局异常处理

```java
/**
 * 集中处理所有异常
 */
@Slf4j
@RestControllerAdvice(basePackages = "com.daihao.springbootdemo.controller")
public class ExceptionControllerAdvice {

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public R handleVaildException(MethodArgumentNotValidException e) {
        log.error("数据校验出现问题{}，异常类型：{}", e.getMessage(), e.getClass());
        BindingResult bindingResult = e.getBindingResult();

        Map<String, String> errorMap = new HashMap<>();
        bindingResult.getFieldErrors().forEach((fieldError) -> {
            errorMap.put(fieldError.getField(), fieldError.getDefaultMessage());
        });
        return R.error(BizCodeEnum.VAILD_EXCEPTION.getCode(), BizCodeEnum.VAILD_EXCEPTION.getMsg());

    }

    @ExceptionHandler(value = Throwable.class)
    public R handleException(Throwable throwable) {

        log.error("错误：", throwable);
        return R.error(BizCodeEnum.UNKNOW_EXCEPTION.getCode(), BizCodeEnum.UNKNOW_EXCEPTION.getMsg());
    }

}
```
**测试**
![在这里插入图片描述](https://img-blog.csdnimg.cn/06d41f4f2fb5420986ea11641f598475.png)

