package com.cjszyun.myreader.reader.enginee;

import android.os.Message;
import android.util.Log;

import com.cjszyun.myreader.reader.AppData;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by wsm on 2017/9/29 0029.
 */

public class DownloadEpubPicTask implements Runnable {

    private final String source;
    private final int bookId;
    private final DownloadEpubPicInterface downloadEpubPicInterface;
    private boolean stop;

    public DownloadEpubPicTask(String source, int bookId,DownloadEpubPicInterface downloadEpubPicInterface) {
        this.source = source;
        this.bookId = bookId;
        this.downloadEpubPicInterface = downloadEpubPicInterface;
    }

    @Override
    public void run() {
        try {
            download();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            AppData.getDownloadEpubPicMap().remove(source);
            if (AppData.getDownloadEpubPicMap().size()==0){
                downloadEpubPicInterface.downloadFinish();
            }
        }
    }

    private void download() {
        URL url;
        InputStream inputStream = null;
        OutputStream outputStream = null;
        HttpURLConnection urlCon;
        String substring = source.substring(source.lastIndexOf("/"));
        String savePath = AppData.getConfig().getReadCacheRoot()+"/"+bookId+"epub"+substring;
        File file = new File(savePath);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }

        try {
            file.createNewFile();
            url = new URL(source);
            urlCon = (HttpURLConnection) url.openConnection();
            urlCon.setRequestMethod("GET");
            urlCon.setDoInput(true);
            urlCon.connect();
            int fileLength = urlCon.getContentLength();
            long length = file.length();
            //urlCon有问题
            if (fileLength <= 0) {
                //下载地址异常
                Log.i("Myapplication", "下载来源不存在 downloadUrl = " + source);
                return;
            }

            Log.i("Myapplication", "正在下载 ：" + source);

            inputStream = urlCon.getInputStream();
            outputStream = new FileOutputStream(file);
            byte buffer[] = new byte[10 * 1024];
            int bufferLength = 0;
            int total = 0;
            while (!stop && (bufferLength = inputStream.read(buffer)) > 0) {
                    total += bufferLength;
                    Message msg = new Message();
                    msg.what = 1;
                    msg.arg1 = (int) (total * 100f / fileLength);

                outputStream.write(buffer, 0, bufferLength);
            }
            outputStream.flush();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("下载出错downloadUrl = " + source + "  savePath = " + savePath);

        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            try {
                if (outputStream != null) {
                    outputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    //停止下载
    public void stop() {
        stop = true;
    }


    /**
     * Created by Administrator on 2017/9/30 0030.
     */

    public interface DownloadEpubPicInterface {
        void downloadFinish();
    }
}
