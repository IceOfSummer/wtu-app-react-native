package com.wtuapp.widget.service.impl;

import android.content.Context;

import com.wtuapp.widget.bean.ClassWeekDuration;
import com.wtuapp.widget.bean.ClassesTableInfo;
import com.wtuapp.widget.bean.Lesson;
import com.wtuapp.widget.bean.LessonOptions;
import com.wtuapp.widget.mapper.LessonsMapper;
import com.wtuapp.widget.mapper.impl.LessonsMapperImpl;
import com.wtuapp.widget.service.LessonsService;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;

/**
 * @author HuPeng
 * @date 2022-04-01 20:19
 */
public class LessonsServiceImpl implements LessonsService {

    private final LessonsMapper lessonsMapper;

    public LessonsServiceImpl(Context context) {
        this.lessonsMapper = new LessonsMapperImpl(context);
    }

    @Override
    public List<Lesson> getLessons() {
        // 获取当前星期
        int curDay = Calendar.getInstance().get(Calendar.DAY_OF_WEEK);
        // 让星期从1为星期一开始
        curDay = curDay == 1 ? 7 : curDay - 1;
        return getLessons(curDay);
    }

    @Override
    public List<Lesson> getLessons(int day) {
        ClassesTableInfo subjects = lessonsMapper.getClassesTableInfo();
        if (subjects == null) {
            return Collections.emptyList();
        }
        ArrayList<Lesson> activeLessons = clearInactiveLesson(subjects);

        return splitLesson(activeLessons, day);
    }

    @Override
    public List<Lesson> getAllLessons() {
        ClassesTableInfo subjects = lessonsMapper.getClassesTableInfo();
        if (subjects == null) {
            return Collections.emptyList();
        }
        return clearInactiveLesson(subjects);
    }

    @Override
    public List<Lesson> splitLesson(List<Lesson> lessons, int day) {
        ArrayList<Lesson> arr = new ArrayList<>(6);
        for (Lesson lesson : lessons) {
            if (lesson.getWeek() == day) {
                arr.add(lesson);
            }
        }
        return arr;
    }

    /**
     * 过滤课程, 清除还未开始或者已经结课的课程
     * @return 过滤后的课程
     */
    private ArrayList<Lesson> clearInactiveLesson(ClassesTableInfo info) {
        LessonOptions options = info.getLessonOptions();

        int curWeek = options.getWeek();
        ArrayList<Lesson> arr = new ArrayList<>(info.getLessons().size());
        for (Lesson lesson : info.getLessons()) {
            for (ClassWeekDuration classWeekDuration : lesson.getWeekInfo()) {
                if (classWeekDuration.getStartWeek() <= curWeek && curWeek <= classWeekDuration.getEndWeek()) {
                    arr.add(lesson);
                    break;
                }
            }
        }
        return arr;
    }


}
