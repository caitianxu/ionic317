package com.cjszyun.myreader.reader.views;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.support.v4.util.LruCache;
import android.widget.Toast;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.ImageLoader;
import com.android.volley.toolbox.Volley;

/**
 * Created by zhuzd on 15/5/16.
 */
public class BaseActivity extends Activity {

	private Context mContext = BaseActivity.this;
	public void setContext(Context context) {
		this.mContext = context;
	}

	private RequestQueue mRequestQueue = null;

	protected RequestQueue getRequestQueue() {
		if (null == mRequestQueue) {
			mRequestQueue = Volley.newRequestQueue(mContext);
		}
		return mRequestQueue;
	}



	//see BaseFragmentActivity

	private int mCacheCount = 0;
	private ImageLoader mImageLoader = null;

	protected void initImageCacheCount(int count) {
		if (null != mImageLoader) {
			throw new RuntimeException("BaseActivity: bitmap cache count must set before getImageLoader");
		}
		mCacheCount = count;
	}

	protected ImageLoader getImageLoader() {
		if (mCacheCount <= 0) {
			throw new RuntimeException("Bitmap cache count <= 0");
		}
		final LruCache<String, Bitmap> lruCache = new LruCache<String, Bitmap>(mCacheCount);
		ImageLoader.ImageCache imageCache = new ImageLoader.ImageCache() {
			@Override
			public void putBitmap(String url, Bitmap bitmap) {
				lruCache.put(url, bitmap);
			}
			@Override
			public Bitmap getBitmap(String url) {
				return lruCache.get(url);
			}
		};
		if (mImageLoader == null) {
			mImageLoader = new ImageLoader(getRequestQueue(), imageCache);
		}
		return mImageLoader;
	}



	//see BaseFragment

	private Toast mToast;
	public void showToast(String text) {
		showToast(text, Toast.LENGTH_LONG);
	}
	public void showToast(String text, int duration) {
		if(null == mToast) {
			mToast = Toast.makeText(mContext, text, duration);
		} else {
			mToast.setText(text);
			mToast.setDuration(duration);
		}
		mToast.show();
	}
	public void cancelToast() {
		if (null != mToast) {
			mToast.cancel();
		}
	}

	private ProgressDialog mProgressDialog;
	public void showProgress(String title, String message) {
		if (null == mProgressDialog) {
			mProgressDialog = ProgressDialog.show(mContext, title, message);
		} else {
			if (! mProgressDialog.isShowing()) {
				try {
					mProgressDialog.show();
				} catch (Exception e) {
					mProgressDialog = ProgressDialog.show(mContext, title, message);
					mProgressDialog.show();
				}
			}
		}
	}
	public void hideProgress() {
		if (null != mProgressDialog && mProgressDialog.isShowing()) {
			mProgressDialog.dismiss();
		}
	}

	@Override
	protected void onPause() {
		super.onPause();
		cancelToast();
		hideProgress();
	}

}
