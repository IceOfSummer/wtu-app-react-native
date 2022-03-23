package com.wtuapp.layout;

import android.content.Context;
import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.scwang.smart.refresh.header.ClassicsHeader;
import com.scwang.smart.refresh.layout.SmartRefreshLayout;

/**
 * @author HuPeng
 * @date 2022-03-23 15:36
 */
public class PullDownRefreshView extends SmartRefreshLayout {

    public PullDownRefreshView(Context context) {
        super(context);
    }

    {
        setEnableRefresh(false);
        setEnableOverScrollDrag(true);
    }




    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        super.onLayout(changed, l, t, r, b);
        setOnRefreshListener(refreshlayout -> {
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "onRefresh",
                    null
            );
        });
    }
}
