package com.wtuapp.widget.service.impl;

import android.content.Intent;
import android.widget.RemoteViewsService;

import com.wtuapp.widget.factory.LessonsListRemoteViewFactory;

/**
 * @author HuPeng
 * @date 2022-04-01 21:29
 */
public class LessonsListRemoteViewServiceImpl extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new LessonsListRemoteViewFactory(getApplicationContext());
    }
}
