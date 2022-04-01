package com.wtuapp.widget.mapper.impl;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import androidx.annotation.NonNull;
import com.alibaba.fastjson.JSON;
import com.wtuapp.widget.bean.Lesson;
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

    @NonNull
    @Override
    @SuppressWarnings("unchecked")
    public List<Lesson> getSubjects() {
        try (SQLiteDatabase readableDatabase = helper.getReadableDatabase();
            Cursor query = readableDatabase.query(TABLE_NAME, SELECT_VALUE_ONLY, "key = " + KEY_LESSONS, null, null, null, null)) {
            if (query.moveToFirst()) {
                Map<String, String> map = JSON.parseObject(query.getString(0), Map.class);
                String lessons = map.get("lessons");
                if (lessons == null) {
                    return Collections.emptyList();
                }
                return JSON.parseArray(lessons, Lesson.class);
            } else {
                // empty
                return Collections.emptyList();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @NonNull
    @Override
    public List<Lesson> getSubjects(int day) {
        List<Lesson> subjects = getSubjects();
        // 一天最多5节课
        List<Lesson> curWeekSubjects = new ArrayList<>(5);
        for (Lesson lesson : subjects) {
            if (lesson.getWeek() == day) {
                curWeekSubjects.add(lesson);
            }
        }

        return curWeekSubjects;
    }
}
