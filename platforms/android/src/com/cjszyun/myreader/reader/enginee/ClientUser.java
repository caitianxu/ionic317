package com.cjszyun.myreader.reader.enginee;

import android.content.Context;
import android.content.SharedPreferences;

import com.cjszyun.myreader.reader.utils.AES;
import com.cjszyun.myreader.reader.utils.Base64Util;
import com.cjszyun.myreader.reader.utils.DebugLog;

import java.util.Calendar;

/**
 * Created by zhuzd on 15/5/23.
 */
public class ClientUser {

    public final static int SEX_MALE = 1;
    public final static int SEX_FEMALE = 0;
    public final static int SEX_SECRET = 3;

    private final static String KEY_USERNAME = "username";
    private final static String KEY_PASSWORD = "password";
    private final static String KEY_TOKEN = "token";

    private String mToken; // 用户登陆信息服务器校验令牌
    private String mUserName;
    private String mPassword;
    private int mBalance = 0;

    private String regDate; // 注册日期，仅显示
    private int sex = 3; // 1.男，0.女，3.保密
    private String email;
    private Calendar birthDay = Calendar.getInstance();

    private boolean isLogin = false;
    private long userPeriod;

    private SharedPreferences sp;

    public ClientUser(Context context, int userID) {
        userPeriod = System.currentTimeMillis();
        sp = context.getSharedPreferences("user_config_" + userID, Context.MODE_PRIVATE);
        init();
    }

    private void init() {
        mUserName = sp.getString(KEY_USERNAME, "");
        String data = sp.getString(KEY_PASSWORD, "");
        if (!data.equals("")) {
            try {
                byte[] base64 = Base64Util.decode(data);
                mPassword = AES.decrypt(base64);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public long getPeriod() {
        return userPeriod;
    }

    public void clear() {
        sp.edit().clear().commit();
    }

    public void setToken(String token) {
        mToken = token;
        SharedPreferences.Editor editor = sp.edit();
        editor.putString(KEY_TOKEN, token);
        editor.commit();
    }

    public String getToken() {
        return sp.getString(KEY_TOKEN, "");
    }

    public boolean checkToken() {

        if (mToken == null)
            return false;
        if (mToken.equals(""))
            return false;
        return true;
    }

    public void setUserName(String username) {
        if (mUserName.equals(username)) {
            return;
        }
        mUserName = username;
        SharedPreferences.Editor editor = sp.edit();
        editor.putString(KEY_USERNAME, mUserName);
        editor.commit();
    }

    public String getUserName() {
        return mUserName;
    }

    public void setPassword(String password) {
        if (mPassword != null && mPassword.equals(password)) {
            return;
        }
        DebugLog.d("set password:" + password);
        mPassword = password;
        SharedPreferences.Editor editor = sp.edit();
        editor.putString(KEY_PASSWORD, Base64Util.encode(AES.encrypt(mPassword.getBytes())));
        editor.commit();
    }

    public String getPassword() {
        return mPassword;
    }

    public void setLogin(boolean isLogin) {
        this.isLogin = isLogin;
    }

    public boolean isLogin() {
        return isLogin;
    }

    public void setBalance(int balance) {
        mBalance = balance;
    }

    public int getBalance() {
        return mBalance;
    }

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    public String getSexString() {
        switch (sex) {
            case SEX_FEMALE:
                return "女";
            case SEX_MALE:
                return "男";
            case SEX_SECRET:
                return "保密";
            default:
                return null;
        }
    }

    public String getRegDate() {
        return regDate;
    }

    public void setRegDate(String date) {
        regDate = date;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBirthDay() {
        return String.format("%04d-%02d-%02d", birthDay.get(Calendar.YEAR), birthDay.get(Calendar.MONTH), birthDay.get(Calendar.DAY_OF_MONTH));
        //SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.CHINA);
        //return sdf.format(birthDay);
    }

    public void setBirthDay(String date) {
        int index = date.indexOf("-");
        if (-1 == index) {
            DebugLog.e("birthday format is error:" + date);
            return;
        }
        int year = Integer.valueOf(date.substring(0, index));
        date = date.substring(index + 1);
        index = date.indexOf("-");
        if (-1 == index) {
            DebugLog.e("birthday format is error:" + date);
            return;
        }
        int month = Integer.valueOf(date.substring(0, index));
        date = date.substring(index + 1);
        int day = Integer.valueOf(date);
        DebugLog.d("set birthday: " + year + "-" + month + "-" + day);
        birthDay.set(year, month, day);
    }


    private String KEY_LAST_MESSAGE_TIME = "msgTime"; // 上次获取消息的时间
    private String KEY_LAST_MESSAGE_PAGE = "msgPage"; // 上次获取消息的页码

    public long getLastMessageTime() {
        return sp.getLong(KEY_LAST_MESSAGE_TIME, 0);
    }

    public void setLastMessageTime(long msgTimestamp) {
        long lastMsgTime = getLastMessageTime();
        if (lastMsgTime == msgTimestamp) {
            return;
        }
        SharedPreferences.Editor editor = sp.edit();
        editor.putLong(KEY_LAST_MESSAGE_TIME, msgTimestamp);
        editor.commit();
    }

    public int getLastMessagePage() {
        return sp.getInt(KEY_LAST_MESSAGE_PAGE, 0);
    }

    public void setLastMessagePage(int msgPage) {
        int lastMsgPage = getLastMessagePage();
        if (lastMsgPage == msgPage) {
            return;
        }
        SharedPreferences.Editor editor = sp.edit();
        editor.putInt(KEY_LAST_MESSAGE_PAGE, msgPage);
        editor.commit();
    }

}
