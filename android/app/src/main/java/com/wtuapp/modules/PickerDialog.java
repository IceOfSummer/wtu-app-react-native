package com.wtuapp.modules;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;

/**
 * @author HuPeng
 * @date 2022-09-22 17:12
 */
public interface PickerDialog {

    String REACT_NAME = "RNMPickerDialog";

    /**
     * 显示picker
     * @param recipes 可用选项
     * @param defaultActive 默认选中哪一个
     * @param onSelect 当操作完成时调用，返回用户选中选项的索引，若没选则<b>不会</b>调用
     */
    void showPicker(String title, ReadableArray recipes, Integer defaultActive, Callback onSelect);
}
