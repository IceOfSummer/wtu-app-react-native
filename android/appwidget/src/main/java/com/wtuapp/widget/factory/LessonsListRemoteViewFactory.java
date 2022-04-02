package com.wtuapp.widget.factory;

import android.content.Context;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import com.wtuapp.widget.R;
import com.wtuapp.widget.bean.Lesson;
import com.wtuapp.widget.common.LessonsTableManager;
import com.wtuapp.widget.common.LessonsTableManagerImpl;
import com.wtuapp.widget.util.StringUtils;

/**
 * @author HuPeng
 * @date 2022-04-01 21:30
 */
public class LessonsListRemoteViewFactory implements RemoteViewsService.RemoteViewsFactory {

    public static final String TAG = "LessonsWidgetVF";

    private final Context context;

    public static LessonsTableManager lessonsTableManager = LessonsTableManagerImpl.getInstance();

    public LessonsListRemoteViewFactory(Context context) {
        this.context = context;
    }

    @Override
    public void onCreate() {

    }

    @Override
    public void onDataSetChanged() {
        Log.i(TAG, "onDataSetChanged");
    }

    @Override
    public void onDestroy() {

    }

    @Override
    public int getCount() {
        if (lessonsTableManager.getAvailablePage() == 0) {
            // 没有课
            return 1;
        }
        return 2;
    }

    @Override
    public RemoteViews getViewAt(int position) {
        Log.i(TAG, "load pos: " + position);
        if (lessonsTableManager.getAvailablePage() == 0) {
            // 没有课
            Log.i(TAG, "no class");
            return new RemoteViews(context.getPackageName(), R.layout.no_lessons_item);
        }
        Lesson lesson;
        Log.i(TAG, "load class");
        try {
            lesson = lessonsTableManager.getLesson(position);
        } catch (IndexOutOfBoundsException e) {
            return new RemoteViews(context.getPackageName(), R.layout.empty_lesson_item);
        }
        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.lesson_ltem);

        int begin = lesson.getBeginTime() + 1;
        int end = begin + lesson.getDuration() - 1;
        remoteViews.setTextViewText(R.id.class_time, begin + "-" + end);
        remoteViews.setTextViewText(R.id.class_name, StringUtils.limitWords(lesson.getClassName(), 15));
        remoteViews.setTextViewText(R.id.class_location, lesson.getLocation());
        remoteViews.setTextViewText(R.id.class_real_time, lesson.getTimeDuration());

        return remoteViews;
    }

    @Override
    public RemoteViews getLoadingView() {
        return new RemoteViews(context.getPackageName(), R.layout.lessons_loading_layout);
    }

    @Override
    public int getViewTypeCount() {
        return 3;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }
}
