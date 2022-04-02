package com.wtuapp.widget.common;

import android.content.Context;

import com.wtuapp.widget.ContextProvider;
import com.wtuapp.widget.bean.Lesson;
import com.wtuapp.widget.service.LessonsService;
import com.wtuapp.widget.service.impl.LessonsServiceImpl;
import com.wtuapp.widget.util.DateUtils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * 用于管理课程表, 使用<b>单例模式</b>
 * @author HuPeng
 * @date 2022-04-01 21:36
 */
public class LessonsTableManagerImpl implements LessonsTableManager{

    private static final String[] DAY_SCHEMA = {"星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"};

    private final LessonsService lessonsService;

    /**
     * 当前页,0为第一页
     */
    private int curPage;

    /**
     * 当前星期
     * @see LessonsTableManagerImpl#safetySetCurDay(int) 设置该值时请使用该方法
     */
    private int curDay;

    /**
     * 所有的课程信息
     */
    private List<Lesson> lessons;

    /**
     * 当前课程的信息
     */
    private List<Lesson> curLessons;

    /**
     * 保存单例
     */
    private volatile static LessonsTableManager lessonsTableManagerInstance;

    private LessonsTableManagerImpl(LessonsService lessonsService) {
        this.lessonsService = lessonsService;
        reset();
    }

    private LessonsTableManagerImpl(Context context) {
        this(new LessonsServiceImpl(context));
    }

    public static LessonsTableManager getInstance() {
        if (lessonsTableManagerInstance == null) {
            synchronized (LessonsTableManagerImpl.class) {
                if (lessonsTableManagerInstance == null) {
                    lessonsTableManagerInstance = new LessonsTableManagerImpl(ContextProvider.getContextInstance());
                }
            }
        }
        return lessonsTableManagerInstance;
    }

    @Override
    public boolean haveNextPage() {
        return curPage < (curLessons.size() - 1) / 2;
    }

    @Override
    public boolean havePreviousPage() {
        return curPage > 0;
    }

    @Override
    public List<Lesson> nextPage() {
        if (haveNextPage()) {
            curPage++;
            return getLessons();
        } else {
            throw new IllegalStateException("No next page available");
        }
    }

    @Override
    public List<Lesson> curPage() {
        return getLessons();
    }

    @Override
    public List<Lesson> getLessons(int pageIndex) {
        int max = getAvailablePage();
        if (pageIndex < 0 || pageIndex >= getAvailablePage()) {
            throw new IndexOutOfBoundsException(String.format("max: %d, index: %d", max, pageIndex));
        }
        curPage = pageIndex;
        return getLessons();
    }

    @Override
    public Lesson getLesson(int index) {
        return getLessons().get(index);
    }

    @Override
    public List<Lesson> previousPage() {
        if (havePreviousPage()) {
            curPage--;
            return getLessons();
        } else {
            throw new IllegalStateException("No previous page available");
        }
    }

    /**
     * 获取当前页应该显示的课程
     * @return 应该显示的课程
     */
    private List<Lesson> getLessons() {
        int size = curLessons.size();
        ArrayList<Lesson> arr = new ArrayList<>(2);
        if (curPage * 2 < size) {
            arr.add(curLessons.get(curPage * 2));
            if (curPage * 2 + 1 < size) {
                arr.add(curLessons.get(curPage * 2 + 1));
            }
        }
        return arr;

    }

    @Override
    public List<Lesson> nextDay() {
        safetySetCurDay(curDay + 1);
        return getLessons();
    }

    @Override
    public List<Lesson> previousDay() {
        safetySetCurDay(curDay - 1);
        return getLessons();
    }


    public void reloadData() {
        lessons = lessonsService.getAllLessons();
        curLessons = lessonsService.splitLesson(lessons, curDay);
        curPage = 0;
    }

    @Override
    public int getAvailablePage() {
        return (int) Math.ceil(curLessons.size() / 2f);
    }


    /**
     * 安全地设置当前星期, 并加载新数据
     * @param val 当前星期
     */
    private void safetySetCurDay(int val) {
        if (val > 7) {
            val = 1;
        } else if (val <= 0) {
            val = 7;
        }
        curDay = val;
        curPage = 0;
        curLessons = lessonsService.splitLesson(lessons, curDay);
    }

    @Override
    public int getCurDay() {
        return curDay;
    }

    @Override
    public String getCurDayAsString() {
        return DAY_SCHEMA[curDay - 1];
    }

    @Override
    public void reset() {
        this.curDay = DateUtils.castDayToStanderType(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));
        this.curPage = 0;
        reloadData();
    }
}
