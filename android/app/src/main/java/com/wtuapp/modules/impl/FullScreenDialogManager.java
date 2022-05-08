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
 * <p/>打开一个全屏对话框
 *
 * <p/>首先需要调用
 * {@link FullScreenDialogManager#initDialog(String, Callback)} 或
 * {@link FullScreenDialogManager#initDialogWithButton(String, Callback)} 来初始化对话框
 *
 * <p/>之后按照初始化的类型, 对应的去调用
 * {@link FullScreenDialogManager#openFullScreenDialog(String, Callback)} 或
 * {@link FullScreenDialogManager#openFullScreenDialogWithButton(String, String, Callback)} 来打开对话框
 *
 * <p/><b>不要在界面初始化完毕之前或刚好完成时初始化对话框</b>, 在React中可考虑使用<i> useEffect </i>来进行初始化
 *
 * <p/>打开对话框时会卡住主线程, <b>请不要在刚好初始化完毕时立即打开对话框</b>, 考虑使用<i> setTimeout </i>延时调用
 *
 * <p/>页面卸载时请务必调用{@link FullScreenDialogManager#removeDialogInstance(String)}以避免内存泄露
 *
 * <p/>如果要在界面初始化完毕后立即打开对话框, 可以考虑这样写
 * <pre>
 *     useEffect(() => {
 *       setTimeout(() => {
 *           xx.openFullScreenDialog('xx', () => null)
 *       }, 100)
 *       return {
 *           xx.removeDialogInstance('xx')
 *       }
 *     }, [])
 * </pre>
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
                .setDialogLifecycleCallback(new DialogLifecycleCallback<FullScreenDialog>() {
                    @Override
                    public void onDismiss(FullScreenDialog dialog) {
                        invokeCurrentOnFinishCallback();
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

                        Button btn = v.findViewById(R.id.confirm_btn);
                        btn.setOnClickListener(v1 -> {
                            invokeCurrentOnFinishCallback(true);
                            dialog.dismiss();
                        });
                        if (contentLayout.getChildCount() == 0) {
                            contentLayout.addView(targetView);
                        }
                    }
                })
                .setDialogLifecycleCallback(new DialogLifecycleCallback<FullScreenDialog>() {
                    @Override
                    public void onDismiss(FullScreenDialog dialog) {
                        invokeCurrentOnFinishCallback(false);
                    }
                })
                .setCancelable(true));
        CallbackUtils.invokeIfNotNull(finish, true, "init success");
    }

    private Callback currentOnFinishCallback;

    public void setCurrentOnFinishCallback(Callback currentOnFinishCallback) {
        this.currentOnFinishCallback = currentOnFinishCallback;
    }

    private void invokeCurrentOnFinishCallback(Object...args) {
        CallbackUtils.invokeIfNotNull(currentOnFinishCallback, args);
        currentOnFinishCallback = null;
    }

    @ReactMethod
    @Override
    public void openFullScreenDialog(@NonNull String nativeId, @Nullable Callback onFinish) {
        FullScreenDialog dialog = dialogMap.get(nativeId);
        if (dialog == null) {
            return;
        }
        setCurrentOnFinishCallback(onFinish);
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
    public void openFullScreenDialogWithButton(@NonNull String nativeId, @Nullable String confirmBtnText, @Nullable Callback onFinish) {
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
        setCurrentOnFinishCallback(onFinish);
        customView.post(() -> {
            btn.setText(confirmBtnText);
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
