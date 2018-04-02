package com.cjszyun.myreader.reader;

import android.os.Handler;
import android.os.Message;

import com.cjszyun.myreader.reader.task.TaskManager;
import com.cjszyun.myreader.reader.utils.DebugLog;

/**
 * Created by zhuzd on 15/6/1.
 */
public class ReadClient {

	private TaskManager mTaskMgr;
	private Handler mHandlerCallBack;
	private Handler mHandlerProxy;
	private Object mObjLock1, mObjLock2;

	public ReadClient() {
		if (! init()) {
			DebugLog.d("ReadClient is not init");
		}
	}

	private boolean init() {
		mTaskMgr = new TaskManager();
		mTaskMgr.init(0);
		mObjLock1 = new Object();
		mObjLock2 = new Object();
		return true;
	}

	public TaskManager getTaskManager() {
		return mTaskMgr;
	}

	public void setCallBackHandler(final Handler handler) {
		synchronized (mObjLock1) {
			mHandlerCallBack = handler;
		}
	}

	public void setNullCallBackHandler(final Handler handler) {
		if (null == handler) {
			return;
		}
		synchronized (mObjLock1) {
			if (handler == mHandlerCallBack) {
				mHandlerCallBack.removeCallbacksAndMessages(null);
				mHandlerCallBack = null;
			}
		}
	}

	public boolean sendCallBackMsg(int msgID) {
		synchronized (mObjLock1) {
			if (null == mHandlerCallBack) {
				return false;
			}
			return mHandlerCallBack.sendEmptyMessage(msgID);
		}
	}
	public boolean sendCallBackMsg(int msgID, Object obj) {
		synchronized (mObjLock1) {
			if (null == mHandlerCallBack) {
				return false;
			}
			Message msg = Message.obtain();
			msg.what = msgID;
			msg.obj = obj;
			return mHandlerCallBack.sendMessage(msg);
		}
	}
	public boolean sendCallBackMsg(int msgID, int arg1, int arg2) {
		synchronized (mObjLock1) {
			if (null == mHandlerCallBack) {
				return false;
			}
			Message msg = Message.obtain();
			msg.what = msgID;
			msg.arg1 = arg1;
			msg.arg2 = arg2;
			return mHandlerCallBack.sendMessage(msg);
		}
	}
	public boolean sendCallBackMsg(int msgID, int arg1, int arg2, Object obj) {
		synchronized (mObjLock1) {
			if (null == mHandlerCallBack) {
				return false;
			}
			Message msg = Message.obtain();
			msg.what = msgID;
			msg.arg1 = arg1;
			msg.arg2 = arg2;
			msg.obj = obj;
			return mHandlerCallBack.sendMessage(msg);
		}
	}


	public void setProxyHandler(Handler handler) {
		synchronized (mObjLock2) {
			mHandlerProxy = handler;
		}
	}

	public void setNullProxyHandler(Handler handler) {
		if (null == handler) {
			return;
		}
		synchronized (mObjLock2) {
			if (handler == mHandlerProxy) {
				mHandlerProxy.removeCallbacksAndMessages(null);
				mHandlerProxy = null;
			}
		}
	}

	public boolean sendProxyMsg(int msgID) {
		synchronized (mObjLock2) {
			if (null == mHandlerProxy) {
				return false;
			}
			return mHandlerProxy.sendEmptyMessage(msgID);
		}
	}
//	public boolean sendProxyMsg(int msgID, Object obj) {
//		synchronized (mObjLock2) {
//			if (null == mHandlerProxy) {
//				return false;
//			}
//			Message msg = Message.obtain();
//			msg.what = msgID;
//			msg.obj = obj;
//			return mHandlerProxy.sendMessage(msg);
//		}
//	}
//	public boolean sendProxyMsg(int msgID, int arg1, int arg2) {
//		synchronized (mObjLock2) {
//			if (null == mHandlerProxy) {
//				return false;
//			}
//			Message msg = Message.obtain();
//			msg.what = msgID;
//			msg.arg1 = arg1;
//			msg.arg2 = arg2;
//			return mHandlerProxy.sendMessage(msg);
//		}
//	}
//	public boolean sendProxyMsg(int msgID, int arg1, int arg2, Object obj) {
//		synchronized (mObjLock2) {
//			if (null == mHandlerProxy) { // 用服务的handler来给服务发送消息，用于控制服务让服务做相应的下载操作
//				return false;
//			}
//			Message msg = Message.obtain();
//			msg.what = msgID;
//			msg.arg1 = arg1;
//			msg.arg2 = arg2;
//			msg.obj = obj;
//			return mHandlerProxy.sendMessage(msg);
//		}
//	}

}
