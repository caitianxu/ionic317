package com.cjszyun.myreader.reader.model;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.ReadClient;
import com.cjszyun.myreader.reader.task.TaskManager;
import com.cjszyun.myreader.reader.utils.DebugLog;

import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

/**
 * Created by zhuzd on 15/10/23.
 */
public abstract class Model {

	public interface JsonParser {
		void parser(JSONObject jsonObj);
		void error(NetException error);
	}

	public class NetException extends Exception {
		public NetException(Exception e) {
			super(e);
		}
	}

	protected void reqJSONObject(final RequestQueue requestQueue, String url, final JsonParser jsonParser) {
		DebugLog.d(url);
		requestQueue.add(new JsonObjectRequest(url, null,
				new Response.Listener<JSONObject>() {
					@Override
					public void onResponse(JSONObject response) {
						jsonParser.parser(response);
					}
				}, new Response.ErrorListener() {
					@Override
					public void onErrorResponse(VolleyError error) {
						jsonParser.error(new NetException(error));
					}
				}
		));
	}


	protected TaskManager getTaskManager() {
		return getReadClient().getTaskManager();
	}


	protected boolean sendMessage(int msgID) {
		return getReadClient().sendCallBackMsg(msgID);
	}
	protected boolean sendMessage(int msgID, Object obj) {
		return getReadClient().sendCallBackMsg(msgID, obj);
	}
	protected boolean sendMessage(int msgID, int arg1, int arg2) {
		return getReadClient().sendCallBackMsg(msgID, arg1, arg2);
	}
	protected boolean sendMessage(int msgID, int arg1, int arg2, Object obj) {
		return getReadClient().sendCallBackMsg(msgID, arg1, arg2, obj);
	}
	protected ReadClient getReadClient() {
		return AppData.getClient();
	}


	protected static Object readObject(final String filePath) {
		FileInputStream fis = null;
		ObjectInputStream ois = null;
		try {
			fis = new FileInputStream(filePath);
			ois = new ObjectInputStream(fis);
			return ois.readObject();
		} catch (Exception e) {
			if (DebugLog.isDebuggable()) { e.printStackTrace(); }
		} finally {
			if (ois != null)
				try { ois.close(); } catch (IOException e) { if (DebugLog.isDebuggable()) e.printStackTrace(); }
			if (fis != null)
				try { fis.close(); } catch (IOException e) { if (DebugLog.isDebuggable()) e.printStackTrace(); }
		}
		return null;
	}

	public static boolean writeObject(final String filePath, final Object object) {
		FileOutputStream fos = null;
		ObjectOutputStream oos = null;
		try {
			fos = new FileOutputStream(filePath);
			oos = new ObjectOutputStream(fos);
			oos.writeObject(object);
			return true;
		} catch (Exception e) {
			if (DebugLog.isDebuggable()) { e.printStackTrace(); }
		} finally {
			if (oos != null)
				try { oos.close(); } catch (IOException e) { if (DebugLog.isDebuggable()) e.printStackTrace(); }
			if (fos != null)
				try { fos.close(); } catch (IOException e) { if (DebugLog.isDebuggable()) e.printStackTrace(); }
		}
		return false;
	}

}
