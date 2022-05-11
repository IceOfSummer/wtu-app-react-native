package com.wtuapp.modules.impl;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.interfaces.DialogLifecycleCallback;
import com.wtuapp.commands.CallbackManager;
import com.wtuapp.modules.BeautifulAlertDialogModule;
import com.wtuapp.utils.CallbackUtils;

/**
 * IOS样式的对话框
 * @author HuPeng
 * @date 2022-04-03 13:34
 */
public class BeautifulAlertDialogManager extends ReactContextBaseJavaModule implements BeautifulAlertDialogModule {


    public static final String DEFAULT_CONFIRM_TEXT =  "确定";

    public static final String DEFAULT_CANCEL_TEXT = "取消";


    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }


    /**
     * 显示对话框
     */
    @Override
    @ReactMethod
    public void showDialog(String title, String message, String confirmBtnText, String cancelBtnText, Callback onFinish) {
        String confirmText = confirmBtnText == null ? DEFAULT_CONFIRM_TEXT : confirmBtnText;
        String cancelText = cancelBtnText == null ? DEFAULT_CANCEL_TEXT : cancelBtnText;

        CallbackManager callbackManager = new CallbackManager(onFinish);

        MessageDialog.build()
                .setTitle(title)
                .setMessage(message)
                .setDialogLifecycleCallback(new DialogLifecycleCallback<MessageDialog>() {
                    @Override
                    public void onDismiss(MessageDialog dialog) {
                        callbackManager.invokeCallback(false);
                    }
                })
                .setOkButton(confirmText, (baseDialog, v) -> {
                    callbackManager.invokeCallback(true);
                    return false;
                })
                .setCancelButton(cancelText).show();
    }

    /**
     * 显示只有一个按钮的对话框
     */
    @Override
    @ReactMethod
    public void showSingleButtonDialog(String title, String message, String btnText, Callback onFinish) {
        String confirmBtnText = btnText == null ? DEFAULT_CONFIRM_TEXT : btnText;

        CallbackManager callbackManager = new CallbackManager(onFinish);

        MessageDialog.build()
                .setTitle(title)
                .setMessage(message)
                .setOkButton(confirmBtnText, (baseDialog, v) -> {
                    callbackManager.invokeCallback();
                    return false;
                }).show();
    }

}
