package com.example.racha

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.racha.data.NotificationEntity
import java.text.SimpleDateFormat
import java.util.Locale

class NotificationAdapter(var notifications: List<NotificationEntity>) : RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textMessage: TextView = view.findViewById(R.id.textNotificationMessage)
        val textTimestamp: TextView = view.findViewById(R.id.textNotificationTimestamp)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_notification, parent, false)  // Crie item_notification.xml
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val notification = notifications[position]
        holder.textMessage.text = notification.message
        val sdf = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
        holder.textTimestamp.text = sdf.format(notification.timestamp)
    }

    override fun getItemCount() = notifications.size
}