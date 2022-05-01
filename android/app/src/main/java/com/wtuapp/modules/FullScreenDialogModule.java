package com.wtuapp.modules;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Callback;


/**
 * @author HuPeng
 * @date 2022-05-01 14:51
 */
public interface FullScreenDialogModule {

    /**
     * 初始化对话框
     * @param nativeId 原生id
     * @param isInitSuccess 是否初始化成功
     */
    void initDialog(@NonNull String nativeId, @Nullable Callback isInitSuccess);

    /**
     * 打开对话框
     * @param nativeId 原生id
     */
    void openFullScreenDialog(@NonNull String nativeId);

    /**
     * 移除对话框实例
     * @param nativeId 原生id
     */
    void removeDialogInstance(@NonNull String nativeId);
}
