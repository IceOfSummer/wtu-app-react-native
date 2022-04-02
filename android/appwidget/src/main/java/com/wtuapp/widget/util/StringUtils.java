package com.wtuapp.widget.util;

/**
 * @author HuPeng
 * @date 2022-04-02 22:26
 */
public class StringUtils {

    private StringUtils() {}


    /**
     * 限制字符串长度, 将超出字符串的部分替换为'.'
     * @param str 原字符串
     * @param maxLength 最大长度
     * @return 处理后的字符串
     */
    public static String limitWords(String str, int maxLength) {
        if (str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }
}
