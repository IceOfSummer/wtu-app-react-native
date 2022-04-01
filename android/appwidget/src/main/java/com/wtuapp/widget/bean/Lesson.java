package com.wtuapp.widget.bean;

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
     * 上课开始时间
     * 如:
     *  - 2 代表第二节课开始上课
     *  - 10 代表第十节课开始上课
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
     * 开始周
     */
    private int startWeek;

    /**
     * 结束周
     */
    private int endWeek;

    /**
     * 检查该课程是否正在学习
     * @param curWeek 当前周
     * @return 返回true表示正在学习
     */
    public boolean isStudying(int curWeek) {
        // 1-4周,6-9周
        return startWeek <= curWeek && curWeek <= endWeek;
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

    public int getStartWeek() {
        return startWeek;
    }

    public void setStartWeek(int startWeek) {
        this.startWeek = startWeek;
    }

    public int getEndWeek() {
        return endWeek;
    }

    public void setEndWeek(int endWeek) {
        this.endWeek = endWeek;
    }
}
