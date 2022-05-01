package com.wtuapp.modules.impl;

import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.util.ReactFindViewUtil;
import com.kongzue.dialogx.dialogs.FullScreenDialog;
import com.kongzue.dialogx.interfaces.OnBindView;
import com.wtuapp.modules.FullScreenDialogModule;
import com.wtuapp.utils.ViewUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author HuPeng
 * @date 2022-05-01 14:44
 */
public class FullScreenDialogManager extends ReactContextBaseJavaModule implements FullScreenDialogModule {

    public static final String REACT_NAME = "FullScreenDialog";

    public FullScreenDialogManager(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    private final Map<String, FullScreenDialog> dialogMap= new HashMap<>();

    @ReactMethod
    @Override
    public void initDialog(@NonNull String nativeId, @Nullable Callback finish) {
        FullScreenDialog dialog;
        try {
            dialog = buildFullScreenDialog(nativeId);
        } catch (Exception e) {
            e.printStackTrace();
            if (finish != null) {
                finish.invoke(Boolean.FALSE, e.getMessage());
            }
            return;
        }
        dialogMap.put(nativeId, dialog);
        if (finish != null) {
            finish.invoke(Boolean.TRUE);
        }
    }

    @ReactMethod
    @Override
    public void openFullScreenDialog(@NonNull String nativeId) {
        FullScreenDialog dialog = dialogMap.get(nativeId);
        if (dialog == null) {
            return;
        }
        dialog.show();
    }

    @ReactMethod
    @Override
    public void removeDialogInstance(@NonNull String nativeId) {
        dialogMap.remove(nativeId);
    }

    @NonNull
    private FullScreenDialog buildFullScreenDialog(String nativeId) {
        if (getCurrentActivity() == null || getReactApplicationContext() == null) {
            throw new IllegalArgumentException();
        }
        View rootView = getCurrentActivity().getWindow().getDecorView().getRootView();
        View view = ReactFindViewUtil.findView(rootView, nativeId);
        ViewUtils.removeSelfFromParent(view);
        if (view == null) {
            throw new IllegalArgumentException("cannot find target view");
        }
        LinearLayout linearLayout = new LinearLayout(getReactApplicationContext());
        linearLayout.addView(view);
        
        return FullScreenDialog.build()
                .setCustomView(new OnBindView<FullScreenDialog>(linearLayout) {
                    @Override
                    public void onBind(FullScreenDialog dialog, View v) {

                    }
                })
                .setCancelable(true);

    }
}
