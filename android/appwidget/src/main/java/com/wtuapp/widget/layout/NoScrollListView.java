package com.wtuapp.widget.layout;

import android.content.Context;
import android.view.MotionEvent;
import android.widget.ListView;

/**
 * @author HuPeng
 * @date 2022-04-02 17:46
 */
public class NoScrollListView extends ListView {

    public NoScrollListView(Context context) {
        super(context);
    }


    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        return false;
    }
}
