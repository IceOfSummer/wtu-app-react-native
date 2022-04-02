package com.wtuapp.widget.common;

import com.wtuapp.widget.bean.Lesson;

import java.util.List;

/**
 * 用于管理课程表
 * @author HuPeng
 * @date 2022-04-01 21:37
 */
public interface LessonsTableManager {

    /**
     * 能否向下翻页
     * @return 返回true表示可以向下翻页
     */
    boolean haveNextPage();

    /**
     * 能否向上翻页
     * @return 返回true表示可以向上翻页
     */
    boolean havePreviousPage();

    /**
     * 下一页
     * @return 下一页的课程
     * @throws IllegalStateException 已经是最后一页了
     */
    List<Lesson> nextPage() throws IllegalStateException;

    /**
     * 获取当前页的课程
     * @return 当前页的课程
     */
    List<Lesson> curPage();

    /**
     * 获取某一页的课程
     * @param pageIndex 课程索引
     * @return 课程
     * @throws IndexOutOfBoundsException 超出范围
     */
    List<Lesson> getLessons(int pageIndex);

    /**
     * 获取当前页的某一个课程
     * @param index 索引, 最大为1, 最小为0
     * @return 课程
     * @throws IndexOutOfBoundsException 超出范围
     */
    Lesson getLesson(int index);

    /**
     * 上一页
     * @return 上一页的课程
     * @throws IllegalStateException 已经是第一页了
     */
    List<Lesson> previousPage() throws IllegalStateException;


    /**
     * 获取明天的课程
     * @return 明天的课程
     */
    List<Lesson> nextDay();

    /**
     * 获取昨天的课程
     * @return 昨天的课程
     */
    List<Lesson> previousDay();

    /**
     * 强制重新刷新课程表
     */
    void forceReload();

    /**
     * 获取可用页数
     * @return 可用页数
     */
    int getAvailablePage();

    /**
     * 获取当前星期
     */
    int getCurDay();

    String getCurDayAsString();



}
