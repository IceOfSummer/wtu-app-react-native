package com.wtuapp.widget.mapper.impl;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.alibaba.fastjson.JSON;
import com.wtuapp.widget.bean.ClassesTableInfo;
import com.wtuapp.widget.bean.Lesson;
import com.wtuapp.widget.bean.LessonOptions;
import com.wtuapp.widget.data.SQLiteHelperImpl;
import com.wtuapp.widget.mapper.LessonsMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * @author HuPeng
 * @date 2022-03-31 16:11
 */
public class LessonsMapperImpl implements LessonsMapper {

    private final String[] SELECT_VALUE_ONLY = new String[]{"value"};

    private final String[] SELECT_VALUE_AND_TIMESTAMP = new String[]{"value", "timestamp"};

    private final SQLiteOpenHelper helper;

    public LessonsMapperImpl(Context context) {
        helper = new SQLiteHelperImpl(context, DATABASE_NAME, null, VERSION_CODE);
    }

    @Nullable
    @Override
    @SuppressWarnings("unchecked")
    public ClassesTableInfo getClassesTableInfo() {
        try (SQLiteDatabase readableDatabase = helper.getReadableDatabase();
            Cursor query = readableDatabase.query(TABLE_NAME, SELECT_VALUE_ONLY, "key = " + KEY_LESSONS, null, null, null, null)) {
            if (query.moveToFirst()) {
                Map<String, String> map = JSON.parseObject(query.getString(0), Map.class);
                String lessonsStr = map.get("lessons");
                if (lessonsStr == null) {
                    return null;
                }
                List<Lesson> lessonsList = JSON.parseArray(lessonsStr, Lesson.class);
                String optionsStr = map.get("options");
                if (optionsStr == null) {
                    return null;
                }
                LessonOptions lessonOptions = JSON.parseObject(optionsStr, LessonOptions.class);
                return new ClassesTableInfo(lessonsList, lessonOptions);
            } else {
                // empty
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }



}
