package com.wtuapp.utils;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

/**
 * @author HuPeng
 * @date 2022-05-01 15:35
 */
public final class ViewUtils {

    private ViewUtils() {}

    public static void removeSelfFromParent(View child) {
        if (child != null) {
            ViewParent parent = child.getParent();
            if (parent instanceof ViewGroup) {
                ViewGroup viewGroup = (ViewGroup) parent;
                viewGroup.removeView(child);
            }
        }
    }

    public static View getRootView(Activity activity) {
        return activity == null ? null : activity.getWindow().getDecorView().getRootView();
    }
}
