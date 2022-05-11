package com.wtuapp.modules;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;

/**
 * @author HuPeng
 * @date 2022-05-02 13:22
 */
public interface BeautifulAlertDialogModule {

    String REACT_NAME = "BeautifulAlertDialog";

    /**
     * 显示一个对话框
     * @param title 标题
     * @param message 提示信息
     * @param confirmBtnText 确定按钮文字
     * @param cancelBtnText 取消按钮文字
     * @param onFinish 完成时的回调
     */
    void showDialog(String title, String message, String confirmBtnText, String cancelBtnText, Callback onFinish);

    /**
     * 显示只有一个按钮的对话框
     * @param title 对话框标题
     * @param message 信息
     * @param btnText 按钮文字
     * @param confirm 确定回调
     */
    void showSingleButtonDialog(String title, String message, String btnText, Callback confirm);
}
