package com.cjszyun.myreader.reader.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

/**
 * Created by zhuzd on 15/5/17.
 */
public class FileUtil {


	public static void createFolderIfNotExist(String dir) {
		File f = new File(dir);
		if (! f.exists()) {
			f.mkdirs();
		}
	}

	public static boolean createFileIfNotExist(File f) {
		if (f.exists()) {
			return true;
		}
		try {
			f.createNewFile();
			return true;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	public static String readFile(final String filePath) {
		RandomAccessFile raFile = null;
		try {
			File f = new File(filePath);
			long len = f.length();
			raFile = new RandomAccessFile(filePath, "r");
			MappedByteBuffer mbBuffer = raFile.getChannel().map(FileChannel.MapMode.READ_ONLY, 0, len);
			byte[] byteBuffer = new byte[(int) len];
			mbBuffer.get(byteBuffer);
			return new String(byteBuffer);
		} catch (FileNotFoundException e) {
			if (DebugLog.isDebuggable()) {
				e.printStackTrace();
			}
		} catch (IOException e) {
			if (DebugLog.isDebuggable()) {
				e.printStackTrace();
			}
		} finally {
			if (raFile != null)
				try { raFile.close(); } catch (IOException e) { if (DebugLog.isDebuggable()) e.printStackTrace(); }
		}
		return null;
	}

	public static boolean writeFile(final String filePath, final String content) {
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(filePath);
			fos.write(content.getBytes());
			return true;
		} catch (Exception e) {
			if (DebugLog.isDebuggable()) {
				e.printStackTrace();
			}
		} finally {
			if (fos != null)
				try { fos.close(); } catch (IOException e) { if (DebugLog.isDebuggable()) e.printStackTrace(); }
		}
		return false;
	}
	public static Bitmap File2BitmapUpload(String srcPath,float width,float hight)
	{
		BitmapFactory.Options newOpts = new BitmapFactory.Options();
		// 开始读入图片，此时把options.inJustDecodeBounds 设回true了
		newOpts.inJustDecodeBounds = true;
		Bitmap bitmap = BitmapFactory.decodeFile(srcPath, newOpts);// 此时返回bm为空
		newOpts.inJustDecodeBounds = false;
		int w = newOpts.outWidth;
		int h = newOpts.outHeight;

		float hh = hight;// 这里设置高度为800f
		float ww = width;// 这里设置宽度为480f
		// 缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
		int be = 1;// be=1表示不缩放
		if (w > h && w > ww)
		{// 如果宽度大的话根据宽度固定大小缩放
			be = (int) (newOpts.outWidth / ww);
		}
		else if (w < h && h > hh)
		{// 如果高度高的话根据宽度固定大小缩放
			be = (int) (newOpts.outHeight / hh);
		}
		if (be <= 0)
			be = 1;
		newOpts.inSampleSize = be;// 设置缩放比例
		// 重新读入图片，注意此时已经把options.inJustDecodeBounds 设回false了
		bitmap = BitmapFactory.decodeFile(srcPath, newOpts);
//		return compressImage(bitmap);// 压缩好比例大小后再进行质量压缩
		return fitBitmap(bitmap, (int) width, 0);
	}
	/**
	 * fuction: 设置固定的宽度，高度随之变化，使图片不会变形
	 *
	 * @param target
	 * 需要转化bitmap参数
	 * @param newWidth
	 * 设置新的宽度
	 * @return
	 */
	public static Bitmap fitBitmap(Bitmap target, int newWidth, int newHeight)
	{
		int width = target.getWidth();
		int height = target.getHeight();
		Matrix matrix = new Matrix();
		float scaleWidth = ((float) newWidth) / width;
		float scaleHeight = ((float)newHeight) / height;
//		int newHeight = (int) (scaleWidth * height);
		if (scaleHeight>0){
			matrix.postScale(scaleWidth, scaleHeight);
		}else {
			matrix.postScale(scaleWidth, scaleWidth);
		}
		Bitmap bmp = Bitmap.createBitmap(target, 0, 0, width, height, matrix,
				true);
		if (target != null && !target.equals(bmp) && !target.isRecycled())
		{
			target.recycle();
			target = null;
		}
		return bmp;// Bitmap.createBitmap(target, 0, 0, width, height, matrix,
		// true);
	}

}
