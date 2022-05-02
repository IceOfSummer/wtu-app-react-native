package com.wtuapp.modules.impl;

import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.util.ReactFindViewUtil;
import com.kongzue.dialogx.dialogs.FullScreenDialog;
import com.kongzue.dialogx.interfaces.DialogLifecycleCallback;
import com.kongzue.dialogx.interfaces.OnBindView;
import com.wtuapp.R;
import com.wtuapp.modules.FullScreenDialogModule;
import com.wtuapp.utils.CallbackUtils;
import com.wtuapp.utils.ViewUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author HuPeng
 * @date 2022-05-01 14:44
 */
public class FullScreenDialogManager extends ReactContextBaseJavaModule implements FullScreenDialogModule {


    public FullScreenDialogManager(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    private final Map<String, FullScreenDialog> dialogMap = new HashMap<>();

    @ReactMethod
    @Override
    public void initDialog(@NonNull String nativeId, @Nullable Callback finish) {
        View targetView = getTargetView(nativeId);
        ViewUtils.removeSelfFromParent(targetView);
        if (targetView == null) {
            CallbackUtils.invokeIfNotNull(finish, false, "can not find target view: " + nativeId);
            return;
        }
        LinearLayout linearLayout = new LinearLayout(getReactApplicationContext());
        linearLayout.addView(targetView);
        dialogMap.put(nativeId, FullScreenDialog.build()
                .setCustomView(new OnBindView<FullScreenDialog>(linearLayout) {
                    @Override
                    public void onBind(FullScreenDialog dialog, View v) {

                    }
                })
                .setCancelable(true));
        CallbackUtils.invokeIfNotNull(finish, true, "init success");
    }

    @ReactMethod
    @Override
    public void initDialogWithButton(@NonNull String nativeId, @Nullable Callback finish) {
        View targetView = getTargetView(nativeId);
        ViewUtils.removeSelfFromParent(targetView);
        if (targetView == null) {
            CallbackUtils.invokeIfNotNull(finish, false, "can not find target view: " + nativeId);
            return;
        }
        dialogMap.put(nativeId, FullScreenDialog.build()
                .setCustomView(new OnBindView<FullScreenDialog>(R.layout.fullscreen_dialog_layout) {
                    @Override
                    public void onBind(FullScreenDialog dialog, View v) {
                        LinearLayout contentLayout = v.findViewById(R.id.dialog_content);
                        if (contentLayout.getChildCount() == 0) {
                            contentLayout.addView(targetView);
                        }
                    }
                })
                .setCancelable(true));
        CallbackUtils.invokeIfNotNull(finish, true, "init success");
    }

    @ReactMethod
    @Override
    public void openFullScreenDialog(@NonNull String nativeId, @Nullable Callback onFinish) {
        FullScreenDialog dialog = dialogMap.get(nativeId);
        if (dialog == null) {
            return;
        }
        if (onFinish != null) {
            dialog.setDialogLifecycleCallback(new DialogLifecycleCallback<FullScreenDialog>() {
                @Override
                public void onDismiss(FullScreenDialog dialog) {
                    onFinish.invoke();
                }
            });
//            dialog.getCustomView().post(() -> {
//            });
        }
        dialog.show();
    }

    @ReactMethod
    @Override
    public void openFullScreenDialogWithButton(@NonNull String nativeId, @Nullable String confirmBtnText, @Nullable Callback onConfirm, @Nullable Callback onFinish) {
        FullScreenDialog dialog = dialogMap.get(nativeId);
        if (dialog == null) {
            return;
        }
        View customView = dialog.getCustomView();
        ViewUtils.removeSelfFromParent(customView);
        Button btn = customView.findViewById(R.id.confirm_btn);
        if (btn == null) {
            dialog.show();
            return;
        }
        customView.post(() -> {
            btn.setText(confirmBtnText);
            btn.setOnClickListener(v -> {
                CallbackUtils.invokeIfNotNull(onConfirm);
                dialog.dismiss();
            });
            if (onFinish != null) {
                dialog.setDialogLifecycleCallback(new DialogLifecycleCallback<FullScreenDialog>() {
                    @Override
                    public void onDismiss(FullScreenDialog dialog) {
                        onFinish.invoke();
                    }
                });
            }
        });
        dialog.show();
    }

    @ReactMethod
    @Override
    public void removeDialogInstance(@NonNull String nativeId) {
        dialogMap.remove(nativeId);
    }


    @Nullable
    private View getTargetView(String nativeId) {
        if (getCurrentActivity() == null || getReactApplicationContext() == null) {
            return null;
        }
        View rootView = getCurrentActivity().getWindow().getDecorView().getRootView();
        return ReactFindViewUtil.findView(rootView, nativeId);
    }
}
