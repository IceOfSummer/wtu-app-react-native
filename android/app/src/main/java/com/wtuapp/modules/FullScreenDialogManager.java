package com.wtuapp.modules;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.util.ReactFindViewUtil;
import com.kongzue.dialogx.dialogs.FullScreenDialog;
import com.kongzue.dialogx.interfaces.OnBindView;

import java.util.HashMap;
import java.util.Map;

/**
 * @author HuPeng
 * @date 2022-04-17 14:21
 */
public class FullScreenDialogManager extends ReactContextBaseJavaModule {

    public static final String REACT_NAME = "FullScreenDialog";

    private final ReactContext reactContext;


    public FullScreenDialogManager(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    private static final Map<String, FullScreenDialog> dialogMap = new HashMap<>();


    private FullScreenDialog buildFullScreenDialog(String id) {
        if (reactContext == null || reactContext.getCurrentActivity() == null) {
            return null;
        }
        Activity activity = reactContext.getCurrentActivity();
        View rootView = activity.getWindow().getDecorView().getRootView();
        View requiredView = ReactFindViewUtil.findView(rootView, id);
        return FullScreenDialog.build()
                .setCustomView(new OnBindView<FullScreenDialog>(requiredView) {
                    @Override
                    public void onBind(FullScreenDialog dialog, View v) {

                    }
                })
                .setCancelable(true);
    }

    @ReactMethod
    public void openFullScreenDialog(String id) {
        if (reactContext == null || reactContext.getCurrentActivity() == null) {
            return;
        }
        FullScreenDialog dialog = dialogMap.get(id);
        if (dialog == null) {
            FullScreenDialog dialog1 = buildFullScreenDialog(id);
            if (dialog1 != null) {
                dialog1.show();
                dialogMap.put(id, dialog1);
            } else {
                throw new IllegalStateException("reactContent is null!");
            }
        } else {
            dialog.show();
        }

    }

    @ReactMethod
    public void removeDialogInstance(String id) {
        dialogMap.remove(id);
    }
}
