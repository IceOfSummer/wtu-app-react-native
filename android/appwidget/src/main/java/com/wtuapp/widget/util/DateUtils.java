package com.wtuapp.widget.util;

/**
 * @author HuPeng
 * @date 2022-04-01 20:35
 */
public class DateUtils {

    private DateUtils() {}

    /**
     * 将星期转换为从星期一为1开始的类型
     * @param day 星期
     * @return 转换后的星期
     */
    public static int castDayToStanderType(int day) {
        if (day == 1) {
            return 7;
        } else {
            return day - 1;
        }
    }
}
