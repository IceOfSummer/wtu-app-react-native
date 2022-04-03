package com.wtuapp.modules;

import android.app.Dialog;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.kongzue.dialogx.dialogs.MessageDialog;

import java.util.Stack;

/**
 * IOS样式的对话框
 * @author HuPeng
 * @date 2022-04-03 13:34
 */
public class BeautifulAlertDialogManager extends ReactContextBaseJavaModule {

    public static final String REACT_NAME = "BeautifulAlertDialog";

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
    @ReactMethod
    public void showDialog(String title, String message, String confirmBtnText, String cancelBtnText, Callback confirm, Callback cancel) {
        String confirmText = confirmBtnText == null ? DEFAULT_CONFIRM_TEXT : confirmBtnText;
        String cancelText = cancelBtnText == null ? DEFAULT_CANCEL_TEXT : cancelBtnText;

        MessageDialog.build()
                .setTitle(title)
                .setMessage(message)
                .setOkButton(confirmText, (baseDialog, v) -> {
                    if (confirm != null) {
                        confirm.invoke();
                    }
                    return false;
                })
                .setCancelButton(cancelText, (baseDialog, v) -> {
                    if (cancel != null) {
                        cancel.invoke();
                    }
                    return false;
                }).show();
    }

    /**
     * 显示只有一个按钮的对话框
     */
    @ReactMethod
    public void showSingleButtonDialog(String title, String message, String btnText, Callback confirm) {
        String confirmBtnText = btnText == null ? DEFAULT_CONFIRM_TEXT : btnText;

        MessageDialog.build()
                .setTitle(title)
                .setMessage(message)
                .setOkButton(confirmBtnText, (baseDialog, v) -> {
                    if (confirm != null) {
                        confirm.invoke();
                    }
                    return false;
                }).show();
    }

}
