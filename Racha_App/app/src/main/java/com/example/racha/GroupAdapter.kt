package com.example.racha

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.racha.data.GroupEntity

class GroupAdapter(var groups: List<GroupEntity>) : RecyclerView.Adapter<GroupAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textGroupName: TextView = view.findViewById(R.id.textGroupName)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_group, parent, false)  // Crie item_group.xml similar a item_card
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val group = groups[position]
        holder.textGroupName.text = group.name
    }

    override fun getItemCount() = groups.size
}