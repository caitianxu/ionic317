package com.cjszyun.myreader.reader;

import android.content.Intent;
import android.util.Log;

import com.cjszyun.myreader.reader.beans.EventBean;
import com.cjszyun.myreader.reader.views.OnlineReadActivity;
import com.google.gson.Gson;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONObject;

public class BookReader extends CordovaPlugin {
    public static final int GOTO_RECHARGE = 101;
    public static final int GOTO_RETURN = 102;
    public static final int GOTO_LOGIN = 103;
    public static final int GOTO_BOOKSHELF = 104;

    CallbackContext currentCallbackContext;

    @Override
    public boolean execute(String action, CordovaArgs args,
                           CallbackContext callbackContext) throws JSONException {
        // save the current callback context
        currentCallbackContext = callbackContext;
        if (action.equals("reader")) {
            return reader(args);
        }
        return true;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    /**
     * 调用阅读
     */
    private boolean reader(CordovaArgs args) {
        try {
            JSONObject orderInfoArgs = args.getJSONObject(0);
            Log.i("bookreader", orderInfoArgs.toString());
            String bookid = orderInfoArgs.getString("bookid");
            String booktype = orderInfoArgs.getString("booktype");
            String bookname = orderInfoArgs.getString("bookname");
            String userid = orderInfoArgs.getString("userid");
            String token = orderInfoArgs.getString("token");
            String chid = orderInfoArgs.getString("chid");
            String pagenum = orderInfoArgs.getString("pagenum");
            String eventkey = orderInfoArgs.getString("eventkey");
//            String ctxPath = orderInfoArgs.getString("ctxPath");
//            if (!TextUtils.isEmpty(ctxPath)){
//                URL_CJSZYUN = ctxPath;
//            }
            Intent intent = new Intent(this.cordova.getActivity(), OnlineReadActivity.class);
            intent.putExtra("BookName", bookname);
            intent.putExtra("OnlineID", bookid);
            if (!pagenum.equals("null") && !pagenum.equals("") && pagenum != null) {
                intent.putExtra("PagePos", Integer.parseInt(pagenum));
            }
            if (!chid.equals("null") && !chid.equals("") && chid != null) {
                intent.putExtra("ChapterId", Integer.parseInt(chid));
            }
            intent.putExtra("isEpub", booktype.equals("2"));
            intent.putExtra("fromShelf", true);
            intent.putExtra("token", token);
            intent.putExtra("userId", userid);
            intent.putExtra("dev_type", "android");
            intent.putExtra("eventkey", eventkey);
            this.cordova.startActivityForResult(this, intent, 200);
        } catch (Exception e1) {
            e1.printStackTrace();
            currentCallbackContext.error("阅读参数不正确");
        }
        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == 200) {
            Log.i("bookreader", "resultCode = " + resultCode);
            switch (resultCode) {
                case GOTO_RECHARGE:
                    EventBean eventBean = new EventBean();
                    eventBean.chid = intent.getStringExtra("chid");
                    eventBean.pagenum = intent.getStringExtra("pagenum");
                    eventBean.bookid = intent.getStringExtra("bookid");
                    eventBean.bookname = intent.getStringExtra("bookname");
                    eventBean.booktype = intent.getStringExtra("booktype");
                    eventBean.eventkey = intent.getStringExtra("eventkey");
                    String param = new Gson().toJson(eventBean);
                    this.webView.loadUrl("javascript:toPageName('recharge','" + param + "')");
                    break;
                case GOTO_RETURN:
                    this.webView.loadUrl("javascript:toPageName('return')");
                    break;
                case GOTO_LOGIN:
                    this.webView.loadUrl("javascript:toPageName('login')");
                    break;
                case GOTO_BOOKSHELF:
                    this.webView.loadUrl("javascript:toPageName('bookshelf')");
                    break;
            }
        }
    }
}
