package com.wtuapp.widget.mapper;

import androidx.annotation.Nullable;
import com.wtuapp.widget.bean.ClassesTableInfo;

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
    @Nullable
    ClassesTableInfo getClassesTableInfo();



}
