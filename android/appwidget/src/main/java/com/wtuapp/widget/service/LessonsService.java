package com.wtuapp.widget.service;

import com.wtuapp.widget.bean.Lesson;

import java.util.List;

/**
 * @author HuPeng
 * @date 2022-04-01 20:19
 */
public interface LessonsService {

    /**
     * 获取今天的课程
     * @return 课程列表
     */
    List<Lesson> getLessons();

    /**
     * 获取指定星期的课程
     * @param day 哪个星期
     * @return 该星期的课程
     */
    List<Lesson> getLessons(int day);


    /**
     * 获取所有课程
     * @return 所有课程
     */
    List<Lesson> getAllLessons();

    /**
     * 分离某一天的课程
     * @param lessons 课程信息
     * @param day 分离哪个星期的
     * @return 分离后的数据
     */
    List<Lesson> splitLesson(List<Lesson> lessons, int day);



}
