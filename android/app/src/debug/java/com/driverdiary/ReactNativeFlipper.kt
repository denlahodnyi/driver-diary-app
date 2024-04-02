package com.driverdiary

import android.content.Context
import android.os.Build
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.core.FlipperClient
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin
import com.facebook.flipper.plugins.fresco.FrescoFlipperPlugin
import com.facebook.flipper.plugins.inspector.DescriptorMapping
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
//import com.facebook.flipper.plugins.react.ReactFlipperPlugin
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.network.NetworkingModule
import com.facebook.flipper.plugins.databases.impl.SqliteDatabaseDriver
import com.facebook.flipper.plugins.databases.impl.SqliteDatabaseProvider
import okhttp3.OkHttpClient
import java.io.File
import java.util.List
import java.util.ArrayList
import android.util.Log
import androidx.annotation.RequiresApi


class ReactNativeFlipper {
    companion object {
        @JvmStatic
        fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
            if (FlipperUtils.shouldEnableFlipper(context)) {
                val client: FlipperClient = AndroidFlipperClient.getInstance(context)
                client.addPlugin(InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()))
                // client.addPlugin(ReactFlipperPlugin())
                // client.addPlugin(DatabasesFlipperPlugin(context))

                client.addPlugin(DatabasesFlipperPlugin(SqliteDatabaseDriver(context, object : SqliteDatabaseProvider {
                    @RequiresApi(Build.VERSION_CODES.N)
                    override fun getDatabaseFiles(): ArrayList<File> {
                        val databaseFiles = ArrayList<File>()
                        for (databaseName in context!!.databaseList()) {
                            databaseFiles.add(context.getDatabasePath(databaseName))
                        }

                        val dir = context.dataDir
                        val files = dir.listFiles { d, name -> name.endsWith(".db") }
                        for (i in files.indices) {
                            databaseFiles.add(files[i])
                        }
                        return databaseFiles
                    }
                })))

                client.addPlugin(SharedPreferencesFlipperPlugin(context))
                client.addPlugin(CrashReporterPlugin.getInstance())
                val networkFlipperPlugin = NetworkFlipperPlugin()
                NetworkingModule.setCustomClientBuilder(object : NetworkingModule.CustomClientBuilder {
                    override fun apply(builder: OkHttpClient.Builder) {
                        builder.addNetworkInterceptor(FlipperOkhttpInterceptor(networkFlipperPlugin))
                    }
                })
                client.addPlugin(networkFlipperPlugin)
                client.start()

                // Fresco Plugin needs to ensure that ImagePipelineFactory is initialized
                // Hence we run if after all native modules have been initialized
                // val reactContext: ReactContext = reactInstanceManager.getCurrentReactContext()
                // if (reactContext == null) {
                //     reactInstanceManager.addReactInstanceEventListener(
                //             object : ReactInstanceEventListener() {
                //                 @Override
                //                 fun onReactContextInitialized(reactContext: ReactContext) {
                //                     reactInstanceManager.removeReactInstanceEventListener(this)
                //                     reactContext.runOnNativeModulesQueueThread(
                //                             object : Runnable() {
                //                                 @Override
                //                                 fun run() {
                //                                     client.addPlugin(FrescoFlipperPlugin())
                //                                 }
                //                             })
                //                 }
                //             })
                // } else {
                //     client.addPlugin(FrescoFlipperPlugin())
                // }
            }
        }
    }
}
