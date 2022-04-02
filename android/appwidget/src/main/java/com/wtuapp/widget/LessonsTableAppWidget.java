package com.wtuapp.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.RemoteViews;

import com.wtuapp.widget.common.LessonsTableManager;
import com.wtuapp.widget.common.LessonsTableManagerImpl;
import com.wtuapp.widget.service.impl.LessonsListRemoteViewServiceImpl;
import com.wtuapp.widget.service.impl.TimelyUpdateService;

/**
 * @author HuPeng
 * @date 2022-03-31 16:33
 */
public class LessonsTableAppWidget extends AppWidgetProvider {

    public static final String TAG = "LessonsTableAppWidget";

    public static final String ACTION_NEXT_PAGE = "com.wtuapp.widget.NEXT_PAGE";

    public static final String ACTION_PREVIOUS_PAGE = "com.wtuapp.widget.PREVIOUS_PAGE";

    public static final String ACTION_NEXT_DAY = "com.wtuapp.widget.NEXT_DAY";

    public static final String ACTION_PREVIOUS_DAY = "com.wtuapp.widget.PREVIOUS_DAY";

    public static final String ACTION_UPDATE = "com.wtuapp.widget.UPDATE";

    public static final String ACTION_DEFAULT_UPDATE = "android.appwidget.action.APPWIDGET_UPDATE";


    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        super.onUpdate(context, appWidgetManager, appWidgetIds);
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        Intent intent = new Intent(context, TimelyUpdateService.class);
        try {
            context.startService(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent.getAction();
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName cn = new ComponentName(context, LessonsTableAppWidget.class);
        LessonsTableManager lessonsTableManager = LessonsTableManagerImpl.getInstance();
        int[] appWidgetIds = manager.getAppWidgetIds(cn);

        Log.i(TAG, action);
        if (ACTION_NEXT_PAGE.equals(action)) {
            if (lessonsTableManager.haveNextPage()) {
                lessonsTableManager.nextPage();
                onUpdate(context, manager, appWidgetIds);
                manager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.class_list_item);
            }
        } else if (ACTION_PREVIOUS_PAGE.equals(action)) {
            if (lessonsTableManager.havePreviousPage()) {
                lessonsTableManager.previousPage();
                onUpdate(context, manager, appWidgetIds);
                manager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.class_list_item);
            }
        } else if (ACTION_NEXT_DAY.equals(action)) {
            lessonsTableManager.nextDay();
            onUpdate(context, manager, appWidgetIds);
            manager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.class_list_item);
        } else if (ACTION_PREVIOUS_DAY.equals(action)) {
            lessonsTableManager.previousDay();
            onUpdate(context, manager, appWidgetIds);
            manager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.class_list_item);
        } else if (ACTION_UPDATE.equals(action) || ACTION_DEFAULT_UPDATE.equals(action)) {
            lessonsTableManager.reset();
            onUpdate(context, manager, appWidgetIds);
            manager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.class_list_item);
        }

    }

    private void bindClickPendingIntent(RemoteViews remoteViews, int id, String action, Context context) {
        Intent intent = new Intent(context, LessonsTableAppWidget.class);
        intent.setAction(action);
        PendingIntent broadcast = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        remoteViews.setOnClickPendingIntent(id, broadcast);
    }

    private void updateWidget(Context context, int appWidgetId) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.lessons_table_widget_layout);


        Intent intent = new Intent(context, LessonsListRemoteViewServiceImpl.class);

        remoteViews.setRemoteAdapter(R.id.class_list_item, intent);

        bindClickPendingIntent(remoteViews, R.id.left_arrow, ACTION_PREVIOUS_DAY, context);
        bindClickPendingIntent(remoteViews, R.id.right_arrow, ACTION_NEXT_DAY, context);
        bindClickPendingIntent(remoteViews, R.id.subject_flush, ACTION_UPDATE, context);

        LessonsTableManager instance = LessonsTableManagerImpl.getInstance();
        // 设置当前星期
        remoteViews.setTextViewText(R.id.class_week, instance.getCurDayAsString());

        if (instance.havePreviousPage()) {
            remoteViews.setImageViewResource(R.id.up_arrow, R.drawable.up_new);
            bindClickPendingIntent(remoteViews, R.id.up_arrow, ACTION_PREVIOUS_PAGE, context);
        } else {
            remoteViews.setImageViewResource(R.id.up_arrow, R.drawable.up_disable);
        }
        if (instance.haveNextPage()) {
            remoteViews.setImageViewResource(R.id.down_arrow, R.drawable.down_new);
            bindClickPendingIntent(remoteViews, R.id.down_arrow, ACTION_NEXT_PAGE, context);
        } else {
            remoteViews.setImageViewResource(R.id.down_arrow, R.drawable.down_disable);
        }
        appWidgetManager.updateAppWidget(appWidgetId, remoteViews);
    }

}
