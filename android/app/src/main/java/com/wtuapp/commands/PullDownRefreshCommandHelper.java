package com.wtuapp.commands;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.wtuapp.layout.PullDownRefreshView;

import java.util.Map;

/**
 * @author HuPeng
 * @date 2022-03-23 15:59
 */
public class PullDownRefreshCommandHelper {

    public static final int COMMAND_FINISH_REFRESH = 1;

    public static interface PullDownRefreshCommand {
        /**
         * 完成下拉刷新
         */
        void finishPullDownRefresh(PullDownRefreshView pullDownRefreshView, @Nullable ReadableArray args);
    }

    public static void receiveCommand(PullDownRefreshCommand manager , @NonNull PullDownRefreshView root, String commandId, @Nullable ReadableArray args) {
        if (Commands.FINISH_REFRESH.equalsCommands(commandId)) {
            manager.finishPullDownRefresh(root, args);
        }
        throw new IllegalArgumentException(
                String.format(
                        "Unsupported command %s received by %s.",
                        commandId, manager.getClass().getSimpleName()));

    }

    public static void receiveCommand(PullDownRefreshCommand manager , @NonNull PullDownRefreshView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_FINISH_REFRESH:
                manager.finishPullDownRefresh(root, args);
                break;
            default:
                throw new IllegalArgumentException(
                        String.format(
                                "Unsupported command %s received by %s.",
                                commandId, manager.getClass().getSimpleName()));
        }
    }

    public enum Commands {
        FINISH_REFRESH("finishRefresh");

        private String commandName;


        Commands(String commandName) {
            this.commandName = commandName;
        }

        public String getCommandName() {
            return commandName;
        }

        public boolean equalsCommands(String command) {
            return commandName.equals(command);
        }
    }

    public static Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "finishRefresh", COMMAND_FINISH_REFRESH
        );
    }

}
