package com.cjszyun.myreader.reader.utils;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import java.util.Map;

/**
 * Created by Administrator on 2017/2/23 0023.
 */

public class SharedPreUtil {
    public static String DOWNLOADCOUNTFILE = "downloadCountFile";
    public static String DOWNLOADCOUNTKEY = "downloadCountKey";
    public static String FILENAME = "config";
    public static String INSTALLFILE = "installFile";
    public static String INSTALLKEY = "installKey";
    public static String VERSIONNAMEKEY = "versionNameKey";

    public static synchronized void writeData(Context context, String key, String value) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(FILENAME, Activity.MODE_PRIVATE);
        SharedPreferences.Editor editor = mySharePreferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static synchronized void writeData(Context context, String key, String value, String fileName) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(fileName, Activity.MODE_PRIVATE);
        SharedPreferences.Editor editor = mySharePreferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static synchronized String readData(Context context, String key) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(FILENAME, Activity.MODE_PRIVATE);
        return mySharePreferences.getString(key, "");
    }

    public static synchronized String readData(Context context, String key, String fileName) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(fileName, Activity.MODE_PRIVATE);
        return mySharePreferences.getString(key, "");
    }

    public static synchronized void clearData(Context context, String key, String fileName) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(fileName, Activity.MODE_PRIVATE);
        mySharePreferences.edit().remove(key).commit();
    }

    public static synchronized void clearData(Context context, String key) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(FILENAME, Activity.MODE_PRIVATE);
        mySharePreferences.edit().remove(key).commit();
    }

    public static synchronized Map<String, ?> getAll(Context context, String fileName) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(fileName, Activity.MODE_PRIVATE);
        return mySharePreferences.getAll();
    }
    public static synchronized void clearAll(Context context, String fileName) {
        SharedPreferences mySharePreferences = context.
                getSharedPreferences(fileName, Activity.MODE_PRIVATE);
        mySharePreferences.edit().clear().apply();
    }
}