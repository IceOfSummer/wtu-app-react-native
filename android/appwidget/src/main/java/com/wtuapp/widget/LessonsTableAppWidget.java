package com.wtuapp.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.util.Log;
import android.widget.RemoteViews;

import com.wtuapp.widget.bean.Lesson;

import java.util.List;
import com.wtuapp.widget.mapper.LessonsMapper;
import com.wtuapp.widget.mapper.impl.LessonsMapperImpl;

/**
 * @author HuPeng
 * @date 2022-03-31 16:33
 */
public class LessonsTableAppWidget extends AppWidgetProvider {

    public static final String TAG = "LessonsTableAppWidget";

    private LessonsMapper lessonsMapper;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        super.onUpdate(context, appWidgetManager, appWidgetIds);
        preCheck(context);
        for (int appWidgetId : appWidgetIds) {
            RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.lessons_table_widget_layout);
            List<Lesson> subjects = lessonsMapper.getSubjects();
            remoteViews.setTextViewText(R.id.test, subjects.get(0).getClassName());
            appWidgetManager.updateAppWidget(appWidgetId, remoteViews);
        }
    }

    @Override
    public void onEnabled(Context context) {
        Log.i(TAG, "init");
        this.lessonsMapper = new LessonsMapperImpl(context);
    }

    private void preCheck(Context context) {
        if (lessonsMapper == null) {
            lessonsMapper = new LessonsMapperImpl(context);
        }
    }
}
