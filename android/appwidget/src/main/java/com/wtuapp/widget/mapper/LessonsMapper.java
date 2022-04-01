package com.wtuapp.widget.mapper;

import androidx.annotation.NonNull;

import com.wtuapp.widget.bean.Lesson;
import java.util.List;

/**
 * @author HuPeng
 * @date 2022-03-31 16:10
 */
public interface LessonsMapper {

    String DATABASE_NAME = "RKStorage";

    String TABLE_NAME = "catalystLocalStorage";

    /**
     * 课程表保存的key
     */
    String KEY_LESSONS = "\"persist:lessons\"";

    int VERSION_CODE = 1;


    /**
     * 获取课程表
     * @return 课程表信息
     */
    @NonNull
    List<Lesson> getSubjects();

    /**
     * 获取某一个星期下的课程
     * @param day 指定的星期
     * @return 课程表信息
     */
    @NonNull
    List<Lesson> getSubjects(int day);



}
