package com.wtuapp.modules;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;

/**
 * @author HuPeng
 * @date 2022-05-19 16:01
 */
public interface BottomMenuModule {

    String REACT_NAME = "RNMBottomMenu";

    /**
     * 打开底部菜单
     * @param recipes 项目名称
     * @param onFinish 完成后的回调
     *
     * <pre>
     * (index?: number, name?: string) => void
     *
     * <p/>index: 点击的某一项, 若没有点击返回undefined
     * </pre>
     *
     *
     */
    void showMenu(ReadableArray recipes, Callback onFinish);
}
