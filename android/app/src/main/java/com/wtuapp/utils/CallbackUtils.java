package com.wtuapp.utils;

import com.facebook.react.bridge.Callback;

/**
 * @author HuPeng
 * @date 2022-05-02 13:42
 */
public final class CallbackUtils {

    private CallbackUtils() {}

    public static void invokeIfNotNull(Callback callback, Object...args) {
        if (callback != null) {
            callback.invoke(args);
        }
    }
}
