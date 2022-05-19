package com.wtuapp.modules.impl;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.UiThreadUtil;
import com.kongzue.dialogx.dialogs.BottomDialog;
import com.kongzue.dialogx.dialogs.BottomMenu;
import com.kongzue.dialogx.interfaces.DialogLifecycleCallback;
import com.wtuapp.commands.CallbackManager;
import com.wtuapp.modules.BottomMenuModule;

import java.util.ArrayList;

/**
 * @author HuPeng
 * @date 2022-05-19 16:08
 */
public class BottomMenuManager extends ReactContextBaseJavaModule implements BottomMenuModule {

    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Override
    @ReactMethod
    public void showMenu(ReadableArray recipes, Callback onFinish) {
        CallbackManager callbackManager = new CallbackManager(onFinish);
        int size = recipes.size();
        String[] names = new String[size];
        for (int i = 0; i < size; i++) {
            names[i] = recipes.getString(i);
        }


        UiThreadUtil.runOnUiThread(() -> {
            BottomMenu.show(names)
                    .setOnMenuItemClickListener((dialog, text, index) -> {
                        callbackManager.invokeCallback(index, text);
                        return false;
                    })
                    .setDialogLifecycleCallback(new DialogLifecycleCallback<BottomDialog>() {
                        @Override
                        public void onDismiss(BottomDialog dialog) {
                            callbackManager.invokeCallback();
                        }
                    });
        });

    }
}
