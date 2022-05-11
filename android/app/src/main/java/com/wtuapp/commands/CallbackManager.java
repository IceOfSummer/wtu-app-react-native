package com.wtuapp.commands;

import com.facebook.react.bridge.Callback;
import com.wtuapp.utils.CallbackUtils;

/**
 * 回调管理类, 用来保证每个回调只会被调用一次
 * @author HuPeng
 * @date 2022-05-10 22:46
 */
public class CallbackManager {

    private Callback callback;

    public CallbackManager() {
    }

    public CallbackManager(Callback callback) {
        this.callback = callback;
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    public void invokeCallback(Object...args) {
        CallbackUtils.invokeIfNotNull(callback, args);
        callback = null;
    }
}
