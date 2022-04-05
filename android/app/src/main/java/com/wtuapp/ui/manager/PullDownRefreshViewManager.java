package com.wtuapp.ui.manager;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.scwang.smart.refresh.header.ClassicsHeader;
import com.wtuapp.commands.PullDownRefreshCommandHelper;
import com.wtuapp.layout.PullDownRefreshView;

import java.util.Map;

/**
 * @author HuPeng
 * @date 2022-03-23 15:40
 */
public class PullDownRefreshViewManager extends ViewGroupManager<PullDownRefreshView> implements PullDownRefreshCommandHelper.PullDownRefreshCommand {

    public static final String REACT_NAME = "RCTPullDownRefreshView";

    private Context context;

    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    @NonNull
    @Override
    protected PullDownRefreshView createViewInstance(@NonNull ThemedReactContext reactContext) {
        this.context = reactContext;
        return new PullDownRefreshView(reactContext);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "onRefresh",
                        MapBuilder.of("registrationName", "onRefresh"))
                .build();
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return PullDownRefreshCommandHelper.getCommandsMap();
    }



    @Override
    public void receiveCommand(@NonNull PullDownRefreshView root, String commandId, @Nullable ReadableArray args) {
        PullDownRefreshCommandHelper.receiveCommand(this, root, commandId, args);
    }


    @Override
    public void receiveCommand(@NonNull PullDownRefreshView root, int commandId, @Nullable ReadableArray args) {
        PullDownRefreshCommandHelper.receiveCommand(this, root, commandId, args);
    }

    @Override
    public void finishPullDownRefresh(PullDownRefreshView pullDownRefreshView, @Nullable ReadableArray args) {
        if (args == null) {
            pullDownRefreshView.finishRefresh();
            return;
        }
        pullDownRefreshView.finishRefresh(args.getBoolean(0));
    }

    @ReactProp(name = "enablePureScrollMode")
    public void setEnablePureScrollMode(PullDownRefreshView view, boolean enable) {
        view.setEnablePureScrollMode(enable);
    }

    @ReactProp(name = "enableRefresh")
    public void setEnableRefresh(PullDownRefreshView view, boolean enable) {
        if (enable) {
            view.setEnableRefresh(true);
            view.setRefreshHeader(new ClassicsHeader(context));
        }
    }
}
