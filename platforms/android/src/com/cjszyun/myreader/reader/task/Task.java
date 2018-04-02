package com.cjszyun.myreader.reader.task;

/**
 * Created by zhuzd on 15/6/1.
 */
public abstract class Task implements Runnable {

	protected TaskManager mTaskMgr;
	protected String mTaskName;
	protected boolean mbCancel;
	protected boolean mbRunning;

	public Task(String taskName) {
		mTaskMgr = null;
		mTaskName = taskName;
		mbCancel = false;
		mbRunning = false;
	}

	public TaskManager getTaskManager() {
		return mTaskMgr;
	}
	public void setTaskManager(TaskManager taskMgr) {
		mTaskMgr = taskMgr;
	}

	public String getTaskName() {
		return mTaskName;
	}
	public void setTaskName(String taskName) {
		mTaskName = taskName;
	}

	public boolean isRunning() {
		return mbRunning;
	}

	public void cancelTask() {
		mbCancel = true;
	}


	@Override
	public void run() {
		if (mbCancel) {
			return;
		}
		mbRunning = true;
		doTask();
		mbRunning = false;
		if (null != mTaskMgr) {
			mTaskMgr.delTask(mTaskName);
		}
		mbCancel = false;
	}

	abstract protected void doTask();
}
