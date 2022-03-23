package com.wtuapp.nativepackage;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.wtuapp.layout.PullDownRefreshViewManager;

import java.util.Collections;
import java.util.List;

/**
 * @author HuPeng
 * @date 2022-03-23 15:42
 */
public class PullDownRefreshViewPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.singletonList(new PullDownRefreshViewManager());
    }
}
