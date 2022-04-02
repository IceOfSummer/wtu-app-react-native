package com.wtuapp.widget.bean;

import java.util.List;

/**
 * 课程表信息
 * @author HuPeng
 * @date 2022-04-01 20:13
 * @see Lesson
 * @see LessonOptions
 */
public class ClassesTableInfo {

    private List<Lesson> lessons;

    private LessonOptions lessonOptions;

    public ClassesTableInfo(List<Lesson> lessons, LessonOptions lessonOptions) {
        this.lessons = lessons;
        this.lessonOptions = lessonOptions;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public LessonOptions getLessonOptions() {
        return lessonOptions;
    }

    public void setLessonOptions(LessonOptions lessonOptions) {
        this.lessonOptions = lessonOptions;
    }
}
