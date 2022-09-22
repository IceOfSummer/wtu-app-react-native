package com.wtuapp.modules.impl;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.kongzue.dialogx.customwheelpicker.CustomWheelPickerDialog;
import com.kongzue.dialogx.customwheelpicker.interfaces.OnCustomWheelPickerSelected;
import com.wtuapp.commands.CallbackManager;
import com.wtuapp.modules.PickerDialog;

/**
 * @author HuPeng
 * @date 2022-09-22 17:14
 */
public class PickDialogManager extends ReactContextBaseJavaModule implements PickerDialog {
    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Override
    @ReactMethod
    public void showPicker(String title, ReadableArray recipes, Integer defaultActive, Callback onSelect) {
        CallbackManager callbackManager = new CallbackManager(onSelect);
        String[] rec = new String[recipes.size()];
        for (int i = 0, size = recipes.size(); i < size; i++) {
            rec[i] = recipes.getString(i);
        }
        CustomWheelPickerDialog.build()
                .addWheel(rec)
                .setTitle(title)
                .setDefaultSelect(0, defaultActive)
                .show(new OnCustomWheelPickerSelected() {
                    @Override
                    public void onSelected(CustomWheelPickerDialog picker, String text, String[] selectedTexts, int[] selectedIndex) {
                        callbackManager.invokeCallback(selectedIndex[0]);
                    }
                });
    }


}
