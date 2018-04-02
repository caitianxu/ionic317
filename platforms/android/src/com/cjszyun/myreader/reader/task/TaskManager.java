package com.cjszyun.myreader.reader.task;

import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by zhuzd on 15/6/1.
 */
public class TaskManager {

	private ExecutorService mThreadPool;
	private HashMap<String, Task> mTaskMap;

	private static final int THREAD_COUNT = 10;

	synchronized public void init(int threadNum) {
		if (1 == threadNum) {
			mThreadPool = Executors.newSingleThreadExecutor();
		} else if (-1 == threadNum) {
			mThreadPool = Executors.newCachedThreadPool();
		} else if (0 == threadNum) {
			mThreadPool = Executors.newFixedThreadPool(THREAD_COUNT);
		} else {
			mThreadPool = Executors.newFixedThreadPool(threadNum);
		}
		mTaskMap = new HashMap<String, Task>();
	}

	synchronized public void shutdown() {
		mThreadPool.shutdown();
		for (Task task : mTaskMap.values()) {
			if (null != task) {
				task.cancelTask();
			}
		}
		mTaskMap.clear();
	}

	synchronized public boolean addTask(Task task) {
		if (mThreadPool.isShutdown()) {
			return false;
		}
		if (null != mTaskMap.get(task.getTaskName())) {
			return false;
		}
		task.setTaskManager(this);
		mTaskMap.put(task.getTaskName(), task);
		mThreadPool.execute(task);
		return true;
	}

	synchronized public Task findTask(String taskName) {
		return mTaskMap.get(taskName);
	}

	synchronized public void delTask(String taskName) {
		Task task = mTaskMap.get(taskName);
		if (null != task) {
			task.cancelTask();
			mTaskMap.remove(taskName);
		}
	}

	synchronized public void delAllTask() {
		for (Task task : mTaskMap.values()) {
			if (null != task) {
				task.cancelTask();
			}
		}
		mTaskMap.clear();
	}

}
