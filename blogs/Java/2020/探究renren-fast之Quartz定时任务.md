---
title: 探究renren-fast之Quartz定时任务
date: 2020-12-25
categories:
 - Java
tags:
 - renren-fast
 - Quartz
---


## 探究renren-fast之Quartz定时任务

>Quartz是OpenSymphony开源组织在Job scheduling领域又一个开源项目，完全由Java开发.可以用来执行定时任务，类似于java.util.Timer。

但是相较于Timer， Quartz增加了很多功能：

> 持久性作业 - 就是保持调度定时的状态;
> 作业管理 - 对调度作业进行有效的管理.

Quartz的调度器、任务和触发器
>
> Scheduler
> 代表一个 Quartz的独立运行容器。Trigger和JobDetail可以注册到Scheduler中。Scheduler可以将Trigger绑定到某一JobDetail上，这样当Trigger被触发时，对应的Job就会执行。一个Job可以对应多个Trigger，但一个Trigger只能对应一个Job.

> Job
> 是一个接口，有一个方法void execute()，可以通过实现该接口来定义需要执行的任务

> JobDetail:
> Quartz 每次执行job时，都重新创建一个Job实例，会接收一个Job实现类，以便运行的时候通过newInstance()的反射调用机制去实例化Job.JobDetail是用来描述Job实现类以及相关静态信息，比如任务在scheduler中的组名等信息

> Trigger
> 描述触发Job执行的时间触发规则实现类SimpleTrigger和CronTrigger，可以通过crom表达式定义出各种复杂的调度方案

> Calendar
> 是一些日历特定时间的集合。一个Trigger可以和多个 calendar关联,比如每周一早上10:00执行任务，法定假日不执行， 则可以通过calendar进行定点排除

## 一、数据库

-- 定时任务

```sql
CREATE TABLE `schedule_job` (
  `job_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务id',
  `bean_name` varchar(200) DEFAULT NULL COMMENT 'spring bean名称',
  `params` varchar(2000) DEFAULT NULL COMMENT '参数',
  `cron_expression` varchar(100) DEFAULT NULL COMMENT 'cron表达式',
  `status` tinyint(4) DEFAULT NULL COMMENT '任务状态  0：正常  1：暂停',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`job_id`)
) ENGINE=`InnoDB` DEFAULT CHARACTER SET utf8mb4 COMMENT='定时任务';
```

-- 定时任务日志

```sql
CREATE TABLE `schedule_job_log` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务日志id',
  `job_id` bigint(20) NOT NULL COMMENT '任务id',
  `bean_name` varchar(200) DEFAULT NULL COMMENT 'spring bean名称',
  `params` varchar(2000) DEFAULT NULL COMMENT '参数',
  `status` tinyint(4) NOT NULL COMMENT '任务状态    0：成功    1：失败',
  `error` varchar(2000) DEFAULT NULL COMMENT '失败信息',
  `times` int(11) NOT NULL COMMENT '耗时(单位：毫秒)',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`log_id`),
  KEY `job_id` (`job_id`)
) ENGINE=`InnoDB` DEFAULT CHARACTER SET utf8mb4 COMMENT='定时任务日志';
```



## 二、依赖

pom.xml

```java
<quartz.version>2.3.0</quartz.version>
```

```java
<dependency>
	<groupId>org.quartz-scheduler</groupId>
	<artifactId>quartz</artifactId>
	<version>${quartz.version}</version>
	<exclusions>
		<exclusion>
			<groupId>com.mchange</groupId>
			<artifactId>c3p0</artifactId>
		</exclusion>
	</exclusions>
</dependency>
```

当然还有一些数据库依赖需要添加，这里就不贴出来了，如果想自己实现简单的可以参考以下依赖

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.daihao</groupId>
    <artifactId>schedule</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>schedule</name>


    <properties>
        <java.version>1.8</java.version>
        <mybatis-plus.version>3.1.1</mybatis-plus.version>
        <mysql-connection.version>5.1.38</mysql-connection.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--quartz依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-quartz</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>
        <!--druid连接池-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.10</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql-connection.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

        </plugins>
    </build>

</project>
```

这里还可以使用了spring-boot-devtools在idea中实现热部署，方便开发时调试

spring-boot-devtools支持在classpath修改任何文件项目都将会自动重启。一些资源无需触发重启，例如thymeleaf模板文件就可以实时编辑。默认情况下，更改/META-INF/maven，/META-INF/resources ，/resources ，/static ，/public 或/templates下的资源不会触发重启，而是触发livereload。devtools模块包含一个嵌入的livereload服务器，可以在资源变化时用来触发浏览器刷新。浏览器需要在livereload.com下载安装扩展。 例如Chrome浏览器在应用商店安装livereload插件后，在要自动刷新的页面点击对应的图标，启动应用后更新页面内容或者css等都会触发页面自动刷新

**livereload**

　　livereload 通过引入的脚本livereload.js在 livereload 服务和浏览器之间建立了一个 WebSocket 连接。每当监测到文件的变动，livereload 服务就会向浏览器发送一个信号，浏览器收到信号后就刷新页面，实现了实时刷新的效果。

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWFnZXMyMDE3LmNuYmxvZ3MuY29tL2Jsb2cvMzc2MTAyLzIwMTcxMC8zNzYxMDItMjAxNzEwMTkxMDAwMTkwODQtMTgyODMxOTAxMi5wbmc?x-oss-process=image/format,png)

spring-boot-devtools的简单使用则是引入依赖，修改IDEA自动编译

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410160550537.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)



启动项目看见使用的加载器就变为了 restartedMain 了，说明热部署已经成功

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410160540987.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

想要禁止热部署可以在application.properties中设置

```
spring.devtools.restart.enabled=false
```

**测试**
(1)修改类 应用会重启
(2)修改配置文件 应用会重启
(3)修改静态文件（html、css等），应用不会重启，但是会调用livereload，浏览器会自动刷新，显示最新的修改内容。

## 三、配置文件application.properties

最基础的配置

```java
server.port=8888
spring.datasource.url:jdbc:mysql://localhost:3306/cron?useSSL=false
spring.datasource.username:root
spring.datasource.password:root
```

这一步配置定时任务线程池和集群，简单Demo的的话可以不配置

```Java
/**
 * Copyright (c) 2016-2019 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package io.renren.modules.job.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * 定时任务配置
 *
 * @author Mark sunlightcs@gmail.com
 */
@Configuration
public class ScheduleConfig {

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(DataSource dataSource) {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        factory.setDataSource(dataSource);

        //quartz参数
        Properties prop = new Properties();
        prop.put("org.quartz.scheduler.instanceName", "RenrenScheduler");
        prop.put("org.quartz.scheduler.instanceId", "AUTO");
        //线程池配置
        prop.put("org.quartz.threadPool.class", "org.quartz.simpl.SimpleThreadPool");
        prop.put("org.quartz.threadPool.threadCount", "20");
        prop.put("org.quartz.threadPool.threadPriority", "5");
        //JobStore配置
        prop.put("org.quartz.jobStore.class", "org.quartz.impl.jdbcjobstore.JobStoreTX");
        //集群配置
        prop.put("org.quartz.jobStore.isClustered", "true");
        prop.put("org.quartz.jobStore.clusterCheckinInterval", "15000");
        prop.put("org.quartz.jobStore.maxMisfiresToHandleAtATime", "1");

        prop.put("org.quartz.jobStore.misfireThreshold", "12000");
        prop.put("org.quartz.jobStore.tablePrefix", "QRTZ_");
        prop.put("org.quartz.jobStore.selectWithLockSQL", "SELECT * FROM {0}LOCKS UPDLOCK WHERE LOCK_NAME = ?");

        //PostgreSQL数据库，需要打开此注释
        //prop.put("org.quartz.jobStore.driverDelegateClass", "org.quartz.impl.jdbcjobstore.PostgreSQLDelegate");

        factory.setQuartzProperties(prop);

        factory.setSchedulerName("RenrenScheduler");
        //延时启动
        factory.setStartupDelay(30);
        factory.setApplicationContextSchedulerContextKey("applicationContextKey");
        //可选，QuartzScheduler 启动时更新己存在的Job，这样就不用每次修改targetObject后删除qrtz_job_details表对应记录了
        factory.setOverwriteExistingJobs(true);
        //设置自动启动，默认为true
        factory.setAutoStartup(true);

        return factory;
    }
}

```

## 四、实体类

```java
/**
 * Copyright (c) 2016-2019 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package io.renren.modules.job.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;

/**
 * 定时任务 
 */
@Data
@TableName("schedule_job")
public class ScheduleJobEntity implements Serializable {
   private static final long serialVersionUID = 1L;
   
   /**
    * 任务调度参数key
    */
    public static final String JOB_PARAM_KEY = "JOB_PARAM_KEY";
   
   /**
    * 任务id
    */
   @TableId
   private Long jobId;

   /**
    * spring bean名称
    */
   @NotBlank(message="bean名称不能为空")
   private String beanName;
   
   /**
    * 参数
    */
   private String params;
   
   /**
    * cron表达式
    */
   @NotBlank(message="cron表达式不能为空")
   private String cronExpression;

   /**
    * 任务状态
    */
   private Integer status;

   /**
    * 备注
    */
   private String remark;

   /**
    * 创建时间
    */
   @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
   private Date createTime;

}
```

接下来就是对数据库crud，创建dao，mapper。例

```java
<!-- 批量更新状态 -->
<update id="updateBatch">
   update schedule_job set status = #{status} where job_id in
   <foreach item="jobId" collection="list"  open="(" separator="," close=")">
      #{jobId}
   </foreach>
</update>


<sql id="common_if">
   <if test="field != null and field != ''">
      order by #{field} #{sort}
   </if>
   <if test="start != null and start != 0">
      limit #{start},#{limit}
   </if>
</sql>

<select id="list" resultType="com.daihao.schedule.entity.ScheduleJobEntity">
   select * from schedule_job
   <include refid="common_if" />
</select>
<select id="count" resultType="int">
   select count(1) from schedule_job
   <include refid="common_if" />
</select>
```

## 五、ScheduleJob主要类

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410160603869.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
Job是Quartz中的一个接口，接口下只有execute方法，在这个方法中编写业务逻辑。理解：**Job就是一个工作，是要干什么，代码里面就是一个列，这个类就是这个任务要做什么事情。**

```java

/**
 * Copyright (c) 2016-2019 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package io.renren.modules.job.utils;

import io.renren.common.exception.RRException;
import io.renren.common.utils.Constant;
import io.renren.modules.job.entity.ScheduleJobEntity;
import org.quartz.*;

/**
 * 定时任务
 */
public class ScheduleJob extends QuartzJobBean {
	private Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * 重写其默认执行的方法
	 * @param context
	 * @throws JobExecutionException
	 * JobExecutionContext：
	 * (1)当Scheduler调用一个Job，就会将JobExecutionContext传递给job的execute方法，
	 * quartz无法调用job的有参构造函数，所以创建job的实例的时候是运用反射机制，
	 * 通过newInstance创建实例，并且通过JobDetail描述的name与group属性然后给Job设置一些属性。
	 * (2)Job能通过JobExecutionContext对象访问到Quartz运行时候的环境以及Job本身的明细数据。

	 * JobDetail:
	 * (1)用来绑定Job，为Job实例提供许多属性：name、group、jobClass、jobDataMap
	 * (2)JobDetail绑定指定的Job，每次Scheduler调度执行一个Job的时候，首先会拿到对应的Job，
	 * 然后创建该Job实例，再去执行Job中的execute()的内容，任务执行结束后，关联的Job对象实例会被释放，且会被JVM GC清除。

	 * 为什么设计成JobDetail + Job，不直接使用Job
	 * JobDetail定义的是任务数据，而真正的执行逻辑是在Job中。
	 * 这是因为任务是有可能并发执行，如果Scheduler直接使用Job，就会存在对同一个Job实例并发访问的问题。
	 * 而JobDetail & Job 方式，Sheduler每次执行，都会根据JobDetail创建一个新的Job实例，这样就可以规避并发访问的问题。


	 * JobDataMap：
	 * (1)在进行任务调度时JobDataMap存储在JobExecutionContext中，非常方便获取
	 * (2)JobDataMap可以用来装载任何可以序列化的数据对象，当job实例对象被执行时这些参数对象会传递给它
	 * (3)JobDataMap实现了JDK的Map接口，并且添加了一些非常方便的方法用来存取数据基本数据类型。
	 */
    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
    	//  public JobDataMap getMergedJobDataMap();
        ScheduleJobEntity scheduleJob = (ScheduleJobEntity) context.getMergedJobDataMap().get(ScheduleJobEntity.JOB_PARAM_KEY);
        
        //获取spring bean
        ScheduleJobLogService scheduleJobLogService = (ScheduleJobLogService) SpringContextUtils.getBean("scheduleJobLogService");
        
        //数据库保存执行记录
        ScheduleJobLogEntity log = new ScheduleJobLogEntity();
        log.setJobId(scheduleJob.getJobId());
        log.setBeanName(scheduleJob.getBeanName());
        log.setParams(scheduleJob.getParams());
        log.setCreateTime(new Date());
        
        //任务开始时间
        long startTime = System.currentTimeMillis();
        
        try {
            //执行任务
        	logger.debug("任务准备执行，任务ID：" + scheduleJob.getJobId());

			Object target = SpringContextUtils.getBean(scheduleJob.getBeanName());
			Method method = target.getClass().getDeclaredMethod("run", String.class);
			method.invoke(target, scheduleJob.getParams());
			
			//任务执行总时长
			long times = System.currentTimeMillis() - startTime;
			log.setTimes((int)times);
			//任务状态    0：成功    1：失败
			log.setStatus(0);
			
			logger.debug("任务执行完毕，任务ID：" + scheduleJob.getJobId() + "  总共耗时：" + times + "毫秒");
		} catch (Exception e) {
			logger.error("任务执行失败，任务ID：" + scheduleJob.getJobId(), e);
			
			//任务执行总时长
			long times = System.currentTimeMillis() - startTime;
			log.setTimes((int)times);
			
			//任务状态    0：成功    1：失败
			log.setStatus(1);
			log.setError(StringUtils.substring(e.toString(), 0, 2000));
		}finally {
			scheduleJobLogService.save(log);
		}
    }
}


```

```java




/**
 * Copyright (c) 2016-2019 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package io.renren.modules.job.utils;

import io.renren.common.exception.RRException;
import io.renren.common.utils.Constant;
import io.renren.modules.job.entity.ScheduleJobEntity;
import org.quartz.*;

/**
 * 定时任务工具类
 *
 * Trigger是Quartz的触发器，会去通知Scheduler何时去执行对应Job。
 *
 */
public class ScheduleUtils {
    private final static String JOB_NAME = "TASK_";
    
    /**
     * 获取触发器key
     * TriggerKey：唯一标识一个Trigger
     *            键由双方的名称和组，并且名称必须是该组中唯一。 如果仅指定一个名称，然后将使用默认组名DEFAULT
     *            所有类型的trigger都有TriggerKey这个属性，表示trigger的身份
     */
    public static TriggerKey getTriggerKey(Long jobId) {
        return TriggerKey.triggerKey(JOB_NAME + jobId);
    }
    
    /**
     * 获取jobKey
     * JobKey是表明Job身份的一个对象，里面封装了Job的name和group
     */
    public static JobKey getJobKey(Long jobId) {
        return JobKey.jobKey(JOB_NAME + jobId);
    }

    /**
     * 获取表达式触发器
     * CronTrigger CronTrigger功能非常强大，是基于日历的作业调度，CroTrigger是基于Cron表达式的
     */
    public static CronTrigger getCronTrigger(Scheduler scheduler, Long jobId) {
        try {
            return (CronTrigger) scheduler.getTrigger(getTriggerKey(jobId));
        } catch (SchedulerException e) {
            throw new RRException("获取定时任务CronTrigger出现异常", e);
        }
    }

    /**
     * 创建定时任务
     */
    public static void createScheduleJob(Scheduler scheduler, ScheduleJobEntity scheduleJob) {
        try {
           //构建job信息
            JobDetail jobDetail = JobBuilder.newJob(ScheduleJob.class).withIdentity(getJobKey(scheduleJob.getJobId())).build();

            //表达式调度构建器
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression())
                  .withMisfireHandlingInstructionDoNothing();

            //按新的cronExpression表达式构建一个新的trigger
            CronTrigger trigger = TriggerBuilder.newTrigger().withIdentity(getTriggerKey(scheduleJob.getJobId())).withSchedule(scheduleBuilder).build();

            //放入参数，运行时的方法可以获取
            jobDetail.getJobDataMap().put(ScheduleJobEntity.JOB_PARAM_KEY, scheduleJob);

            scheduler.scheduleJob(jobDetail, trigger);
            
            //暂停任务
            if(scheduleJob.getStatus() == Constant.ScheduleStatus.PAUSE.getValue()){
               pauseJob(scheduler, scheduleJob.getJobId());
            }
        } catch (SchedulerException e) {
            throw new RRException("创建定时任务失败", e);
        }
    }
    
    /**
     * 更新定时任务
     */
    public static void updateScheduleJob(Scheduler scheduler, ScheduleJobEntity scheduleJob) {
        try {
            TriggerKey triggerKey = getTriggerKey(scheduleJob.getJobId());

            //表达式调度构建器
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression())
                  .withMisfireHandlingInstructionDoNothing();

            CronTrigger trigger = getCronTrigger(scheduler, scheduleJob.getJobId());
            
            //按新的cronExpression表达式重新构建trigger
            trigger = trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
            
            //参数
            trigger.getJobDataMap().put(ScheduleJobEntity.JOB_PARAM_KEY, scheduleJob);
            
            scheduler.rescheduleJob(triggerKey, trigger);
            
            //暂停任务
            if(scheduleJob.getStatus() == Constant.ScheduleStatus.PAUSE.getValue()){
               pauseJob(scheduler, scheduleJob.getJobId());
            }
            
        } catch (SchedulerException e) {
            throw new RRException("更新定时任务失败", e);
        }
    }

    /**
     * 立即执行任务
     */
    public static void run(Scheduler scheduler, ScheduleJobEntity scheduleJob) {
        try {
           //参数
           JobDataMap dataMap = new JobDataMap();
           dataMap.put(ScheduleJobEntity.JOB_PARAM_KEY, scheduleJob);
           
            scheduler.triggerJob(getJobKey(scheduleJob.getJobId()), dataMap);
        } catch (SchedulerException e) {
            throw new RRException("立即执行定时任务失败", e);
        }
    }

    /**
     * 暂停任务
     */
    public static void pauseJob(Scheduler scheduler, Long jobId) {
        try {
            scheduler.pauseJob(getJobKey(jobId));
        } catch (SchedulerException e) {
            throw new RRException("暂停定时任务失败", e);
        }
    }

    /**
     * 恢复任务
     */
    public static void resumeJob(Scheduler scheduler, Long jobId) {
        try {
            scheduler.resumeJob(getJobKey(jobId));
        } catch (SchedulerException e) {
            throw new RRException("暂停定时任务失败", e);
        }
    }

    /**
     * 删除定时任务
     */
    public static void deleteScheduleJob(Scheduler scheduler, Long jobId) {
        try {
            scheduler.deleteJob(getJobKey(jobId));
        } catch (SchedulerException e) {
            throw new RRException("删除定时任务失败", e);
        }
    }
}
```

项目启动
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410155922182.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

在线生成Cron表达式的工具：http://cron.qqe2.com/ 来生成自己想要的表达式

![这里写图片描述](https://img-blog.csdn.net/20180710135623995?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25vYW1hbl93Z3M=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



定时任务实现类

```Java
/**
 * Copyright (c) 2016-2019 人人开源 All rights reserved.
 * <p>
 * https://www.renren.io
 * <p>
 * 版权所有，侵权必究！
 */

package io.renren.modules.job.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import io.renren.common.utils.Constant;
import io.renren.common.utils.PageUtils;
import io.renren.common.utils.Query;
import io.renren.modules.job.dao.ScheduleJobDao;
import io.renren.modules.job.entity.ScheduleJobEntity;
import io.renren.modules.job.service.ScheduleJobService;
import io.renren.modules.job.utils.ScheduleUtils;
import org.apache.commons.lang.StringUtils;
import org.quartz.CronTrigger;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.*;

@Service("scheduleJobService")
public class ScheduleJobServiceImpl extends ServiceImpl<ScheduleJobDao, ScheduleJobEntity> implements ScheduleJobService {
    @Autowired
    private Scheduler scheduler;

    /**
     * 项目启动时，初始化定时器
     */
    @PostConstruct
    public void init() {
        List<ScheduleJobEntity> scheduleJobList = this.list();
        for (ScheduleJobEntity scheduleJob : scheduleJobList) {
            CronTrigger cronTrigger = ScheduleUtils.getCronTrigger(scheduler, scheduleJob.getJobId());
            //如果不存在，则创建
            if (cronTrigger == null) {
                ScheduleUtils.createScheduleJob(scheduler, scheduleJob);
            } else {
                ScheduleUtils.updateScheduleJob(scheduler, scheduleJob);
            }
        }
    }

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        String beanName = (String) params.get("beanName");

        IPage<ScheduleJobEntity> page = this.page(
                new Query<ScheduleJobEntity>().getPage(params),
                new QueryWrapper<ScheduleJobEntity>().like(StringUtils.isNotBlank(beanName), "bean_name", beanName)
        );

        return new PageUtils(page);
    }

    /**
     * 保存定时任务
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveJob(ScheduleJobEntity scheduleJob) {
        scheduleJob.setCreateTime(new Date());
        scheduleJob.setStatus(Constant.ScheduleStatus.NORMAL.getValue());
        this.save(scheduleJob);

        ScheduleUtils.createScheduleJob(scheduler, scheduleJob);
    }

    /**
     * 更新定时任务
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(ScheduleJobEntity scheduleJob) {
        ScheduleUtils.updateScheduleJob(scheduler, scheduleJob);

        this.updateById(scheduleJob);
    }

    /**
     * 批量删除定时任务
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBatch(Long[] jobIds) {
        for (Long jobId : jobIds) {
            ScheduleUtils.deleteScheduleJob(scheduler, jobId);
        }

        //删除数据
        this.removeByIds(Arrays.asList(jobIds));
    }

    /**
     * 批量更新定时任务状态
     */
    @Override
    public int updateBatch(Long[] jobIds, int status) {
        Map<String, Object> map = new HashMap<>(2);
        map.put("list", jobIds);
        map.put("status", status);
        return baseMapper.updateBatch(map);
    }

    /**
     * 立即执行
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void run(Long[] jobIds) {
        for (Long jobId : jobIds) {
            ScheduleUtils.run(scheduler, this.getById(jobId));
        }
    }

    /**
     * 暂停运行
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void pause(Long[] jobIds) {
        for (Long jobId : jobIds) {
            ScheduleUtils.pauseJob(scheduler, jobId);
        }

        updateBatch(jobIds, Constant.ScheduleStatus.PAUSE.getValue());
    }

    /**
     * 恢复运行
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resume(Long[] jobIds) {
        for (Long jobId : jobIds) {
            ScheduleUtils.resumeJob(scheduler, jobId);
        }

        updateBatch(jobIds, Constant.ScheduleStatus.NORMAL.getValue());
    }

}

   /**
     * 暂停运行
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void pause(Long[] jobIds) {
        for (Long jobId : jobIds) {
            ScheduleUtils.pauseJob(scheduler, jobId);
        }

        updateBatch(jobIds, Constant.ScheduleStatus.PAUSE.getValue());
    }

    /**
     * 恢复运行
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resume(Long[] jobIds) {
        for (Long jobId : jobIds) {
            ScheduleUtils.resumeJob(scheduler, jobId);
        }

        updateBatch(jobIds, Constant.ScheduleStatus.NORMAL.getValue());
    }

}
```

前端页面

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410160426975.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

Quartz是一个单独的项目，不光可以用SpringBoot，用其他的也是可以的。使用Quartz大体思路就是自定义任务，自定义各种触发器，然后交由调度器来执行任务。renrenfast也不仅只有定时任务，这里也只学习到皮毛，如果不想用renren-fast，其实可以cv大法借鉴一下搞个自己版的。

[简单Demo](https://pan.baidu.com/s/1BG3wwXGbMyYkLadoykpwEQ )，提取码：y7sw
