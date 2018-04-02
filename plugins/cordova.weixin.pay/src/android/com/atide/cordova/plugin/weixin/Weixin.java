package com.atide.cordova.plugin.weixin;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONObject;
import com.atide.cordova.plugin.weixin.MD5;

import java.util.Map;
import java.util.TreeMap;


public class Weixin extends CordovaPlugin {
  private IWXAPI api;
  public static String app_id;
  CallbackContext currentCallbackContext;

  @Override
  public boolean execute(String action, CordovaArgs args,
                         CallbackContext callbackContext) throws JSONException {

    currentCallbackContext = callbackContext;
    if (action.equals("sendPayReq")) {
      return pay(args);
    }
    return true;
  }

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    this.onWeixinResp(cordova.getActivity().getIntent());
  }


  /**
   * call winxin sdk pay. 调用SDK支付
   */
  private boolean pay(CordovaArgs args) {
    try {
      JSONObject orderInfoArgs = args.getJSONObject(0);
      app_id = orderInfoArgs.optString("appid", "");
      final String urlString = orderInfoArgs.optString("urlString", "");
      final String method = orderInfoArgs.optString("method", "");
      final String data = orderInfoArgs.optString("data", "");
      if (api == null) {
        api = WXAPIFactory.createWXAPI(cordova.getActivity(), app_id, true);
        api.registerApp(app_id);
      }
      Toast.makeText(cordova.getActivity(), "获取订单中...", Toast.LENGTH_SHORT).show();
      try {
        if (data != null && data.length() > 0) {
          String content = data;
          Log.e("get server pay params:", content);
          System.out.println("pay param=" + content);
          JSONObject json = new JSONObject(content);
          if (null != json && !json.has("retcode")) {
            PayReq req = new PayReq();
            req.appId = json.getString("appid");
            req.partnerId = json.getString("mch_id");
            req.prepayId = json.getString("prepay_id");
            req.nonceStr = json.getString("nonce_str");
            req.timeStamp = json.getString("timestamp");
            req.packageValue = "Sign=WXPay";
            req.sign = getSign(req);
            // 在支付之前，如果应用没有注册到微信，应该先调用IWXMsg.registerApp将应用注册到微信
            api.sendReq(req);
          } else {
            currentCallbackContext.error("返回错误" + json.getString("retmsg"));
            //Toast.makeText(cordova.getActivity(), "返回错误"+json.getString("retmsg"), Toast.LENGTH_SHORT).show();
          }
        } else {
          currentCallbackContext.error("服务器请求错误");
          //Toast.makeText(cordova.getActivity(), "服务器请求错误", Toast.LENGTH_SHORT).show();
        }
      } catch (Exception e) {
        e.printStackTrace();
        currentCallbackContext.error("订单参数不正确");
      }
    } catch (Exception e1) {
      e1.printStackTrace();
      currentCallbackContext.error("订单参数不正确");
    }
    return true;
  }

  private void onWeixinResp(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      String intentType = extras.getString("intentType");
      if ("weixin".equals(intentType)) {
        if (currentCallbackContext != null) {
          currentCallbackContext.success(extras.getInt("weixinPayRespCode"));
        }
      }
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    //Log.i(TAG, "onNewIntent");
    this.onWeixinResp(intent);
  }

  /**
   * 微信本地计算sign方法
   */
  private String getSign(PayReq req) {
    String app_key = "af2cd31j20177d265320ce671fzwwfac";
    TreeMap<String, String> map = new TreeMap<String, String>();
    map.put("appid", req.appId);
    map.put("noncestr", req.nonceStr);
    map.put("package", req.packageValue);
    map.put("partnerid", req.partnerId);
    map.put("prepayid", req.prepayId);
    map.put("timestamp", req.timeStamp);

    StringBuilder sb = new StringBuilder();

    for (Map.Entry<String, String> entry : map.entrySet()) {
      sb.append(entry.getKey());
      sb.append('=');
      sb.append(entry.getValue());
      sb.append('&');
    }

    sb.append("key=");
    sb.append(app_key);

    String appSign = MD5.getMessageDigest(sb.toString().getBytes()).toUpperCase();
    Log.i("orion", appSign);
    return appSign;
  }
}
