package com.cjszyun.myreader.reader.beans;

/**
 * Created by Administrator on 2017/10/28 0028.
 */

public class BookBuyBean {
    /**
     * code : 0
     * data : {"balance":15281}
     * message : 操作成功！
     */

    public int code;
    public DataBean data;
    public String message;

    public static class DataBean {

        public int balance;
        public int amount;
        public int buyed;
        public int count;
        public int price;
        public double cost;//出版图书价格
    }
}
