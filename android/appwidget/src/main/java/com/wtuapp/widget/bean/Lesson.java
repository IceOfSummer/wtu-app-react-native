package com.wtuapp.widget.bean;

import java.util.List;

/**
 * @author HuPeng
 * @date 2022-03-31 16:11
 */
public class Lesson {

    /**
     * 用于映射课程开始时间
     */
    public static final String[] CLASS_START_TIME = new String[]{"08:00", "08:50", "09:55", "10:45", "11:35", "14:00", "14:50", "15:55", "16:45", "19:00", "19:50", "20:40"};

    /**
     * 用于映射课程结束时间
     */
    public static final String[] CLASS_END_TIME = new String[]{"08:45", "09:35", "10:40", "11:30", "12:20", "14:45", "15:35", "16:40", "17:30", "19:45", "20:35", "21:25"};


    /**
     * 课程id
     */
    private String id;

    /**
     * 上课开始时间, <b>第一节课为0</b>
     * 如:
     *  - 1 代表第一节课开始上课
     *  - 10 代表第九节课开始上课
     */
    private int beginTime;

    /**
     * 连续上几节课
     * 若 {@link Lesson#beginTime}为 4, duration为3, 代表要上4, 5, 6这三节课
     */
    private int duration;

    /**
     * 星期几的课
     * 1为周一, ..., 7为周日
     */
    private int week;

    /**
     * 课程名称
     */
    private String className;

    /**
     * 上课地点
     */
    private String location;

    /**
     * 课程开始周与结束周信息
     */
    private List<ClassWeekDuration> weekInfo;

    /**
     * 原始数据
     */
    private OriginData origin;

    public static class OriginData {
        private String zcd;

        public String getZcd() {
            return zcd;
        }

        public void setZcd(String zcd) {
            this.zcd = zcd;
        }
    }


    public List<ClassWeekDuration> getWeekInfo() {
        return weekInfo;
    }

    public void setWeekInfo(List<ClassWeekDuration> weekInfo) {
        this.weekInfo = weekInfo;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(int beginTime) {
        this.beginTime = beginTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public String getTimeDuration() {
        int start = beginTime;
        int end = beginTime + duration - 1;
        return CLASS_START_TIME[start] + "-" + CLASS_END_TIME[end];
    }
}
