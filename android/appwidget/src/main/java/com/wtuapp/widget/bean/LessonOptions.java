package com.wtuapp.widget.bean;

import java.util.Calendar;

/**
 * @author HuPeng
 * @date 2022-04-01 20:09
 */
public class LessonOptions {

    private int week;

    private long curWeekLastUpdate;


    public void setWeek(int week) {
        this.week = week;
    }

    public long getCurWeekLastUpdate() {
        return curWeekLastUpdate;
    }

    public void setCurWeekLastUpdate(long curWeekLastUpdate) {
        this.curWeekLastUpdate = curWeekLastUpdate;
    }

    /**
     * 获取精准的当前周
     * @return 当前周
     */
    public int getWeek() {
        // 当前周
        Calendar start = Calendar.getInstance();
        start.setTimeInMillis(curWeekLastUpdate);

        Calendar end = Calendar.getInstance();

        // 全设置为周日
        start.set(Calendar.DAY_OF_WEEK, 1);
        end.set(Calendar.DAY_OF_WEEK, 1);


        long gap = end.getTimeInMillis() - start.getTimeInMillis();
        // 转换为day, gap / 秒 / 分 / 时 / 日 / 周
        int weekGap = (int) (gap / 1000 / 60 / 60 / 24);

        return week + weekGap;
    }
}
