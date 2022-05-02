package com.wtuapp.modules;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;


/**
 * @author HuPeng
 * @date 2022-05-01 14:51
 */
public interface FullScreenDialogModule {

    String REACT_NAME = "FullScreenDialog";

    /**
     * 初始化对话框
     * @param nativeId 原生id
     * @param isInitSuccess 是否初始化成功
     */
    void initDialog(@NonNull String nativeId, @Nullable Callback isInitSuccess);

    /**
     * 初始化一个带有按钮的对话框
     * @param nativeId 原生id
     * @param finish 完成回调
     */
    void initDialogWithButton(@NonNull String nativeId, @Nullable Callback finish);

    /**
     * 打开对话框
     * @param nativeId 原生id
     */
    void openFullScreenDialog(@NonNull String nativeId, @Nullable Callback onFinish);


    /**
     * 打开带有按钮的对话框
     * @param nativeId 原生id
     * @param confirmBtnText 确定按钮文字
     * @param onConfirm 确定回调
     */
    void openFullScreenDialogWithButton(@NonNull String nativeId, @Nullable String confirmBtnText, @Nullable Callback onConfirm, @Nullable Callback onFinish);

    /**
     * 移除对话框实例
     * @param nativeId 原生id
     */
    void removeDialogInstance(@NonNull String nativeId);
}
