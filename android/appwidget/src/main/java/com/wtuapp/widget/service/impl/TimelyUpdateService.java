package com.wtuapp.widget.service.impl;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;

import androidx.annotation.Nullable;

import com.wtuapp.widget.LessonsTableAppWidget;

import java.util.Calendar;

/**
 * @author HuPeng
 * @date 2022-04-02 18:02
 */
public class TimelyUpdateService extends Service {

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        AlarmManager manager = (AlarmManager) getSystemService(ALARM_SERVICE);


        Log.i("service", "start timely service");
        Intent i = new Intent(this, LessonsTableAppWidget.class);
        i.setAction(LessonsTableAppWidget.ACTION_UPDATE);
        PendingIntent broadcast = PendingIntent.getBroadcast(this, 0, i, 0);

        // 1h
        manager.setRepeating(AlarmManager.RTC, System.currentTimeMillis() + 10000L, 3600000L, broadcast);
        return START_REDELIVER_INTENT;
    }

    @Override
    public void onDestroy() {
        AlarmManager manager = (AlarmManager) getSystemService(ALARM_SERVICE);
        Intent intent = new Intent(this, LessonsTableAppWidget.class);
        PendingIntent broadcast = PendingIntent.getBroadcast(this, 0, intent, 0);
        manager.cancel(broadcast);
    }
}
